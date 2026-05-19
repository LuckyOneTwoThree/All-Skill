# Engineering Boundary Protocol

Use this protocol for UI and Backend skills that may write or modify project code.

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
