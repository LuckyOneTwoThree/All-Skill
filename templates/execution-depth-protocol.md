# Execution Depth Protocol

Use `execution_depth` to avoid over-running heavy skills.

| value | intent | execution rule |
| --- | --- | --- |
| `quick` | Fast answer or draft | Run only required inputs, core reasoning, minimum viable output, and P0 quality checks. Skip optional matrices, exhaustive scoring, and extended reports unless the user asks. |
| `standard` | Default production workflow | Run required steps and normal quality checks. Use conditional branches only when their trigger conditions are met. |
| `deep` | High-stakes or comprehensive work | Run the full methodology, optional analyses, expanded risk checks, and detailed decision records. |

Default is `standard`.

If the user asks for a quick draft, outline, first pass, small change, or direct answer, use `quick`.
If the user asks for comprehensive analysis, full workflow, audit, launch readiness, or high-risk decisions, use `deep`.

Do not expand child-skill methodology just to satisfy `deep`; call or execute the relevant child skill by contract.
