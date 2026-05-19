const fs = require("fs");
const path = require("path");

const VALID_TYPES = new Set(["pipeline", "orchestrator", "guide", "extension"]);
const VALID_INTERACTION_MODES = new Set([
  "ai_auto",
  "ai_suggest_human_approve",
  "human_ai_collaborate",
]);

const OUTPUT_PATH_MAP = {
  "pm-skill": [
    "pm-discovery",
    "pm-strategy",
    "pm-design",
    "pm-metrics-design",
    "pm-metrics-ops",
    "pm-growth",
    "pm-monitoring",
    "pm-project",
    "approvals",
    "phase-reports",
  ],
  "ui-skill": ["ui-design-system", "ui-frontend", "ui-frontend-integration", "ui", "ui-project-init", "checkpoints", "approvals", "phase-reports"],
  "backend-skill": [
    "backend-api-design",
    "backend-data-architecture",
    "backend-architecture",
    "backend-design-review",
    "approvals",
    "phase-reports",
  ],
  "cross-domain": ["cross-domain", "phase-reports", "approvals"],
};

const ALL_VALID_OUTPUT_PREFIXES = Object.values(OUTPUT_PATH_MAP).flat();

const ALLOWED_CROSS_DOMAIN_OUTPUT_REFS = {
  "pm-skill": [
    "backend-api-design",
    "backend-architecture",
    "ui-project-init",
    "ui-frontend",
  ],
  "ui-skill": [
    "pm-strategy",
    "pm-design",
    "backend-api-design",
  ],
  "backend-skill": [
    "pm-design",
    "ui-frontend",
  ],
  "cross-domain": [
    "pm-discovery",
    "pm-strategy",
    "pm-design",
    "pm-metrics-design",
    "pm-metrics-ops",
    "pm-growth",
    "pm-monitoring",
    "pm-project",
    "ui-design-system",
    "ui-frontend",
    "ui-frontend-integration",
    "ui",
    "ui-project-init",
    "backend-api-design",
    "backend-data-architecture",
    "backend-architecture",
    "backend-design-review",
  ],
};

function parseFrontmatter(content) {
  const cleaned = content.replace(/^\uFEFF/, '');
  const fmMatch = cleaned.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;
  const fmText = fmMatch[1];
  const result = {};
  let currentKey = null;
  let currentSubKey = null;
  let currentIndent = 0;

  for (const line of fmText.split("\n")) {
    if (!line.trim()) continue;
    const indent = line.length - line.trimStart().length;
    const kvMatch = line.match(/^(\s*)([\w_-]+):\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[2].trim();
      const rawValue = kvMatch[3].trim();
      let value = rawValue.replace(/^["']|["']$/g, "");

      if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
        try {
          value = JSON.parse(rawValue.replace(/'/g, '"'));
        } catch (e) {
          value = rawValue;
        }
      }

      if (indent === 0) {
        result[key] = value;
        currentKey = key;
        currentSubKey = null;
      } else if (currentKey && indent > 0) {
        if (typeof result[currentKey] === "string") {
          result[currentKey] = { _value: result[currentKey] };
        }
        if (typeof result[currentKey] === "object" && !Array.isArray(result[currentKey])) {
          result[currentKey][key] = value;
          currentSubKey = key;
        }
      }
    } else if (line.trim().startsWith("- ") && currentKey) {
      const itemValue = line.trim().slice(2).trim().replace(/^["']|["']$/g, "");
      if (indent <= 2) {
        if (!Array.isArray(result[currentKey])) {
          result[currentKey] = [];
        }
        result[currentKey].push(itemValue);
      } else if (currentSubKey && typeof result[currentKey] === "object" && !Array.isArray(result[currentKey])) {
        if (!Array.isArray(result[currentKey][currentSubKey])) {
          result[currentKey][currentSubKey] = [];
        }
        result[currentKey][currentSubKey].push(itemValue);
      }
    }
  }

  if (result.metadata && typeof result.metadata === "object") {
    if (result.metadata._value) delete result.metadata._value;
  }

  return result;
}

function detectDomain(skillPath) {
  const parts = skillPath.replace(/\\/g, "/").split("/");
  for (const part of parts) {
    if (OUTPUT_PATH_MAP[part]) return part;
  }
  return null;
}

function validateFrontmatter(fm, skillPath) {
  const errors = [];
  const warnings = [];

  if (!fm) {
    errors.push(["frontmatter", "Missing YAML frontmatter (--- delimiters)"]);
    return { errors, warnings };
  }

  const requiredFields = ["name", "description", "metadata"];
  for (const field of requiredFields) {
    if (!(field in fm)) {
      errors.push([`frontmatter.${field}`, `Missing required field: ${field}`]);
    }
  }

  if ("name" in fm) {
    const name = fm.name;
    const parentDir = path.basename(path.dirname(skillPath));
    if (name !== parentDir) {
      errors.push([
        "frontmatter.name",
        `name field '${name}' does not match parent directory '${parentDir}'`,
      ]);
    }
    if (/[A-Z_]/.test(name)) {
      errors.push([
        "frontmatter.name",
        `name '${name}' should use lowercase with hyphens (no uppercase or underscores)`,
      ]);
    }
  }

  if ("description" in fm) {
    const desc = fm.description;
    if (!desc.startsWith("当需要") && !desc.startsWith("When ")) {
      warnings.push([
        "frontmatter.description",
        "description should start with trigger pattern: '当需要{场景}时使用'",
      ]);
    }
    if (!desc.includes("关键词") && !desc.toLowerCase().includes("keywords")) {
      warnings.push([
        "frontmatter.description",
        "description should include keywords section: '关键词：...'",
      ]);
    }
  }

  if (typeof fm.metadata === "object" && fm.metadata !== null && !Array.isArray(fm.metadata)) {
    const meta = fm.metadata;
    const requiredMeta = ["module", "sub-module", "type", "version"];
    for (const field of requiredMeta) {
      if (!(field in meta)) {
        errors.push([
          `frontmatter.metadata.${field}`,
          `Missing required metadata field: ${field}`,
        ]);
      }
    }

    if ("type" in meta && !VALID_TYPES.has(meta.type)) {
      errors.push([
        "frontmatter.metadata.type",
        `Invalid type '${meta.type}', must be one of: ${[...VALID_TYPES].join(", ")}`,
      ]);
    }

    if (
      "interaction_mode" in meta &&
      !VALID_INTERACTION_MODES.has(meta.interaction_mode)
    ) {
      errors.push([
        "frontmatter.metadata.interaction_mode",
        `Invalid interaction_mode '${meta.interaction_mode}', must be one of: ${[...VALID_INTERACTION_MODES].join(", ")}`,
      ]);
    }

    if ("domain_tags" in meta) {
      if (!Array.isArray(meta.domain_tags)) {
        warnings.push([
          "frontmatter.metadata.domain_tags",
          "domain_tags should be an array of industry tags, e.g. [\"电商\", \"SaaS\", \"通用\"]",
        ]);
      }
    }

    if ("trigger_examples" in meta) {
      if (!Array.isArray(meta.trigger_examples)) {
        warnings.push([
          "frontmatter.metadata.trigger_examples",
          "trigger_examples should be an array of natural language examples",
        ]);
      } else if (meta.trigger_examples.length < 2) {
        warnings.push([
          "frontmatter.metadata.trigger_examples",
          "trigger_examples should have at least 2 examples for better intent matching",
        ]);
      }
    }
  } else {
    errors.push([
      "frontmatter.metadata",
      "metadata must be a YAML mapping with indented fields",
    ]);
  }

  return { errors, warnings };
}

function validateStructure(content, skillType) {
  const errors = [];
  const warnings = [];
  const sections = [];
  const regex = /^##\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    sections.push(match[1]);
  }

  let requiredSections = [];
  let recommendedSections = [];

  if (skillType === "pipeline") {
    requiredSections = [
      "核心原则",
      "交互模式",
      "输入",
      "执行步骤",
      "输出",
      "质量检查",
    ];
    recommendedSections = ["降级策略", "决策规则"];
  } else if (skillType === "orchestrator") {
    requiredSections = [
      "核心原则",
      "阶段执行计划",
      "阶段卡口",
    ];
    recommendedSections = ["编排协议", "人类决策点", "异常处理"];
    if (!content.includes("post_pipeline:")) {
      warnings.push([
        "structure",
        "Missing post_pipeline definition in Pipeline YAML. All orchestrators should define post_pipeline with stage-summary action.",
      ]);
    }
    if (!content.includes("阶段总结（post_pipeline）") && !content.includes("阶段总结协议")) {
      warnings.push([
        "structure",
        "Missing stage-summary section. Should include '### 阶段总结（post_pipeline）' section or reference to orchestrator-protocol.md.",
      ]);
    }
    if (!content.includes("阶段总结已生成") && !content.includes("阶段总结协议")) {
      warnings.push([
        "structure",
        "Missing stage-summary gate. Should include '阶段总结已生成' row in 阶段卡口 table or reference orchestrator-protocol.md.",
      ]);
    }
    if (!content.includes("阶段总结生成失败") && !content.includes("阶段总结协议")) {
      warnings.push([
        "structure",
        "Missing stage-summary fallback. Should include '阶段总结生成失败' row in 异常处理 table or reference orchestrator-protocol.md.",
      ]);
    }
  }

  for (const section of requiredSections) {
    const found = sections.some(s => s === section || s.startsWith(section));
    if (!found) {
      errors.push(["structure", `Missing required section: ## ${section}`]);
    }
  }

  for (const section of recommendedSections) {
    const found = sections.some(s => s === section || s.startsWith(section));
    if (!found) {
      warnings.push([
        "structure",
        `Missing recommended section: ## ${section}`,
      ]);
    }
  }

  return { errors, warnings };
}

function validateInputTable(content) {
  const errors = [];
  const warnings = [];
  const inputMatch = content.match(/##\s+输入\s*\n([\s\S]*?)(?=\n##\s|$)/);
  if (!inputMatch) return { errors, warnings };

  const inputSection = inputMatch[1];
  const tableRows = inputSection.match(/\|.*\|.*\|.*\|.*\|.*\|/g) || [];
  if (tableRows.length <= 1) {
    warnings.push([
      "input",
      "Input section should have a table with columns: 输入项/类型/必填/来源/说明",
    ]);
    return { errors, warnings };
  }

  const header = tableRows[0];
  const requiredCols = ["输入项", "类型", "必填", "来源", "说明"];
  for (const col of requiredCols) {
    if (!header.includes(col)) {
      errors.push(["input", `Input table missing required column: ${col}`]);
    }
  }

  return { errors, warnings };
}

function validateOutput(content, skillType) {
  const errors = [];
  const warnings = [];
  if (skillType !== "pipeline") return { errors, warnings };

  const outputMatch = content.match(/##\s+输出\s*\n([\s\S]*?)(?=\n##\s|$)/);
  if (!outputMatch) return { errors, warnings };

  const outputSection = outputMatch[1];
  if (!outputSection.includes("output/")) {
    warnings.push([
      "output",
      "Output section should specify output file path starting with 'output/'",
    ]);
  }

  if (
    !outputSection.includes("Schema") &&
    !outputSection.includes("校验规则")
  ) {
    warnings.push([
      "output",
      "Output section should include output Schema or validation rules",
    ]);
  }

  return { errors, warnings };
}

function validateOutputPathConsistency(content, domain) {
  const warnings = [];
  if (!domain || !OUTPUT_PATH_MAP[domain]) return warnings;

  const ownPrefixes = OUTPUT_PATH_MAP[domain];
  const outputPaths = content.match(/output\/([\w-]+)\//g) || [];

  for (const p of outputPaths) {
    const prefix = p.replace("output/", "").replace("/", "");
    if (!ALL_VALID_OUTPUT_PREFIXES.includes(prefix)) {
      warnings.push([
        "output-path",
        `Output path 'output/${prefix}/' is not a recognized output path prefix. Valid prefixes: ${ALL_VALID_OUTPUT_PREFIXES.join(", ")}`,
      ]);
    } else if (
      !ownPrefixes.includes(prefix) &&
      !(ALLOWED_CROSS_DOMAIN_OUTPUT_REFS[domain] || []).includes(prefix)
    ) {
      warnings.push([
        "output-path-cross-domain",
        `Output path 'output/${prefix}/' belongs to another domain (cross-domain data contract reference). This is valid but verify the dependency is intentional.`,
      ]);
    }
  }

  return warnings;
}

function validateSkill(skillPath) {
  if (!fs.existsSync(skillPath)) {
    console.log(`ERROR: File not found: ${skillPath}`);
    return false;
  }

  const content = fs.readFileSync(skillPath, "utf-8");
  const fm = parseFrontmatter(content);
  const domain = detectDomain(skillPath);
  let skillType = null;

  if (fm && typeof fm.metadata === "object" && fm.metadata !== null) {
    skillType = fm.metadata.type || null;
  }

  let allErrors = [];
  let allWarnings = [];

  const fmResult = validateFrontmatter(fm, skillPath);
  allErrors.push(...fmResult.errors);
  allWarnings.push(...fmResult.warnings);

  const structResult = validateStructure(content, skillType);
  allErrors.push(...structResult.errors);
  allWarnings.push(...structResult.warnings);

  const inputResult = validateInputTable(content);
  allErrors.push(...inputResult.errors);
  allWarnings.push(...inputResult.warnings);

  const outputResult = validateOutput(content, skillType);
  allErrors.push(...outputResult.errors);
  allWarnings.push(...outputResult.warnings);

  const pathWarnings = validateOutputPathConsistency(content, domain);
  allWarnings.push(...pathWarnings);

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Validating: ${skillPath}`);
  console.log(`${"=".repeat(60)}`);

  if (allErrors.length > 0) {
    console.log(`\n  ERRORS (${allErrors.length}):`);
    for (const [loc, msg] of allErrors) {
      console.log(`    [${loc}] ${msg}`);
    }
  }

  if (allWarnings.length > 0) {
    console.log(`\n  WARNINGS (${allWarnings.length}):`);
    for (const [loc, msg] of allWarnings) {
      console.log(`    [${loc}] ${msg}`);
    }
  }

  if (allErrors.length === 0 && allWarnings.length === 0) {
    console.log("\n  All checks passed!");
  }

  console.log();
  return allErrors.length === 0;
}

function findAllSkills(rootDir) {
  const skills = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.name === "templates" || entry.name === "node_modules") continue;
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === "SKILL.md") {
        skills.push(fullPath);
      }
    }
  }
  walk(rootDir);
  return skills;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: node validate-skill.js <skill-path-or-directory>");
    console.log("");
    console.log("Examples:");
    console.log(
      "  node validate-skill.js pm-skill/pm-01-discovery/skills/insight-analysis/SKILL.md"
    );
    console.log("  node validate-skill.js .                              (validate all)");
    process.exit(1);
  }

  const target = args[0];
  let skills = [];

  if (!fs.existsSync(target)) {
    console.log(`ERROR: Path not found: ${target}`);
    process.exit(1);
  }
  if (fs.statSync(target).isDirectory()) {
    skills = findAllSkills(target);
    if (skills.length === 0) {
      console.log(`No SKILL.md files found in: ${target}`);
      process.exit(1);
    }
  } else {
    skills = [target];
  }

  let allPassed = true;
  for (const skillPath of skills) {
    if (!validateSkill(skillPath)) {
      allPassed = false;
    }
  }

  console.log(`${"=".repeat(60)}`);
  if (allPassed) {
    console.log(`All ${skills.length} skill(s) passed validation.`);
  } else {
    console.log("Some skills have errors. Please fix before submitting PR.");
  }
  console.log(`${"=".repeat(60)}`);

  process.exit(allPassed ? 0 : 1);
}

main();
