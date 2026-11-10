# Drift

**See the shape of your design system.**

Drift is an early-stage frontend platform for helping product teams and developers understand how interface decisions, design tokens, and patterns vary across software projects. Its goal is to make design-system consistency easier to see and act on through a clear, design-conscious workspace.

The repository currently contains a Next.js frontend prototype. Its screens communicate the intended workflows; authentication and analysis services are not connected. This repository does not yet include a license, so reuse and redistribution terms are unresolved.

## Current experience

### Implemented frontend

- Marketing pages and responsive layouts.
- Sign-in, registration, and password-recovery forms with client-side validation.
- Dashboard views for projects, scans, and findings, with shared dashboard state and navigation.
- Project creation and listing backed by a browser localStorage adapter.
- Shared UI primitives, design tokens, and route-scoped motion components.

### Demo behavior and limitations

- Authentication forms simulate submission; they do not create accounts, authenticate users, or send recovery email.
- Project creation is local to the browser. Project lists also include sample data.
- Scan and finding views use fixtures; no repository is scanned and no findings are produced by an analysis engine.
- Dashboard metrics and design-system consistency previews are illustrative demo data.

### Future direction

The product direction is to connect projects to source repositories, analyze design-system consistency, and present actionable results. Backend, provider, persistence, and analysis capabilities are not implemented here. See [the architecture overview](docs/architecture/overview.md) for current boundaries and future integration direction.

## Technology

Verified from `package.json` and source: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Motion, GSAP, Lenis, React Hook Form, Zod, Lucide React, and `vgpu`/`@vgpu/wgsl` for the WebGPU-based ShapeWaves visual.

## Getting started

Prerequisites: Node.js compatible with the installed Next.js 16 release and npm. Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open http://localhost:3000. Available checks and build commands:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run build
```

There is no test script configured in `package.json` at this time.

## Architecture

Drift is currently a modular monolith: one Next.js App Router application with route ownership in `src/app`, capability modules in `src/features`, and cross-feature primitives in `src/components/ui`. The dashboard uses a `ProjectRepository` contract with a localStorage implementation; scans and findings are fixture-backed. Read [Architecture overview](docs/architecture/overview.md) for current responsibilities and boundaries, and [the refactoring plan](docs/architecture/refactoring-plan.md) for the historical audit and migration record.

## Project status

Drift is under active development. Frontend structure and design are evolving, and integrations are incomplete. Screens and demo data should not be treated as production services or analysis results.

## Contributing

Contribution guidance and issue reporting suggestions are in [CONTRIBUTING.md](CONTRIBUTING.md). The repository includes [bug](.github/ISSUE_TEMPLATE/bug_report.yml) and [feature request](.github/ISSUE_TEMPLATE/feature_request.yml) issue templates and a [pull request template](.github/PULL_REQUEST_TEMPLATE.md). These templates do not establish a contribution acceptance, review, or merge policy; maintainers have not configured those processes. See [AI agent guidance](docs/agents/overview.md) for coding-agent context. A project license has not yet been selected, so reuse and redistribution terms remain unresolved.

## License

**Pending maintainer decision.** No license file is currently present. Until a license is selected and added, do not assume permission to reuse, modify, or redistribute this code. See [the license comparison in CONTRIBUTING.md](CONTRIBUTING.md#license-decision-pending).

## Documentation TODOs

- Add product screenshots after approved screens are available.
- Add a public demo link only when a stable demo exists.
- Add a license link after maintainers select and add a license.
