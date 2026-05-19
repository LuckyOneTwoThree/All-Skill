const fs = require("fs");
const path = require("path");

const SOURCE_ROOTS = new Set(["pm-skill", "ui-skill", "backend-skill", "cross-domain"]);
const VALID_TYPES = new Set(["pipeline", "orchestrator", "guide", "extension"]);

function fail(errors, message) {
  errors.push(message);
}

function main() {
  const rootDir = path.resolve(__dirname, "..");
  const manifestPath = path.join(rootDir, "skills-manifest.json");
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(manifestPath)) {
    fail(errors, "skills-manifest.json is missing. Run: node scripts/build-source-manifest.js");
  }

  if (errors.length === 0) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const skills = manifest.skills || [];
    const byName = new Map();

    for (const skill of skills) {
      if (!skill.name) fail(errors, "A manifest entry is missing name.");
      if (!SOURCE_ROOTS.has(skill.domain)) fail(errors, `${skill.name}: invalid domain '${skill.domain}'.`);
      if (!VALID_TYPES.has(skill.type)) fail(errors, `${skill.name}: invalid type '${skill.type}'.`);
      if (!skill.version) fail(errors, `${skill.name}: missing version.`);
      if (!skill.path || !fs.existsSync(path.join(rootDir, skill.path))) {
        fail(errors, `${skill.name}: path does not exist: ${skill.path}`);
      }
      if (byName.has(skill.name)) {
        fail(errors, `Duplicate skill name '${skill.name}' in ${byName.get(skill.name)} and ${skill.path}.`);
      }
      byName.set(skill.name, skill.path);
    }

    for (const skill of skills) {
      for (const dep of skill.dependencies || []) {
        if (!byName.has(dep)) {
          warnings.push(`${skill.name}: dependency '${dep}' is not in source manifest.`);
        }
      }
    }

    const actualCounts = {};
    for (const skill of skills) actualCounts[skill.domain] = (actualCounts[skill.domain] || 0) + 1;
    for (const root of SOURCE_ROOTS) {
      if ((manifest.counts || {})[root] !== actualCounts[root]) {
        fail(errors, `Count mismatch for ${root}: manifest=${(manifest.counts || {})[root]}, actual=${actualCounts[root] || 0}.`);
      }
    }
  }

  if (warnings.length) {
    console.log(`WARNINGS (${warnings.length})`);
    for (const warning of warnings) console.log(`  - ${warning}`);
  }

  if (errors.length) {
    console.log(`ERRORS (${errors.length})`);
    for (const error of errors) console.log(`  - ${error}`);
    process.exit(1);
  }

  console.log("Source manifest validation passed.");
}

main();
