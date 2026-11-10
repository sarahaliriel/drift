# Architecture overview

This document describes the architecture present in the repository today. For the audit and historical reasoning behind the refactoring, see [the refactoring plan](refactoring-plan.md). It is a record of the current code, not a claim that planned backend layers already exist.

## Philosophy

Drift is organized as a **modular monolith**: one Next.js application with capabilities grouped by feature and a small shared UI foundation. This keeps local development and deployment straightforward while making ownership visible. Separate services, databases, and worker infrastructure are not present and are not required by the current prototype.

The main rule is ownership: routes own URL composition, features own capability-specific behavior and contracts, and shared components stay domain-neutral. Integrations should be introduced behind explicit contracts so demo adapters can be replaced without making route components responsible for infrastructure.

## App Router and source map

| Path             | Responsibility today                                                                                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app`        | Next.js App Router routes, layouts, global CSS, and route composition. `(marketing)` and `(auth)` are route groups and do not add URL segments. Dashboard routes live under `/dashboard`. |
| `src/features`   | Capability-owned UI, schemas, models, fixtures, repositories, and public exports.                                                                                                         |
| `src/components` | Shared UI primitives, shared navigation pieces, and motion infrastructure used across route areas. `components/ui` should stay free of feature-specific data access.                      |
| `src/config`     | Static site and navigation configuration.                                                                                                                                                 |
| `src/lib`        | Focused shared helpers, including date labels and motion configuration/state helpers. Avoid treating this as a general feature bucket.                                                    |
| `src/styles`     | Shared design tokens and style foundations.                                                                                                                                               |

Pages and layouts are Server Components by default. Interactive forms, dashboard state, browser persistence, and animation components use Client Components where needed. Keep client directives at the smallest practical boundary and pass serializable values across server/client boundaries.

## Feature ownership

- **`auth`** (`src/features/auth`): authentication form schemas and UI components. The forms validate and simulate outcomes; no identity provider, session, or account service is connected.
- **`marketing`** (`src/features/marketing`): landing page sections, navigation, and marketing-specific hooks/experiments. These components own page presentation, not backend behavior.
- **`dashboard`** (`src/features/dashboard`): dashboard shell components, provider/context, overview composition, and dashboard-specific state. It currently coordinates project, scan, and finding reads for the UI.
- **`projects`** (`src/features/projects`): project models, selectors, views, fixtures, the `ProjectRepository` contract, and its browser localStorage adapter.
- **`scans`** (`src/features/scans`): scan model, sample fixtures, and a repository-like demo reader. It does not execute scans.
- **`findings`** (`src/features/findings`): finding model, sample fixtures, and a demo reader. It does not derive findings from source code.

Route modules in `src/app` should remain thin composition and route-parameter boundaries. Cross-feature data should be composed through explicit public exports or a higher-level route/shell, rather than importing another feature's private implementation.

## Shared UI and imports

`src/components/ui` contains reusable primitives such as buttons, inputs, alerts, and links. It should not depend on route modules, feature repositories, or domain state. Shared navigation and motion components live in their respective shared component folders; feature-specific screens belong under `src/features`.

Prefer direct imports or a feature's narrow `public.ts` export. Keep implementation files private by default. A useful dependency direction is `app -> features/shared UI/config/lib`, and `feature -> its own internals/shared UI/config/lib`. Avoid feature-to-feature private imports and domain cycles. Client components must not import server-only modules or secrets.

## Motion boundaries

`ShapeWaves` is intentionally shared between marketing and authentication layouts. It is a substantial client-side visual component with WebGPU-related dependencies and reduced-motion/visibility handling; changes should preserve its graceful behavior and lifecycle cleanup.

`SmoothScroll` and `MotionProvider` are scoped to the `(marketing)` layout. This keeps smooth scrolling and shared marketing motion behavior within the marketing route group rather than the dashboard. Auth uses its shared visual background without the marketing layout's smooth-scroll provider.

## Dashboard state and demo persistence

`DashboardProvider` is mounted by `src/app/dashboard/layout.tsx`. It loads project, scan, and finding collections and exposes them through dashboard context, along with theme controls and project creation. The dashboard layout also bootstraps local theme/sidebar preferences before hydration.

Projects use the `ProjectRepository` interface in `src/features/projects/data/project-repository.ts`. Its current `localStorageProjectRepository` implementation stores created projects in the browser under `drift-demo-projects-v1` and combines them with sample project fixtures. This adapter requires browser APIs and is demo-only; it is not a server persistence layer or a security boundary.

Scan and finding readers return in-memory fixtures from `src/features/scans/demo` and `src/features/findings/demo`. No scan job, analysis engine, durable data store, or backend API is implemented. UI status and metrics based on these records are illustrative.

## Future backend direction

When integrations are designed, retain feature-owned contracts and introduce server-side implementations behind them. Projects will need authenticated ownership and a persistent adapter; scans will need a real request/state/result contract and potentially durable asynchronous execution; findings will need to map to actual analysis results. Authentication, source-provider access, secrets, and authorization belong on server boundaries.

Server Components can call server-side use cases/repositories directly. Route Handlers or Server Actions should be added when a transport or mutation boundary requires them, not as a mandatory hop for every internal read. No database, queue, auth provider, or backend service is selected in the current code.

## Trade-offs

- A single application keeps the prototype easy to run and lets features evolve without distributed-system overhead.
- Feature folders make capability ownership clearer, but require discipline around public exports and import direction.
- Client-side demo state allows interaction without backend setup, but is per-browser, non-authoritative, and unsuitable for multi-user or production use.
- A shared dashboard context is simple for the current small fixture set; splitting it should follow measured needs rather than speculative optimization.
- Motion and WebGPU visuals support Drift's design identity but add client/runtime cost. Preserve route scope, accessibility, and profiling discipline when modifying them.
