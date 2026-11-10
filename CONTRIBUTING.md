# Contributing to Drift

Drift is an early-stage frontend for exploring design-system consistency across software projects. This guide explains how to prepare a change that fits the current codebase and is straightforward to review. The project is under active development. No public contribution acceptance or review policy is currently defined; check with maintainers before investing in a large change.

Potentially useful contributions include bug reports, focused UI improvements, accessibility fixes, documentation, performance investigations, and proposals for future product capabilities. The frontend currently uses demo and local browser data for several workflows; see the [README](README.md) before treating a screen as a connected service.

## Getting started

The repository uses Node.js with npm. Use a Node.js version compatible with the installed Next.js 16 release. No environment variables or external services are required by the current local frontend setup.

```bash
npm install
npm run dev
```

Open http://localhost:3000. The available validation and production commands are:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run build
```

Use `npm run format` to apply Prettier formatting when needed; it formats the repository, so for a focused change prefer formatting only the files you edited with the local Prettier executable. The project has no configured test script or automated test suite at this time. Do not report tests as passing unless a test suite is added and run.

## Project structure

| Path                             | Put changes here                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/app`                        | Routes, route groups, layouts, metadata, and route-level composition.                                        |
| `src/features/<feature>`         | Components, hooks, models, schemas, and data contracts used by one capability, such as projects or findings. |
| `src/components/ui`              | Domain-neutral interface primitives with genuine reuse across features.                                      |
| `src/components/motion`          | Shared motion infrastructure and the ShapeWaves canvas renderer.                                             |
| `src/config`                     | Static site and navigation configuration.                                                                    |
| `src/lib`                        | Small, focused shared utilities.                                                                             |
| `src/styles` and `src/app/*.css` | Shared tokens, global styles, and route-specific styling.                                                    |
| `public`                         | Static assets referenced by the application.                                                                 |
| `docs`                           | Architecture, performance, and contributor-facing documentation.                                             |

Keep feature-specific hooks and components with their feature; put shared hooks/utilities in a shared location only when multiple capabilities need them. The repository does not currently have a test directory or test framework. For detailed ownership, import, and Server/Client Component rules, consult [AGENTS.md](AGENTS.md) and the [architecture overview](docs/architecture/overview.md).

## Coding standards

- Use TypeScript and follow the strict compiler settings and existing file/import conventions.
- Follow Prettier settings in `.prettierrc.json` and the configured ESLint rules. Keep components, functions, and JSX readable; do not compress implementations into one line.
- Keep components focused and names descriptive. Reuse existing primitives when appropriate, but add abstractions only for real reuse or a clear boundary.
- Respect feature ownership and existing route/provider boundaries. Avoid duplicate utilities, competing architectures, and dependencies without a concrete need.
- Preserve responsive behavior, semantic markup, keyboard access, visible focus, and reduced-motion support. For visual work, follow existing tokens and interaction patterns.
- Keep each change focused. Do not bundle unrelated formatting, refactoring, or cleanup into a feature or fix.
- Before editing, inspect `git status` and preserve existing user changes. Do not commit, push, or rewrite history unless explicitly requested.

Run the relevant checks for your change. For most code changes, run lint and typecheck; use format check when formatting may be affected. Run the production build for changes that affect routes, configuration, or compilation. Be clear about checks you did not run and any known limitations.

## Branch naming

Use a short, descriptive branch name with one of these prefixes:

- `feat/short-description`
- `fix/short-description`
- `refactor/short-description`
- `docs/short-description`
- `chore/short-description`
- `perf/short-description`

For example: `fix/dashboard-empty-state` or `perf/webgpu-idle-rendering`. This is a recommended convention; branch naming is not enforced by repository tooling.

## Commit conventions

When commits are requested, use Conventional Commits:

```text
type(scope): short description
```

Examples:

```text
feat(dashboard): add interactive project filters
fix(motion): resolve scroll transition issue
refactor(ui): simplify card component structure
perf(webgl): reduce unnecessary frame updates
docs: update contribution guidelines
style: format dashboard components
```

Use `feat` for user-facing capability, `fix` for correcting behavior, `refactor` for restructuring without intended behavior change, `perf` for a measured or targeted performance improvement, `docs` for documentation, and `style` for formatting-only changes that do not alter application behavior. Keep commits atomic, with one coherent change per commit. Conventional Commit subjects are recommended but not currently enforced.

## Pull requests

Keep each pull request focused on one logical change and reasonably reviewable. Use a descriptive title and explain what changed and why. Link related issues when applicable. For visible changes, include before-and-after screenshots or a short recording, and describe viewports or interactions that are important to review. Mention relevant performance implications, breaking changes, validation performed, and known limitations. Avoid unrelated formatting or refactoring.

A concise description could look like this:

```markdown
## Summary

Add keyboard-accessible project filters to the dashboard project list.

## Validation

- `npm run lint`
- `npm run typecheck`
- Manually checked keyboard navigation and narrow viewport layout.

## Visual changes

Before/after screenshots attached.
```

Review and merge practices are not configured in this repository. As a recommendation, changes should be reviewed for correctness, readability, architectural fit, accessibility, responsive behavior, performance, and maintainability. No approval count, CI gate, or merge SLA is established here.

## UI and animation contributions

Use the existing semantic tokens, typography, shared primitives, and visual hierarchy. Marketing pages and dashboard have distinct purposes; keep them coherent without forcing identical compositions. Consider responsive layouts from the start and include screenshots for significant visual changes.

Preserve intentional scroll and pointer interactions. Respect reduced-motion preferences and provide keyboard-accessible equivalents where appropriate. Reuse the motion tools already in the relevant area rather than adding another animation library. For canvas or WebGPU work, consider GPU resource lifecycle, idle/offscreen behavior, and memory/frame performance; use the controlled process in [performance profiling notes](docs/performance-profiling.md) before making performance claims. Do not simplify or remove creative effects solely on theoretical performance grounds.

## Bug reports and feature suggestions

The repository provides [bug report](.github/ISSUE_TEMPLATE/bug_report.yml) and [feature request](.github/ISSUE_TEMPLATE/feature_request.yml) templates. A useful bug report includes:

- A concise description and affected route or feature.
- Steps to reproduce.
- Expected and actual behavior.
- Browser, operating system, and relevant environment details.
- Screenshots, recordings, or console output when they help explain the problem.

For a feature suggestion, describe the problem, the proposed solution, the expected user benefit, and alternatives considered. Avoid including credentials or private user data. The templates are available, but issue handling and contribution acceptance are not otherwise defined as formal maintainer policies.

## Before opening a pull request

- [ ] The change addresses one clear concern and avoids unrelated edits.
- [ ] Existing routes, feature boundaries, and behavior are preserved where intended.
- [ ] UI changes follow established tokens and work responsively.
- [ ] Accessibility and reduced-motion behavior were considered where relevant.
- [ ] Relevant lint, typecheck, format, build, or manual checks were run and recorded accurately.
- [ ] Visual changes include screenshots or a recording when useful.
- [ ] Documentation was updated if setup, behavior, or architecture changed.
- [ ] Known limitations, performance implications, and breaking changes are stated.

## License decision pending

There is no license file in the repository. Maintainers must select and add a license before reuse and redistribution terms are established. This guide does not make that choice.

| License    | Reuse and redistribution                                                                                                                        | Contribution implications                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| MIT        | Permissive reuse, including proprietary use, with copyright and license notices retained.                                                       | Simple terms; no express patent grant.                                            |
| Apache-2.0 | Permissive reuse with applicable notice and attribution requirements.                                                                           | Includes an express contributor patent license and patent termination provisions. |
| GPL-3.0    | Reuse and redistribution are permitted under copyleft terms; distributed derivatives generally must provide corresponding source under GPL-3.0. | Keeps distributed derivatives under copyleft and includes express patent terms.   |

For broad adoption and a simple contributor experience, MIT is a reasonable recommendation. Apache-2.0 is an alternative if an express patent grant is desired; GPL-3.0 fits a goal of requiring distributed derivatives to remain under copyleft. The decision remains pending maintainer approval.
