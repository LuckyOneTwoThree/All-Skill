# Engineering Boundary Protocol

Use this protocol for Codex skills that may create or modify project code.

## Codex Runtime Rules

1. Inspect the project before editing. Prefer `rg`/`rg --files` for discovery and existing local patterns over new conventions.
2. Edit files with Codex-safe mechanisms. For manual edits use `apply_patch`; reserve bulk rewrite commands for mechanical, verifiable transformations.
3. Respect the sandbox. If a required command fails due to network, filesystem, or approval restrictions, request escalation instead of working around it.
4. Preserve user work. Check the worktree when relevant, do not revert unrelated changes, and integrate with existing edits in files you touch.
5. For local web UI changes, run or reuse the project dev server when practical and verify the result in a browser-capable workflow. Record any verification that could not run.
6. Report created/modified files, checks run, checks that failed or were skipped, and residual risks.

## Project First

1. Scan the existing project structure before generating code.
2. Prefer existing framework, router, state management, component library, API client, test stack, and style conventions.
3. If no project exists, generate the smallest coherent scaffold required by the task.

## Write Scope

1. Declare target files or directories before implementation.
2. Do not overwrite user code outside the target scope.
3. If a file already exists, preserve unrelated logic and integrate with local patterns.
4. Record created, modified, and intentionally skipped files in the output report.

## Verification

1. Run the cheapest relevant static checks available in the project.
2. For UI, verify responsive layout, text overflow, accessibility basics, and design-token consistency.
3. For Backend, verify schema/API/model consistency, migration safety, and compile/startup feasibility.
4. If a check cannot run, state why and list the residual risk.
