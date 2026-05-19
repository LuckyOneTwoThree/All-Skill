# Stage 5: API Integration (On-Demand)

Skip condition: No backend API or using static data

| Input | Source |
|--------|------|
| API contract | output/backend-api-design/api-design-spec/ (optional) |
| Page data flow | output/ui-frontend/page-builder/pages.json |
| quality_debt | output/ui-frontend/page-builder/quality_debt.json (optional, read existing debt; reference related debt items when API integration involves forms/data submission) |
| Target framework / Target language / project_dir | Determined during project information collection phase |

Output: output/ui-frontend-integration/api-integration/ + code written to {project_dir}/src/api/
Validation: 100% endpoints have request functions + 100% have TypeScript types + Mock data covers all endpoints + Authentication configuration complete
