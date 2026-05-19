const fs = require("fs");
const path = require("path");

function readManifest(rootDir) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, "skills-manifest.json"), "utf-8"));
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

function main() {
  const rootDir = path.resolve(__dirname, "..");
  const manifest = readManifest(rootDir);
  const skillNames = new Set(manifest.skills.map((s) => s.name));
  const knownNonSkillTokens = new Set([]);
  const errors = [];

  for (const skill of manifest.skills.filter((s) => s.type === "orchestrator")) {
    const content = fs.readFileSync(path.join(rootDir, skill.path), "utf-8");
    for (const ref of extractSkillRefs(content)) {
      if (!skillNames.has(ref) && !knownNonSkillTokens.has(ref)) {
        errors.push(`${skill.name}: references missing skill '${ref}' in ${skill.path}`);
      }
    }
  }

  if (errors.length) {
    console.log(`ERRORS (${errors.length})`);
    for (const error of errors) console.log(`  - ${error}`);
    process.exit(1);
  }

  console.log("Orchestrator reference validation passed.");
}

main();
