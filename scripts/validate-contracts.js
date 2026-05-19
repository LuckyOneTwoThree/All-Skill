const fs = require("fs");
const path = require("path");

const REQUIRED_SCHEMAS = [
  "schemas/pm/prd.schema.min.json",
  "schemas/pm/opportunity-brief.schema.min.json",
  "schemas/pm/roadmap.schema.min.json",
  "schemas/pm/okr.schema.min.json",
  "schemas/pm/metrics-system.schema.min.json",
  "schemas/pm/tracking-plan.schema.min.json",
  "schemas/pm/experiment-design.schema.min.json",
  "schemas/pm/release-checklist.schema.min.json",
  "schemas/pm/acceptance-report.schema.min.json",
  "schemas/ui/project-init.schema.min.json",
  "schemas/ui/pages.schema.min.json",
  "schemas/backend/openapi.schema.min.json",
  "schemas/backend/er-model.schema.min.json",
  "schemas/backend/impl-report.schema.min.json",
  "schemas/backend/review-report.schema.min.json",
  "schemas/cross-domain/artifact-index.schema.min.json",
  "schemas/cross-domain/approval.schema.min.json",
];

const REQUIRED_SKILL_OUTPUT_MARKERS = [
  ["design-prd", ["prd.md", "prd.json"]],
  ["opportunity-definition", ["opportunity"]],
  ["planning-roadmap", ["roadmap"]],
  ["planning-okr", ["OKR"]],
  ["metrics-system", ["metric"]],
  ["tracking-plan", ["tracking"]],
  ["experiment-design", ["experiment"]],
  ["release-auto-checklist", ["Checklist"]],
  ["quality-acceptance", ["验收"]],
  ["project-init", ["project-init.json"]],
  ["page-builder", ["pages.json"]],
  ["api-design-spec", ["openapi.yaml"]],
  ["data-architecture-spec", ["er_model.json"]],
  ["api-design-impl", ["impl-report.json"]],
  ["backend-orchestrator", ["backend-design-review"]],
  ["product-launch-orchestrator", ["artifact-index.json"]],
  ["product-iteration-orchestrator", ["artifact-index.json"]],
];

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, acc);
    else acc.push(fullPath);
  }
  return acc;
}

function main() {
  const rootDir = path.resolve(__dirname, "..");
  const manifestPath = path.join(rootDir, "skills-manifest.json");
  const errors = [];

  for (const schemaPath of REQUIRED_SCHEMAS) {
    const abs = path.join(rootDir, schemaPath);
    if (!fs.existsSync(abs)) {
      errors.push(`Missing required schema: ${schemaPath}`);
      continue;
    }
    try {
      const parsed = JSON.parse(fs.readFileSync(abs, "utf-8"));
      if (!parsed.$schema || !parsed.type) errors.push(`${schemaPath}: missing $schema or type.`);
    } catch (error) {
      errors.push(`${schemaPath}: invalid JSON (${error.message})`);
    }
  }

  if (!fs.existsSync(manifestPath)) {
    errors.push("skills-manifest.json is missing. Run node scripts/build-source-manifest.js first.");
  } else {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const byName = new Map((manifest.skills || []).map((skill) => [skill.name, skill]));

    for (const [skillName, markers] of REQUIRED_SKILL_OUTPUT_MARKERS) {
      const skill = byName.get(skillName);
      if (!skill) {
        errors.push(`Missing required skill in manifest: ${skillName}`);
        continue;
      }
      const content = fs.readFileSync(path.join(rootDir, skill.path), "utf-8");
      for (const marker of markers) {
        if (!content.includes(marker)) errors.push(`${skillName}: missing contract marker '${marker}' in ${skill.path}`);
      }
    }
  }

  for (const file of walk(path.join(rootDir, "schemas"))) {
    if (!file.endsWith(".json")) continue;
    try {
      JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch (error) {
      errors.push(`${path.relative(rootDir, file)}: invalid JSON (${error.message})`);
    }
  }

  if (errors.length) {
    console.log(`ERRORS (${errors.length})`);
    for (const error of errors) console.log(`  - ${error}`);
    process.exit(1);
  }

  console.log("Contract validation passed.");
}

main();
