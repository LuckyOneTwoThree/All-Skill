const fs = require("fs");
const path = require("path");

const ROOTS = ["pm-skill", "ui-skill", "backend-skill", "cross-domain"];

function parseFrontmatter(content) {
  const cleaned = content.replace(/^\uFEFF/, "");
  const fmMatch = cleaned.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;

  const result = {};
  let currentKey = null;
  let currentSubKey = null;

  for (const line of fmMatch[1].split("\n")) {
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
        } catch {
          value = rawValue;
        }
      }

      if (indent === 0) {
        result[key] = value;
        currentKey = key;
        currentSubKey = null;
      } else if (currentKey) {
        if (typeof result[currentKey] === "string") result[currentKey] = {};
        if (typeof result[currentKey] === "object" && !Array.isArray(result[currentKey])) {
          result[currentKey][key] = value;
          currentSubKey = key;
        }
      }
    } else if (line.trim().startsWith("- ") && currentKey) {
      const item = line.trim().slice(2).trim().replace(/^["']|["']$/g, "");
      if (indent <= 2) {
        if (!Array.isArray(result[currentKey])) result[currentKey] = [];
        result[currentKey].push(item);
      } else if (currentSubKey && typeof result[currentKey] === "object" && !Array.isArray(result[currentKey])) {
        if (!Array.isArray(result[currentKey][currentSubKey])) result[currentKey][currentSubKey] = [];
        result[currentKey][currentSubKey].push(item);
      }
    }
  }

  return result;
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, acc);
    else if (entry.name === "SKILL.md") acc.push(fullPath);
  }
  return acc;
}

function inferDomain(relativePath) {
  return relativePath.split(/[\\/]/)[0];
}

function extractOutputPrefixes(content) {
  const matches = content.match(/output\/[\w-]+\//g) || [];
  return [...new Set(matches.map((p) => p.replace(/\/$/, "")))].sort();
}

function extractSkillRefs(content) {
  const refs = new Set();
  const yamlSkillLists = content.match(/skills:\s*\[[^\]]+\]/g) || [];
  for (const list of yamlSkillLists) {
    const inner = list.replace(/^skills:\s*\[/, "").replace(/\]$/, "");
    inner.split(",").map((s) => s.trim()).filter(Boolean).forEach((s) => refs.add(s));
  }

  const explicitCalls = content.match(/Skill:\s*([\w-]+)/g) || [];
  for (const call of explicitCalls) refs.add(call.replace(/^Skill:\s*/, "").trim());

  return [...refs].sort();
}

function buildManifest(rootDir) {
  const skills = [];

  for (const root of ROOTS) {
    const absRoot = path.join(rootDir, root);
    if (!fs.existsSync(absRoot)) continue;

    for (const file of walk(absRoot)) {
      const content = fs.readFileSync(file, "utf-8");
      const fm = parseFrontmatter(content);
      if (!fm || !fm.name) continue;

      const relPath = path.relative(rootDir, file).replace(/\\/g, "/");
      const meta = fm.metadata || {};

      skills.push({
        name: fm.name,
        domain: inferDomain(relPath),
        type: meta.type || "pipeline",
        version: meta.version || "",
        module: meta.module || "",
        sub_module: meta["sub-module"] || "",
        path: relPath,
        output_prefixes: extractOutputPrefixes(content),
        dependencies: extractSkillRefs(content).filter((name) => name !== fm.name),
      });
    }
  }

  skills.sort((a, b) => a.name.localeCompare(b.name));

  return {
    schema_version: "1.0",
    generated_from: ROOTS,
    generated_at: new Date().toISOString(),
    counts: ROOTS.reduce((acc, root) => {
      acc[root] = skills.filter((s) => s.domain === root).length;
      return acc;
    }, {}),
    skills,
  };
}

function main() {
  const rootDir = path.resolve(__dirname, "..");
  const manifest = buildManifest(rootDir);
  const outPath = path.join(rootDir, "skills-manifest.json");
  fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf-8");
  console.log(`Wrote ${path.relative(rootDir, outPath)} with ${manifest.skills.length} source skills.`);
}

main();
