const fs = require("fs");
const path = require("path");

// ─── Frontmatter Parser (reused from validate-skill.js) ───
function parseFrontmatter(content) {
  const cleaned = content.replace(/^\uFEFF/, "");
  const fmMatch = cleaned.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;
  const fmText = fmMatch[1];
  const result = {};
  let currentKey = null;
  let currentSubKey = null;

  for (const line of fmText.split("\n")) {
    if (!line.trim()) continue;
    const indent = line.length - line.trimStart().length;
    const kvMatch = line.match(/^(\s*)([\w_-]+):\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[2].trim();
      const rawValue = kvMatch[3].trim();
      let value = rawValue.replace(/^["']|["']$/g, "");
      if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
        try { value = JSON.parse(rawValue.replace(/'/g, '"')); } catch { value = rawValue; }
      }
      if (indent === 0) {
        result[key] = value;
        currentKey = key;
        currentSubKey = null;
      } else if (currentKey && indent > 0) {
        if (typeof result[currentKey] === "string") result[currentKey] = { _value: result[currentKey] };
        if (typeof result[currentKey] === "object" && !Array.isArray(result[currentKey])) {
          result[currentKey][key] = value;
          currentSubKey = key;
        }
      }
    } else if (line.trim().startsWith("- ") && currentKey) {
      const itemValue = line.trim().slice(2).trim().replace(/^["']|["']$/g, "");
      if (indent <= 2) {
        if (!Array.isArray(result[currentKey])) result[currentKey] = [];
        result[currentKey].push(itemValue);
      } else if (currentSubKey && typeof result[currentKey] === "object" && !Array.isArray(result[currentKey])) {
        if (!Array.isArray(result[currentKey][currentSubKey])) result[currentKey][currentSubKey] = [];
        result[currentKey][currentSubKey].push(itemValue);
      }
    }
  }
  if (result.metadata && typeof result.metadata === "object") {
    if (result.metadata._value) delete result.metadata._value;
  }
  return result;
}

function findAllSkills(rootDir) {
  const skills = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.name === "templates" || entry.name === "node_modules" || entry.name === "skill-finder") continue;
      if (entry.isDirectory()) walk(fullPath);
      else if (entry.name === "SKILL.md") skills.push(fullPath);
    }
  }
  walk(rootDir);
  return skills;
}

// ─── Domain inference from module name (not path) ───
const MODULE_DOMAIN_MAP = {
  "产品探索与发现": "pm", "产品商业与战略": "pm", "产品构思与设计": "pm",
  "产品度量设计": "pm", "产品度量运营": "pm", "产品增长与运营": "pm",
  "产品监控与迭代": "pm", "项目管理与执行": "pm",
  "UI设计系统": "ui", "UI前端开发": "ui", "UI集成与交付": "ui",
  "UI设计与前端开发": "ui",
  "后端API设计": "backend", "后端数据架构": "backend", "后端架构实现": "backend",
  "后端架构与开发": "backend",
  "跨领域": "cross-domain", "跨领域协调": "cross-domain",
  "产品方法论": "pm", "导航入口": "pm",
};

const MODULE_LIFECYCLE_MAP = {
  "产品探索与发现": "discovery", "产品商业与战略": "strategy", "产品构思与设计": "design",
  "产品度量设计": "metrics-design", "产品度量运营": "metrics-ops", "产品增长与运营": "growth",
  "产品监控与迭代": "monitoring", "项目管理与执行": "project",
  "UI设计系统": "ui-design", "UI前端开发": "ui-frontend", "UI集成与交付": "ui-integration",
  "UI设计与前端开发": "ui",
  "后端API设计": "api", "后端数据架构": "data", "后端架构实现": "backend-arch",
  "后端架构与开发": "backend",
  "跨领域": "cross-domain", "跨领域协调": "cross-domain",
  "产品方法论": "guide", "导航入口": "guide",
};

// ─── Extract keywords from description for compact indexing ───
function extractKeywords(description) {
  if (!description) return "";
  // Try to extract the "关键词：" section which contains curated keywords
  const kwMatch = description.match(/关键词[：:]\s*(.+?)(?:。|$)/);
  if (kwMatch) {
    // Split by Chinese comma,、or 、
    const kws = kwMatch[1].split(/[、,，]/).map(s => s.trim()).filter(s => s.length > 0 && s.length <= 10);
    return kws.slice(0, 5).join("|");
  }
  // Fallback: extract noun phrases from the "当需要...时使用" section
  const triggerMatch = description.match(/当需要(.+?)时使用/);
  if (triggerMatch) {
    const text = triggerMatch[1];
    const phrases = text.split(/[，,、]/).map(s => s.trim()).filter(s => s.length >= 2 && s.length <= 10);
    return phrases.slice(0, 6).join("|");
  }
  return "";
}

// ─── CSV escaping ───
function csvEscape(str) {
  if (!str) return "";
  if (typeof str !== "string") str = String(str);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// ─── Parse orchestrator pipeline YAML ───
function parsePipelineYAML(content) {
  const stages = [];
  const stageRegex = /- id:\s*(\S+)\s*\n\s*name:\s*["']?(.+?)["']?\s*\n[\s\S]*?skills:\s*\[([^\]]+)\]/g;
  let match;
  while ((match = stageRegex.exec(content)) !== null) {
    stages.push({
      id: match[1],
      name: match[2].trim(),
      skills: match[3].split(",").map(s => s.trim()).filter(Boolean),
    });
  }
  return stages;
}

// ─── Build skill-index.csv (compact format) ───
function buildSkillIndex(skillsData) {
  // name,type,domain,lifecycle,triggers,keywords
  // Dropped: module (infer from domain+lifecycle), scene (too verbose), output_concept (low value), industry (low match value)
  const header = "name,type,domain,lifecycle,triggers,keywords";
  const rows = skillsData.map(s => {
    const triggers = (s.trigger_examples || []).slice(0, 2).join("|");
    const keywords = extractKeywords(s.description);
    return [
      csvEscape(s.name),
      csvEscape(s.type),
      csvEscape(s.domain),
      csvEscape(s.lifecycle),
      csvEscape(triggers),
      csvEscape(keywords),
    ].join(",");
  });
  return [header, ...rows].join("\n");
}

// ─── Build skill-relationships.csv ───
function buildRelationships(skillsData) {
  const orchestrators = skillsData.filter(s => s.type === "orchestrator" && s.pipelineStages);
  const rels = [];
  const header = "source,target,rel,contract";

  for (const orch of orchestrators) {
    for (const stage of orch.pipelineStages) {
      for (const target of (stage.skills || [])) {
        if (target !== orch.name) {
          rels.push([orch.name, target, "orch", stage.name || ""].map(csvEscape).join(","));
        }
      }
    }
  }

  // Known data contract relationships (pipeline → pipeline)
  const contracts = [
    ["design-prd", "api-design-spec", "feed", "PRD"],
    ["design-prd", "change-impact-analysis", "feed", "PRD"],
    ["api-design-spec", "data-architecture-spec", "feed", "API契约"],
    ["data-architecture-spec", "backend-architecture-impl", "feed", "数据架构"],
    ["design-prototype", "design-handoff-spec", "feed", "原型稿"],
    ["metrics-system", "tracking-plan", "feed", "指标体系"],
    ["metrics-system", "analysis-anomaly", "feed", "指标体系"],
    ["analysis-anomaly", "analysis-funnel", "comp", ""],
    ["analysis-funnel", "analysis-retention", "comp", ""],
    ["growth-model", "acquisition-analysis", "feed", "增长模型"],
    ["growth-model", "retention-management", "feed", "增长模型"],
    ["business-model-canvas", "business-pricing", "feed", "商业模式"],
    ["positioning-strategy", "design-prototype", "feed", "定位"],
    ["experiment-design", "experiment-execution", "feed", "实验方案"],
    ["validation-mvp", "validation-experiment", "feed", "MVP结果"],
    ["risk-identification", "risk-management", "feed", "风险册"],
    ["quality-acceptance", "release-gradual", "feed", "验收报告"],
    ["release-gradual", "release-notes", "feed", "发布记录"],
    ["planning-okr", "planning-roadmap", "feed", "OKR"],
    ["diagnosis-health", "iteration-decision", "feed", "健康报告"],
    ["user-research-report", "insight-analysis", "feed", "研究报告"],
    ["opportunity-definition", "business-value-fit", "feed", "机会定义"],
  ];

  for (const c of contracts) {
    rels.push(c.map(csvEscape).join(","));
  }

  // Deduplicate
  const seen = new Set();
  const unique = [];
  for (const row of rels) {
    if (!seen.has(row)) { seen.add(row); unique.push(row); }
  }

  return [header, ...unique].join("\n");
}

// ─── Build execution-templates.csv ───
function buildExecutionTemplates() {
  const header = "id,scenario,sequence,domains";
  const templates = [
    ["tpl-1", "从0到1做SaaS/B端", "insight→market→business→positioning→design→metrics→api-design→data-arch→backend-arch→ui→release", "pm,backend,ui"],
    ["tpl-2", "从0到1做C端/移动端", "user-research→insight→opportunity→positioning→design→metrics→ui→api-design→release", "pm,ui,backend"],
    ["tpl-3", "数据驱动优化", "analysis→decision→design→metrics→release→experiment", "pm"],
    ["tpl-4", "增长突破", "growth→acquisition/activation/retention/revenue→experiment→release", "pm"],
    ["tpl-5", "功能迭代", "design→change-impact→api-design→data-arch→backend-arch→ui→release", "pm,backend,ui"],
    ["tpl-6", "后端架构设计", "api-design→data-arch→backend-arch", "backend"],
    ["tpl-7", "UI设计与前端", "ui", "ui"],
    ["tpl-8", "监控与诊断", "monitoring→diagnosis→iteration", "pm"],
  ];
  return [header, ...templates.map(t => t.map(csvEscape).join(","))].join("\n");
}

// ─── Build domain-lifecycle-map.csv ───
function buildDomainLifecycleMap() {
  const header = "domain,lifecycle,description";
  const rows = [
    ["pm", "discovery", "用户研究、市场洞察、机会定义"],
    ["pm", "strategy", "商业模式、定位、规划、利益相关者"],
    ["pm", "design", "PRD、原型、验证、交互规范"],
    ["pm", "metrics-design", "指标体系、埋点方案"],
    ["pm", "metrics-ops", "数据分析、实验、决策"],
    ["pm", "growth", "获客、激活、留存、变现"],
    ["pm", "monitoring", "监控、诊断、迭代、验收发布"],
    ["pm", "project", "项目规划、敏捷、风险管理"],
    ["ui", "ui-design", "设计系统、交互设计"],
    ["ui", "ui-frontend", "前端实现、组件开发"],
    ["ui", "ui-integration", "API集成、前端交付"],
    ["backend", "api", "API规范、接口设计"],
    ["backend", "data", "数据模型、存储设计"],
    ["backend", "backend-arch", "架构设计、技术实现"],
    ["cross-domain", "cross-domain", "跨领域编排与协作"],
  ];
  return [header, ...rows.map(r => r.map(csvEscape).join(","))].join("\n");
}

// ─── Build synonym-map.csv ───
function buildSynonymMap() {
  const header = "user_expression,mapped_trigger,mapped_domain";
  const rows = [
    // 否定表达
    ["用户不活跃", "留存下降/用户流失", "growth"],
    ["数据不好", "数据异常/指标异常", "metrics-ops"],
    ["没人用", "留存低/激活率低", "growth"],
    ["收入下降", "变现效率低/NRR下降", "growth"],
    ["响应慢", "系统性能/加缓存", "backend"],
    ["查询慢", "数据库优化/索引", "data"],
    ["挂了", "线上故障/监控告警", "monitoring"],
    ["打不开", "可用性/监控告警", "monitoring"],
    ["付费转化差", "变现漏斗/收入转化", "growth"],
    ["用户不续费", "NRR下降/续费率低", "growth"],
    // 口语化
    ["做竞品分析", "竞品调研/竞争分析", "strategy"],
    ["做用户画像", "Persona/用户建模", "discovery"],
    ["埋点", "事件追踪/tracking", "metrics-design"],
    ["写接口文档", "API设计/OpenAPI", "api"],
    ["画原型", "交互原型/UI设计", "design"],
    ["出设计稿", "UI设计/设计系统", "ui-design"],
    ["加功能", "需求变更/功能迭代", "design"],
    ["改需求", "需求变更/变更影响", "design"],
    ["做活动", "运营活动/GTM", "growth"],
    ["估算市场", "TAM/SAM/SOM", "strategy"],
    ["定价格", "定价策略/商业化", "strategy"],
    ["做OKR", "目标制定/OKR", "project"],
    ["排期", "项目规划/Sprint", "project"],
    ["做复盘", "迭代复盘/Review", "project"],
    ["上线", "灰度发布/版本发布", "monitoring"],
    ["做A/B测试", "实验设计/效果验证", "metrics-ops"],
    ["看数据", "数据分析/指标分析", "metrics-ops"],
    ["做漏斗", "漏斗分析/转化分析", "metrics-ops"],
    ["留存分析", "用户留存/留存曲线", "metrics-ops"],
    ["异常检测", "数据异常/监控告警", "monitoring"],
    ["数据库设计", "数据架构/数据模型", "data"],
    ["技术选型", "架构设计/技术方案", "backend-arch"],
    ["前端开发", "UI前端/组件开发", "ui-frontend"],
    ["设计规范", "设计系统/Token", "ui-design"],
    ["做商业模式", "商业画布/商业模式", "strategy"],
    ["竞品监控", "竞争跟踪/竞品报告", "monitoring"],
    ["风险排查", "风险识别/风险管理", "project"],
    ["需求优先级", "需求排序/迭代决策", "design"],
    ["产品下线", "产品退役/Sunset", "monitoring"],
    // 行业术语
    ["DAU掉了", "DAU下降/用户流失", "growth"],
    ["GMV", "交易额/收入分析", "growth"],
    ["转化率低", "漏斗转化/转化优化", "metrics-ops"],
    ["获客成本高", "CAC分析/获客效率", "growth"],
    ["LTV", "用户生命周期价值/变现", "growth"],
    ["MVP", "最小可行产品/验证", "design"],
    ["PRD", "产品需求文档/需求分析", "design"],
    ["SLA", "服务水平协议/监控", "monitoring"],
  ];
  return [header, ...rows.map(r => r.map(csvEscape).join(","))].join("\n");
}

// ─── Main ───
function main() {
  const rootDir = path.resolve(__dirname, "..");
  const skillsDir = path.join(rootDir, "skills");
  const outputDir = path.join(rootDir, "skills", "skill-finder", "index");

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const skillFiles = findAllSkills(skillsDir);
  console.log(`Found ${skillFiles.length} skills`);

  const skillsData = [];
  for (const skillPath of skillFiles) {
    const content = fs.readFileSync(skillPath, "utf-8");
    const fm = parseFrontmatter(content);
    if (!fm) continue;

    const meta = fm.metadata || {};
    const module = meta.module || "";
    const subModule = meta["sub-module"] || "";
    let domain = MODULE_DOMAIN_MAP[module] || MODULE_DOMAIN_MAP[subModule] || "unknown";
    let lifecycle = MODULE_LIFECYCLE_MAP[module] || MODULE_LIFECYCLE_MAP[subModule] || module;

    // Fallback: infer domain from skill name prefix
    if (domain === "unknown") {
      if (fm.name.startsWith("api-") || fm.name.startsWith("data-architecture-") || fm.name.startsWith("backend-")) domain = "backend";
      else if (fm.name.startsWith("ui-") || fm.name.startsWith("ext-") || fm.name === "page-builder" || fm.name === "production-ready" || fm.name === "project-init" || fm.name === "api-integration") domain = "ui";
      else if (fm.name.startsWith("product-")) domain = "cross-domain";
    }

    let pipelineStages = null;
    if (meta.type === "orchestrator") pipelineStages = parsePipelineYAML(content);

    skillsData.push({
      name: fm.name,
      type: meta.type || "pipeline",
      domain,
      module,
      lifecycle,
      description: fm.description || "",
      trigger_examples: meta.trigger_examples || [],
      domain_tags: meta.domain_tags || [],
      pipelineStages,
    });
  }

  // Sort: guide first, then orchestrator, then pipeline
  const typeOrder = { guide: 0, orchestrator: 1, pipeline: 2, extension: 3 };
  skillsData.sort((a, b) => (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9) || a.name.localeCompare(b.name));

  const indexCSV = buildSkillIndex(skillsData);
  const relCSV = buildRelationships(skillsData);
  const templateCSV = buildExecutionTemplates();
  const lifecycleCSV = buildDomainLifecycleMap();
  const synonymCSV = buildSynonymMap();

  fs.writeFileSync(path.join(outputDir, "skill-index.csv"), indexCSV, "utf-8");
  fs.writeFileSync(path.join(outputDir, "skill-relationships.csv"), relCSV, "utf-8");
  fs.writeFileSync(path.join(outputDir, "execution-templates.csv"), templateCSV, "utf-8");
  fs.writeFileSync(path.join(outputDir, "domain-lifecycle-map.csv"), lifecycleCSV, "utf-8");
  fs.writeFileSync(path.join(outputDir, "synonym-map.csv"), synonymCSV, "utf-8");

  // Stats
  console.log(`\nGenerated CSV files in: ${outputDir}`);
  console.log(`  skill-index.csv:        ${skillsData.length} skills, ${Buffer.byteLength(indexCSV, 'utf-8')} bytes`);
  console.log(`  skill-relationships.csv: ${relCSV.split("\n").length - 1} rows, ${Buffer.byteLength(relCSV, 'utf-8')} bytes`);
  console.log(`  execution-templates.csv: ${templateCSV.split("\n").length - 1} rows, ${Buffer.byteLength(templateCSV, 'utf-8')} bytes`);
  console.log(`  domain-lifecycle-map.csv: ${lifecycleCSV.split("\n").length - 1} rows, ${Buffer.byteLength(lifecycleCSV, 'utf-8')} bytes`);
  console.log(`  synonym-map.csv:         ${synonymCSV.split("\n").length - 1} rows, ${Buffer.byteLength(synonymCSV, 'utf-8')} bytes`);

  // Token estimation
  const totalBytes = [indexCSV, relCSV, templateCSV, lifecycleCSV, synonymCSV].reduce((sum, csv) => sum + Buffer.byteLength(csv, 'utf-8'), 0);
  console.log(`\nTotal size: ${totalBytes} bytes, estimated ~${Math.round(totalBytes / 3)} tokens (CJK)`);

  // Verify domain coverage
  const unknownDomain = skillsData.filter(s => s.domain === "unknown");
  if (unknownDomain.length > 0) {
    console.log(`\n⚠️  ${unknownDomain.length} skills with unknown domain:`);
    unknownDomain.forEach(s => console.log(`  - ${s.name} (module: ${s.module})`));
  }
}

main();
