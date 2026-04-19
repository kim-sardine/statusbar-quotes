# Repository Guidelines

## Project Structure & Module Organization

This is a TypeScript VS Code extension. Source code lives in `src/`; the activation entry point is `src/extension.ts`. Shared constants are in `src/constants.ts`, quote selection logic is in `src/models/`, and quote data is grouped by category in `src/quotes/`. Integration tests live under `src/test/`, with Mocha suites in `src/test/suite/`. Static assets used by the extension and marketplace metadata are in `assets/`. Compiled output is written to `out/` and should not be edited or committed.

## Build, Test, and Development Commands

Use Yarn for project scripts:

- `yarn install` — install dependencies from `yarn.lock`.
- `yarn run compile` — type-check and compile TypeScript into `out/`.
- `yarn run watch` — run the TypeScript compiler in watch mode during development.
- `yarn run lint` — run ESLint over `src/**/*.ts`.
- `yarn test` — compile, lint, then launch VS Code integration tests via `@vscode/test-electron`.
- `yarn run vscode:prepublish` — compile before packaging or publishing the extension.

## Coding Style & Naming Conventions

Follow the existing TypeScript style: tabs for indentation, single quotes for imports/strings where practical, semicolons, and strict typing. Keep extension command IDs and settings keys centralized in `src/constants.ts`. Use PascalCase for classes and interfaces, camelCase for variables/functions, and UPPER_SNAKE_CASE for exported constants. Add new quote categories as separate files in `src/quotes/` and wire them through `src/quotes/index.ts` and the category constants/configuration.

## Testing Guidelines

Tests use Mocha with the TDD interface and Node `assert`. Name test files `*.test.ts` under `src/test/suite/`; compiled tests are discovered as `*.test.js`. Run `yarn test` before submitting changes. For behavior changes, add or update tests that cover category selection, language handling, timer behavior, or VS Code command interactions where feasible.

## Commit & Pull Request Guidelines

The current history uses short, descriptive commit subjects such as `Add new category - ...`, `Fix unicodes`, and release/version bump messages. Keep commits focused and imperative when possible. Pull requests should include a concise summary, test results (`yarn test` or any known limitation), linked issues, and screenshots/GIFs for visible status bar or settings changes. Do not commit `out/`, `node_modules/`, `.vscode-test/`, `*.vsix`, or `.omx/`.
