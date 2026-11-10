# Drift architecture audit and refactoring plan

**Audit date:** 2026-11-09; Phase 1 implementation update: 2026-11-09  
**Scope:** Repository source and configuration as currently checked in. No application code was changed for this audit.  
**Method:** Inspected the `src` tree, import/reference usage, package manifest, project configuration, root/dashboard layouts, data and provider code, and the existing performance profiling notes. Read the installed Next.js 16 App Router guidance on Server and Client Components, lazy loading, and backend-for-frontend patterns before making recommendations.

> **Status index (updated 2026-11-10):** The assessment and prioritized findings below record the pre-refactoring snapshot from 2026-11-09. Implementation records later in this document describe completed repository moves through Phase 3.5; those records supersede earlier findings where they explicitly document a change. Phase 4 (backend contracts) and Phase 5 (provider/storage/worker integrations) remain proposals, not implemented work. Browser verification and live performance/GPU comparisons called out in the implementation records remain outstanding unless a later dated record says otherwise.

| Area                          | Status in this record                                                                                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Historical audit findings     | Preserve as observations of the source at the audit date; do not read them as a complete description of the post-refactoring tree.                                               |
| Phases 1–3.5                  | Implementation updates are recorded below for route scoping, dashboard/auth/marketing ownership, and cleanup. Their validation results are historical records for those changes. |
| Remaining technical debt      | Dense dashboard JSX and retained inactive marketing alternatives are noted in the Phase 3.5 update; review them as separate work.                                                |
| Planned future integrations   | Phases 4–5 cover possible server contracts and later adapters. No database, queue, authentication provider, or analysis backend is selected here.                                |
| Outstanding manual validation | Browser behavior, accessibility, reduced-motion, hydration/console, WebGPU lifecycle, and controlled performance comparisons remain open where explicitly noted below.           |

## Executive assessment

Drift is a single Next.js App Router application with a coherent route tree and an early feature-first dashboard area. It is still a local demo: the dashboard repository stores created projects in `localStorage`, and auth form screens have validation/UI but no connected auth service. That is an appropriate stage for a modular monolith; no separate backend service or monorepo is justified by the current source.

The main architectural issue is ownership rather than a lack of folders. Route pages currently own substantial dashboard view and interaction logic; marketing, auth, and dashboard shell components all live under a generic `components` tree; and dashboard feature files combine domain types, mock data, persistence, context, and shared UI. The root layout also mounts marketing motion infrastructure around auth and dashboard routes.

The recommended direction is a gradual move toward route adapters plus feature-owned UI/use cases/data contracts. Keep shared UI genuinely cross-feature, keep server-only integrations behind `src/server` or feature server modules, and preserve current routes and visuals throughout migration.

## Current architecture assessment

### What is working

- `src/app` uses App Router conventions and route groups cleanly separate auth layout from public routes. Existing URL paths include `/`, `/login`, `/cadastro`, `/recuperar-senha`, and `/dashboard/...`.
- Pages/layouts are Server Components by default; client directives are generally placed on interactive components and dashboard pages that consume browser state.
- `src/features/dashboard` is already a useful feature-first foothold, with dashboard overview components colocated by screen and data separated from component markup.
- Shared primitives (`src/components/ui`) and design tokens (`src/styles/tokens.css`) exist. `src/lib/utils.ts` centralizes `cn` rather than duplicating class utilities.
- The dashboard context is scoped to `src/app/dashboard/layout.tsx`, rather than the root layout.
- Several event handlers have cleanup: `SmoothScroll`, `MotionProvider`, and dashboard theme listeners return teardown callbacks; `ShapeWaves` includes visibility/reduced-motion behavior and listener cleanup.
- `docs/performance-profiling.md` already distinguishes JS heap, tab/process memory, and GPU memory, and explicitly avoids claiming measurements unavailable in the current environment. Preserve this evidence-first performance practice.

### Main boundary problems

1. **Route modules contain feature implementation.** `src/app/dashboard/page.tsx`, `projects/page.tsx`, `projects/new/page.tsx`, and `projects/[projectId]/page.tsx` contain page-specific data selection, forms, state transitions, and UI. This makes route modules large and blurs routing with feature ownership.
2. **Feature ownership is inconsistent.** Dashboard has a feature folder, while auth and marketing UI are under `src/components/auth` and `src/components/marketing`. The generic components tree owns both cross-feature UI and feature-specific components.
3. **Dashboard boundaries are too broad.** `src/features/dashboard/data.ts` includes domain types and demo fixtures; `repository.ts` mixes browser persistence with mock reads; `DashboardProvider.tsx` owns fetching, persistence orchestration, and theme state; `UI.tsx` combines layout components with formatting and project-row behavior.
4. **Global motion does not match route needs.** `src/app/layout.tsx` mounts `SmoothScroll` and `MotionProvider` for marketing, auth, and dashboard. Their work is associated with visual marketing effects, while the dashboard already has its own interaction controls.
5. **Future backend concerns are not yet modeled.** Auth forms are UI only, while project creation persists client-side and scans/findings are fixtures. No server boundary exists yet to own credentials, authorization, provider callbacks, uploads, or scan orchestration.

## Prioritized findings

| Priority | Finding and evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Impact                                               | Complexity    | Risk / confidence                                                                                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | Root layout mounts `SmoothScroll` and `MotionProvider` globally: `src/app/layout.tsx`; Lenis CSS is global. This can initialize global listeners/animation work on auth and dashboard pages that do not need the landing-page experience.                                                                                                                                                                                                                                                                                     | Performance, route responsibility                    | Low to medium | Confirmed scope; cost on real devices needs measurement.                                                                                                                                                                         |
| P1       | `src/components/marketing/ShapeWaves.tsx` is a ~900-line client component importing `vgpu` and WGSL preparation, managing WebGPU resources, RAF, visibility, reduced motion, pointer and scroll listeners. It is used in `Hero.tsx`, `AuthLayout.tsx`, and `app/page.tsx` (closing canvas).                                                                                                                                                                                                                                   | Bundle cost, resource lifecycle, maintainability     | Medium        | Confirmed heavy client surface; actual transfer/GPU cost requires production profiling.                                                                                                                                          |
| P1       | Dashboard project workflows and page-specific state live in route files, including a multi-step creation flow in `src/app/dashboard/projects/new/page.tsx`; overview route is also client-side and selects dashboard data.                                                                                                                                                                                                                                                                                                    | Maintainability, testability, contributor onboarding | Medium        | Confirmed.                                                                                                                                                                                                                       |
| P1       | Demo persistence is browser-only: `src/features/dashboard/repository.ts` reads/writes localStorage and combines it with mock fixtures from `data.ts`. Not suitable as a future API boundary without a replacement adapter and server authorization.                                                                                                                                                                                                                                                                           | Backend readiness, data correctness                  | Medium        | Confirmed current demo behavior.                                                                                                                                                                                                 |
| P2       | Generic ownership mixes UI and feature screens: `src/components/auth/*`, `src/components/marketing/*`, `src/components/dashboard/*`; dashboard feature UI is separately in `src/features/dashboard/UI.tsx`.                                                                                                                                                                                                                                                                                                                   | Discoverability, ownership                           | Medium        | Confirmed.                                                                                                                                                                                                                       |
| P2       | `DashboardProvider` exposes all projects/scans/findings and UI theme through one context (`src/features/dashboard/DashboardProvider.tsx`). Any context value change can rerender consumers; current data volume is small, but future dashboard growth could expand the invalidation surface.                                                                                                                                                                                                                                  | Rendering performance, coupling                      | Medium        | Risk is architectural; measure before splitting/context optimization.                                                                                                                                                            |
| P2       | `src/features/dashboard/UI.tsx` contains generic header/action/empty/status, a project row, and a date formatter. The `UI.tsx` name does not communicate its public contract and `dateLabel` is not UI.                                                                                                                                                                                                                                                                                                                       | Reuse clarity, module API                            | Low           | Confirmed.                                                                                                                                                                                                                       |
| P2       | `src/app/dashboard/layout.tsx` includes dense inline bootstrapping script for theme/sidebar localStorage state and a global dashboard wrapper. This is sensitive initialization logic with limited visibility and difficult reviewability.                                                                                                                                                                                                                                                                                    | Maintainability, hydration/theme flash risk          | Low to medium | Confirmed; observed flash behavior requires browser verification.                                                                                                                                                                |
| P2       | Data consumers repeatedly filter arrays in cards/pages (`dashboard/page.tsx`, `projects/page.tsx`, `projects/[projectId]/page.tsx`). Current fixture set is tiny.                                                                                                                                                                                                                                                                                                                                                             | Future scalability                                   | Low           | Optimization is a hypothesis until realistic data/React profiling shows a problem.                                                                                                                                               |
| P3       | Several likely stale/overlapping components exist, but names alone do not prove dead code. `ProductSection.tsx`, `HowItWorks.tsx`, and `ClosingReveal.tsx` have no internal import/reference in `src`; `ProductHowItWorksSection.tsx` appears to be the current combined section. `Badge.tsx`, `Alert.tsx`, `FormField.tsx`, `Input.tsx` are imported by some forms, whereas `Badge` has no source consumer. `OverviewEmptyWorkspace` appears exported but the dashboard page’s current usage must be checked before removal. | Bundle hygiene, contributor clarity                  | Low           | Verified source-reference search: no in-repo direct imports found for listed likely-unused files; external/test/tooling references not established. Do not delete without checking public expectations and route/build behavior. |
| P3       | Package manifest includes `@vgpu/wgsl`, `vgpu`, `gsap`, `lenis`, `motion`, form libraries, Zod, and lucide-react. Source confirms use of all listed runtime dependencies except potential transitive/deep API details; no dependency is proven unused by a package-name-only check.                                                                                                                                                                                                                                           | Dependency maintenance                               | Low           | Confirmed usages: `vgpu`/WGSL in ShapeWaves, GSAP in SmoothScroll/marketing sections, Lenis in SmoothScroll/global CSS, Motion in marketing/nav/FAQ; form stack in auth. Recheck with bundle analysis before dependency changes. |
| P3       | No path aliases beyond `@/*`, no package-level lint boundaries, and no documented import rules found in inspected config/readme.                                                                                                                                                                                                                                                                                                                                                                                              | Contributor consistency                              | Low           | Confirmed by `tsconfig.json`, `eslint.config.mjs` should be reviewed when adding enforced rules.                                                                                                                                 |

### Unused and overlapping code audit

The current `src` references show no direct import of `src/components/marketing/ProductSection.tsx`, `HowItWorks.tsx`, or `ClosingReveal.tsx`. The landing page imports `ProductHowItWorksSection.tsx`; the header/footer variants are imported through their parent sections. `src/components/ui/Badge.tsx` has no source import. This is a **candidate cleanup list**, not an automatic delete list: inspect history, storybook/test references, intended public component status, and confirm no dynamic string-based usage before removal.

No direct local import cycle was evident in the inspected graph: imports flow mostly from routes to components/features and from those to UI/config/lib. `src/features/dashboard/overview/components/*` imports dashboard UI/data upward within the same feature. This is not a confirmed cycle, but the direction is harder to enforce because the UI module is at feature root. Add automated cycle detection only if the project adopts a lint/build rule and the team finds it valuable; do not add a dependency solely for this report.

## Proposed target architecture

Keep the current App Router and migrate responsibilities incrementally. A possible end state (only create folders as real code moves there):

```text
src/
  app/                         # Route entry points, layouts, loading/error, metadata, route handlers
    (marketing)/               # Optional route group; URLs unchanged
    (auth)/
    dashboard/
    api/                       # Only when HTTP endpoints are needed
  features/
    auth/
      components/              # Forms, password controls, feature-specific shell pieces
      schemas/                 # Existing validation schemas
      server/                  # Auth use cases/session checks once provider selected
      api/                      # DTOs/client adapters only if needed
    projects/
      components/               # Project list/detail/create flows
      model/                    # Project types, validation, pure rules
      data/                     # Repository contract and implementations
    scans/
      components/
      model/
      data/
    findings/
      components/
      model/
    design-system-analysis/
      model/                    # Parsing/rules/results; keep CPU-heavy analysis out of UI
      data/
    github/
      components/               # Only provider UI
      server/                   # OAuth, API client, webhook handling
    dashboard/                  # Dashboard composition/shared dashboard shell; avoid owning all domains
  components/
    ui/                         # Cross-feature primitives with no domain-specific data access
    marketing/                  # Optional only if content remains site-level rather than feature-owned
  server/
    auth/                       # Shared server session/authorization infrastructure
    db/                          # Add after storage choice
    http/                        # Shared request/response/error helpers
  lib/                           # Small framework-agnostic helpers (e.g. cn); avoid dumping ground
  config/                        # Static app/site/nav configuration
  styles/                        # Global tokens and shared design primitives
  hooks/                         # Only hooks truly shared across unrelated features
  types/                         # Only cross-feature/shared types; feature types stay with feature
```

### Directory responsibilities

- **`src/app`**: URL tree, route groups, layouts, metadata, loading/error boundaries, and thin adapters composing feature exports. Keep pages small; pages may read route params/search params and call server use cases, but should not own reusable domain workflows. Route handlers belong here because Next.js discovers them here.
- **`src/features`**: Business capabilities and their UI. A feature owns its UI, validation, feature-specific hooks, domain types, data contracts, and (where appropriate) server use cases. Keep modules internal by default; expose a small `index.ts` only when a stable public API is useful. Avoid a barrel that re-exports every internal file.
- **`src/components`**: Reusable primitives and site-wide components that are genuinely shared by multiple features. Feature-specific components should migrate to their feature; don’t move everything merely to match a tree diagram.
- **`src/server`**: Server-only shared infrastructure: session/authorization helpers, storage client setup, provider clients, and shared HTTP/error utilities. Do not import from Client Components. Mark sensitive modules server-only once the pattern is introduced.
- **`src/lib`**: Small, environment-neutral utilities. Prefer named, focused modules over general-purpose `lib` aggregation. Server-only or browser-specific functionality should be named and separated, not hidden in a universal helper.
- **`src/config`**: Static product configuration, navigation, feature switches that are safe to expose, and public site metadata. Never place secrets or per-user state here.
- **`src/styles`**: Tokens and shared style foundations. Keep route/feature-specific CSS colocated where practical; preserve CSS import ordering and current visual tokens during moves.
- **`src/hooks`**: Cross-feature hooks only. A hook used by one feature belongs in that feature; hooks relying on DOM APIs are client-only and must not leak into server modules.
- **`src/types`**: Cross-feature structural types only. Types for projects, scans, findings, auth forms, and analysis results should live with their owning feature to avoid a catch-all shared type bucket.

### Import rules

1. `app -> features/components/config/lib/server` is allowed. `features -> components/ui, config, lib, and their own feature modules` is allowed.
2. A feature must not import another feature’s private implementation. Cross-feature collaboration should use a narrow exported type/use case or a higher-level composition in `app`/dashboard shell. Avoid domain-to-domain circular imports.
3. `components/ui` must not import feature modules, route modules, dashboard repositories, or browser-specific business state.
4. `server` modules may depend on server-safe `lib`, config, and domain modules. Client modules must never import `server` modules, secrets, or server-only package clients.
5. Keep `use client` at the smallest interactive leaf. Server pages/layouts should render server-owned data and pass serializable props to small client controls where feasible. Providers should be scoped to the narrowest route subtree that consumes them.
6. Prefer direct imports over broad barrels on hot route/client boundaries; this makes ownership and bundle graphs easy to inspect.

## Backend integration boundaries

Use a modular monolith initially. Each capability should define a domain contract/use case and an adapter; the chosen persistence/provider technology should sit behind that contract. Route handlers and Server Actions are transport entry points, not places for domain rules. When a Server Component reads data, call its server use case/repository directly instead of making an HTTP request to the app’s own Route Handler; Next.js backend-for-frontend guidance notes that the extra round trip is unnecessary and can fail during prerendering. Use Route Handlers for browser/API clients, webhooks, and external provider callbacks.

### Candidate domain ownership

- **Authentication (`features/auth`)**: form schemas and UI now; later sign-in/sign-up/reset use cases, session model, callback route adapters, and authorization policy. Verify authorization in server data access and mutations, not only in navigation or Proxy.
- **Projects (`features/projects`)**: project creation, source metadata, listing/details, and source-specific configuration. Define a `ProjectRepository` contract; replace localStorage with a server implementation without exposing credentials or trusting client-supplied ownership.
- **GitHub (`features/github`)**: OAuth install/callback, repository selection, token storage references, webhook validation, and API client. Keep provider secrets server-only. Project should depend on a GitHub source interface rather than directly on an OAuth SDK.
- **Scans (`features/scans`)**: scan request/state transitions, immutable scan inputs, status/result contract, and orchestration boundary. Long-running analysis should eventually be dispatched to a durable worker/queue; do not run it inside a short web request when processing time/retries require durability.
- **Findings (`features/findings`)**: finding lifecycle/status, severity, location, suppression/triage, and query contracts. Findings should reference project and scan identifiers without owning scan execution.
- **Design-system analysis (`features/design-system-analysis`)**: parsing, token normalization, rule evaluation, and versioned result schema. Keep deterministic analysis separate from request/UI code so it can be run in a worker and tested against fixtures.

### Technology decisions to defer explicitly

- **Database/ORM:** choose only after deciding tenancy, expected query patterns, migration ownership, deployment constraints, and contributor setup. A SQL database plus typed query layer may fit relational projects/scans/findings; an ORM improves schema ergonomics but adds generated-client/setup conventions. Direct SQL/query builder gives tighter control with more manual mapping. Avoid coupling domain contracts to ORM models.
- **Queue/worker:** no scan jobs currently run. Start with a synchronous local/demo adapter; introduce a queue only when scans need independent retries, durable status, concurrency control, or execution beyond web request limits. Compare managed queues with self-hosted worker complexity and local contributor reproducibility.
- **Authentication provider:** current screens do not establish account/session requirements. Compare managed OAuth/session providers for lower security/maintenance burden against a self-managed implementation for control and portability. Evaluate GitHub App installation separately from user login; the two identities and permission scopes are not interchangeable.
- **API shape:** server use cases can serve App Router pages directly. Add Route Handlers when external clients, webhooks, or stable public APIs require HTTP contracts. Version public APIs deliberately; don’t make internal UI DTOs accidental public contracts.

## Performance and Server/Client findings

### Confirmed from source

- `src/app/layout.tsx` imports global Lenis CSS and renders `SmoothScroll` and `MotionProvider` around all routes. `SmoothScroll` imports Lenis and GSAP/ScrollTrigger; `MotionProvider` installs global pointer behavior for elements tagged with `data-magnetic`/card attributes. This widens the application-wide client behavior and initialization scope.
- Marketing pages contain many Client Components importing `motion/react`; `SolutionsSection.tsx` and `ClosingReveal.tsx` use GSAP/ScrollTrigger. `ShapeWaves.tsx` imports `vgpu` and `@vgpu/wgsl/prepare` and contains WebGPU setup, shader preparation, RAF and global listeners. The hero imports it directly; the closing scene also renders it. Auth layout imports `ShapeWaves` as a background too, so the heavyweight component is not landing-only.
- Dashboard overview, projects, project creation, and project detail are marked client-side because they consume context/state/browser APIs. Other dashboard routes (`scans`, `findings`, `settings`) are server-rendered and mostly static today.
- `DashboardProvider` uses localStorage and `matchMedia` effects, correctly making it a client provider within dashboard layout. Its context value object is recreated on provider renders; all consumers subscribe to the same broad value.
- `ShapeWaves` registers `visibilitychange`, reduced-motion change, `pointermove`, and captured `scroll` listeners and has RAF logic. Source includes corresponding cleanup and offscreen/reduced-motion handling; inspect the complete teardown path during dedicated GPU lifecycle review.
- `src/app/dashboard/layout.tsx` uses an inline script to avoid preference flash from localStorage. It should be treated as an intentional pre-hydration bootstrap until equivalent behavior is demonstrated; formatting, CSP, and failure handling deserve review.

### Opportunities and hypotheses to measure

1. **Scope motion by route.** Move Lenis/marketing motion wrappers into the marketing layout/route group (route-group names can change without changing URLs). This should avoid loading/initializing them for dashboard/auth routes. Confirm the dependency is absent from those route client chunks in a production bundle report.
2. **Lazy-load canvas.** A client-only dynamic import for below-the-fold/closing and perhaps hero canvas can defer WebGPU code until needed. Preserve server-rendered fallback and graceful no-WebGPU/reduced-motion behavior. The auth shell’s ShapeWaves background currently makes this shared; decide whether auth truly needs it before splitting. Measure initial JS and visual loading before/after.
3. **Review number of simultaneous GPU contexts.** Landing renders a hero and closing canvas; auth adds another on a separate route. The code includes visibility controls, but GPU allocation/context cost and reinitialization need target-browser profiling. Existing `docs/performance-profiling.md` is the right protocol; record JS heap, tab memory, and GPU telemetry separately.
4. **Inspect global event work.** `MotionProvider` loops over matching nodes on pointer movement and `SmoothScroll` participates in animation/scroll tracking. Their listener cleanup exists; measure callback frequency and per-frame scripting time before optimizing. Prefer scoped pointer/scroll observers and passive listeners where semantics permit.
5. **Dashboard rerenders.** Current datasets are tiny. If profiling shows wasted renders, split theme from dashboard data context, memoize context values/selectors, or use feature-level state. Do not preemptively add a state library.
6. **Data derivation.** Cards repeatedly filter/find projects, scans, and findings. This is negligible at current fixture scale; consider indexes/derived selectors only after realistic data and React Profiler show measurable cost.
7. **Import hygiene.** Inspect production route chunks/analyzer before replacing icon imports or removing animation packages. The source uses individual `lucide-react` icons; package behavior/tree-shaking must be confirmed in the generated bundle rather than inferred.

### Server/Client target

Keep static marketing copy, route shells, project list/detail layout, and data formatting on the server when data becomes server-backed. Isolate interactivity to navigation toggles, form controls, filters, preference controls, animations, and browser file selection. For a client filter, a small client island can receive a serializable collection or a server-paginated result. Keep server-side project authorization and secrets out of client graphs. Providers should be placed in the dashboard layout only for shared client state that truly spans dashboard pages; auth forms can own their own client form boundary.

## Open-source documentation recommendations

The current `README.md` is only a name, one-line description, and work-in-progress note. Establish a concise contributor path and keep detailed architecture decisions in `docs/`.

```text
README.md                         # Product status, screenshots/demo, features, setup, scripts, links
CONTRIBUTING.md                   # Setup, branch/PR expectations, code style, review workflow
AGENTS.md                         # Repository-specific agent instructions; keep Next version note accurate
CODE_OF_CONDUCT.md                # Contributor Covenant or another explicit community standard
SECURITY.md                       # Supported versions, private vulnerability reporting, response expectations
LICENSE                           # Explicit OSI-approved license before presenting as open source
docs/
  architecture/
    refactoring-plan.md           # This audit; update as phases land
    decisions/                    # Small ADRs for auth, persistence, scans, analysis contracts
  getting-started/
    development.md                # Prerequisites, install, env example, dev/build/lint/typecheck
    troubleshooting.md
  features/
    projects.md
    scans.md
    findings.md
    github-integration.md
  design-system/
    rules.md
    token-model.md
  agents/
    repository-map.md              # Agent entry points and safe change workflow
.github/
  ISSUE_TEMPLATE/
    bug_report.yml
    feature_request.yml
  PULL_REQUEST_TEMPLATE.md
  workflows/
    ci.yml                         # Install, lint, typecheck, production build; add tests when present
    security.yml                   # Dependabot/code scanning policy if maintainers enable it
```

README should clearly label demo-only behavior, especially auth, GitHub source selection, localStorage project persistence, and scan fixtures. Add a `.env.example` only when real env variables exist; never commit secrets. CONTRIBUTING should document current scripts from `package.json`: `npm run dev`, `npm run build`, `npm run lint`, and `npm run typecheck`. The repository currently has no test script in the inspected manifest, so CI should not imply tests exist; add a test strategy as a separate project decision. `AGENTS.md` already includes a critical Next.js 16 instruction to read installed docs; retain it and document any repository-specific import/client rules there. Select an explicit license before inviting code reuse; do not assume the project is legally open source from its README wording alone.

## Incremental migration phases

Each phase should be a small, reviewable PR. Preserve existing URL paths, visual output, animations, and demo behavior. Move files only after an import map and rollback point are clear.

### Phase 0 — Baseline and contributor contract

- Record current route paths, screenshots, and production bundle sizes for `/`, auth routes, and `/dashboard`.
- Verify app scripts and Next.js version; document install/build/lint/typecheck and demo limitations.
- Add the docs skeleton and an architecture/import-boundary section. Do not move code yet.
- **Validation:** `npm run lint`, `npm run typecheck`, `npm run build`; compare route screenshots and current routes. Capture bundle analyzer/report if available without adding a permanent dependency unless needed.

### Phase 1 — Route-owned motion and provider scope (highest leverage)

- Add a marketing route-group layout while preserving all URLs, then move `SmoothScroll`, `MotionProvider`, and Lenis CSS to the marketing subtree if auth/dashboard do not rely on them.
- Keep auth’s background canvas behavior deliberately: it currently uses ShapeWaves independently, so preserve it or replace only with an equivalent lazy-loaded rendering path after visual comparison.
- Keep dashboard provider scoped to dashboard as it is now; split theme preference concern from project/scan data only if ownership becomes clearer in implementation.
- **Validation:** all route paths load; auth/dashboard have no marketing scroll or pointer effects; landing interactions still work; reduced-motion mode; production client chunks; no hydration/console errors; compare light/dark/sidebar preference bootstrap.

### Phase 2 — Extract dashboard page features

- Create project-owned components for list/filter, new-project flow, and project detail. Reduce route files to composition and route parameter handling.
- Split dashboard domain types and demo fixtures; define repository interfaces with explicit local-demo adapter naming. Keep current storage behavior until a backend implementation is ready.
- Rename/rehome `UI.tsx` into focused shared dashboard UI and pure formatting modules. Keep overview cards colocated in the overview feature.
- **Validation:** preserve create/list/detail behavior, localStorage compatibility, empty/error/loading states, route navigation, and existing styling. Check no import cycles and compare route screenshots.

#### Phase 2 implementation update — dashboard feature boundaries

**Completed changes**

- Extracted dashboard overview composition from `src/app/dashboard/page.tsx` to `src/features/dashboard/overview/OverviewView.tsx`; the route page now only renders the feature view.
- Extracted project listing/filtering, multi-step creation, and project details from route modules to `src/features/projects/components/ProjectListView.tsx`, `NewProjectView.tsx`, and `ProjectDetailsView.tsx`. Route modules are now small composition wrappers. The dynamic details view still uses the existing `useParams` client behavior; no backend-dependent server conversion was introduced.
- Moved the dashboard sidebar shell into `src/features/dashboard/components/DashboardSidebar.tsx`; the dashboard layout retains the same provider boundary, preference bootstrap, DOM composition, and stylesheet. The legacy `DashboardHeader` module moved alongside the shell and remains unreferenced by current routes.
- Replaced the broad `features/dashboard/UI.tsx` with descriptively named dashboard presentation components. Project rows now belong to projects. Date formatting is a small pure utility in `src/lib/date-label.ts`; dashboard status display is shared at `src/components/dashboard/DashboardStatus.tsx`.
- Split domain types into `features/projects/model/types.ts`, `features/scans/model/types.ts`, and `features/findings/model/types.ts`; split demo fixtures/repositories under the corresponding feature folders.
- Added `ProjectRepository` contract and `localStorageProjectRepository` adapter. The adapter retains the exact `drift-demo-projects-v1` storage key, existing serialized project shape, merge order with mock projects, generated IDs, timestamps, and failure behavior. Existing local demo projects remain readable without migration.
- Added deliberate `public.ts` feature entry points for dashboard composition to consume project, scan, and finding services/types. Dashboard components consume public type exports; project feature internals remain colocated.
- Kept the existing `DashboardProvider` ownership and initialization timing for project/scan/finding state and theme. No state library, backend, new dependency, or rerender optimization was introduced.

**Current dashboard source structure**

```text
src/app/dashboard/
  layout.tsx
  page.tsx
  findings/page.tsx
  projects/page.tsx
  projects/new/page.tsx
  projects/[projectId]/page.tsx
  scans/page.tsx
  settings/page.tsx
  dashboard.css
src/features/dashboard/
  DashboardProvider.tsx, dashboard-context.ts, public.ts
  components/                       # Dashboard shell + dashboard presentation
  overview/OverviewView.tsx
  overview/components/               # Existing overview cards/states
src/features/projects/
  public.ts
  model/types.ts, selectors.ts
  data/project-repository.ts
  data/local-storage-project-repository.ts
  data/demo-fixtures.ts
  components/                        # List, create, details, project row
src/features/scans/
  public.ts
  model/types.ts
  demo/fixtures.ts, repository.ts
src/features/findings/
  public.ts
  model/types.ts
  demo/fixtures.ts, repository.ts
src/components/dashboard/             # Shared dashboard status display
src/lib/date-label.ts                 # Pure date formatter
```

**Import rules now applied**

- Route modules compose feature views and shared dashboard presentation; they no longer contain project workflow markup/state.
- `features/projects` owns project types, selectors, project-row UI, repository contract, and local demo persistence.
- `features/scans` and `features/findings` own their models and demo repositories. Dashboard composition imports their intentional `public.ts` surfaces rather than their internal implementation paths.
- Shared UI primitives remain feature-agnostic. Dashboard-specific presentation lives with dashboard; project-specific rows live with projects.
- Feature model types are imported from the owning feature’s public API when consumed by other features. No barrel was added for internal component trees.

**Validation record**

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build -- --webpack`: passed with Next.js 16.4.5 (webpack). Route table retains `/dashboard`, `/dashboard/findings`, `/dashboard/projects`, `/dashboard/projects/new`, `/dashboard/projects/[projectId]`, `/dashboard/scans`, and `/dashboard/settings`.
- Default `npm run build` (Turbopack) compiled until CSS processing, then the tool process panicked because the sandbox denied a subprocess port bind while handling Lenis CSS. Re-running the production build through the installed Next.js `--webpack` option passed.
- Browser interaction testing was not available in this execution environment. Persistence key/record compatibility was verified from the implementation path and preserved code; refresh persistence, theme/sidebar interactions, responsive appearance, and hydration/console behavior still need a browser run. The package has no `start` script, and starting the built server directly was denied by the sandbox (`listen EPERM`), so HTTP/browser smoke checks could not be performed.
- No performance changes were measured or claimed.

**Remaining technical debt and readiness**

- `DashboardProvider` still combines dashboard datasets with theme preference state, by design for this incremental phase; split only when a concrete ownership or rendering need justifies it.
- Overview cards still derive some relationships by filtering arrays; current data is small, so optimization remains measurement-driven.
- `DashboardHeader` was retained after Phase 2; Phase 3.5 removes it after confirming it has no runtime/CSS references and the layout renders its own mobile header.
- Demo fixture reads remain in-memory and project storage remains browser-local. This is intentional until backend requirements are selected.
- Phase 3 (auth and marketing ownership) is ready; no dashboard-specific dependency remains on the old shared UI module. Project screens use the dashboard public API for workspace state/presentation; dashboard implementation remains behind `dashboard-context.ts` and the provider.

### Phase 3 — Align auth and marketing ownership

- Move auth forms/schemas and auth-only layout pieces under `features/auth`; leave global primitives in `components/ui`.
- Review marketing components with no direct source references (`ProductSection`, `HowItWorks`, `ClosingReveal`) against Git history and expected public use. Remove only in a dedicated cleanup PR after confirmation; otherwise document as experiments or restore use intentionally.
- Keep marketing section composition readable and move nav-only hooks/config next to marketing only if they are not reused elsewhere.
- **Validation:** all auth routes render with current forms and validation; navigation/footer responsive behavior and animations unchanged; run repository-wide reference search after each move.

#### Phase 3 implementation update — auth, marketing, and shared motion ownership (2026-11-10)

**Completed changes**

- Moved auth UI into `src/features/auth/components/`: login, registration, recovery forms, password field, auth shell/layout, auth navbar, and auth footer. Existing schemas remain in `src/features/auth/schemas/`. Auth routes now import from the auth feature; no auth module imports a marketing feature module.
- Moved live marketing page sections, header/footer, and deferred canvas wrapper into `src/features/marketing/components/`. Marketing-only desktop/mobile navigation and the header scroll hook are under `components/navigation/`; decorative visibility logic is under `src/features/marketing/hooks/`.
- Promoted the compact desktop navigation and resources menu, used by both the marketing header and auth navbar, to `src/components/navigation/`. They depend on shared UI/config only, so auth no longer depends on marketing implementation.
- Moved `ShapeWaves.tsx` unchanged from the marketing components tree to `src/components/motion/ShapeWaves.tsx`. Marketing Hero, the deferred footer instance, and auth layout now consume the shared motion component. `MotionProvider` and `SmoothScroll` remain in shared infrastructure and are mounted only by `(marketing)/layout.tsx`, preserving Phase 1 route scoping.
- Retained `ProductSection`, `HowItWorks`, and `ClosingReveal` in `src/features/marketing/experiments/`, with a README identifying them as inactive alternatives. Repository-wide source search found no runtime or dynamic imports; Git history confirms prior marketing commits. `Badge` remains in `src/components/ui/` as a generic, historically established primitive despite having no current consumer. Nothing was deleted.
- Shared UI primitives remain under `src/components/ui/`; auth schemas and marketing navigation configuration remain in their existing feature/config locations. No dependency, provider, global effect, visual, copy, timing, route, or dashboard change was introduced.

**Current auth/marketing architecture**

```text
src/app/
  (auth)/                         # /login, /cadastro, /recuperar-senha and auth layout
  (marketing)/                    # / landing route and marketing layout
src/features/auth/
  components/                     # Forms, auth shell/layout, navbar, footer, password control
  schemas/                        # Zod form schemas
src/features/marketing/
  components/                     # Live sections, header/footer, deferred ShapeWaves wrapper
    navigation/                   # Marketing-only desktop/mobile header variants and hook
  hooks/                          # Marketing-only decorative visibility hook
  experiments/                    # Inactive historical section alternatives + README
src/components/
  navigation/                     # Compact desktop navigation and resources menu shared by auth/marketing
  motion/                         # Shared ShapeWaves and SmoothScroll; providers remain marketing-mounted
  ui/                             # Cross-feature primitives
```

**Ownership and import boundaries**

- `app/(auth)` and `app/(marketing)` compose their feature-owned route views/layouts while preserving existing paths.
- Auth owns auth forms, password behavior, auth composition, and validation. It consumes shared UI, shared compact site navigation, and shared ShapeWaves; it does not import marketing feature code.
- Marketing owns live landing content and its page-specific navigation/hook behavior. Its motion providers remain scoped to the marketing layout.
- Shared motion code has no auth/marketing business dependencies. `ShapeWaves` is intentionally shared because both features render it.
- `components/navigation` is shared site chrome because both auth and marketing use the compact navigation/resources menu. Marketing-specific desktop/mobile header behavior stays with the marketing feature.
- Inactive historical sections are explicitly segregated from the live component tree; they remain available for reference and are not imported by runtime route code.
- No circular imports were found in the audited auth/marketing component graph. No broad feature barrels were introduced.

**Phase 3 validation record**

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build` (Turbopack): failed before application compilation completed because the sandbox denied a subprocess port bind during CSS processing (`Operation not permitted`, reported while writing `/favicon.ico/route` and processing `src/app/dashboard/dashboard.css`). This matches the environment-level Turbopack/PostCSS restriction seen in Phase 2; it is not evidence of an application regression.
- `npm run build -- --webpack`: passed with Next.js 16.4.5. The generated route table retains `/`, `/login`, `/cadastro`, `/recuperar-senha`, and all dashboard routes.
- Generated production HTML/chunk inspection: landing HTML references the marketing layout/page and the ShapeWaves shader chunk; auth HTML references the auth layout/page and shared ShapeWaves chunk; dashboard HTML references neither marketing layout/page chunks nor the ShapeWaves shader chunk. The shared resources/navigation and auth chunks are route-specific as expected. The shader chunk emitted at 217,194 bytes in this Webpack build; this is an emitted-file size only and is not directly comparable with the 230,528-byte historical Turbopack measurement in `docs/performance-profiling.md`.
- Repository-wide reference audit found no old `components/auth`, `components/marketing`, or `marketing/site-header` import paths, no dynamic imports of the retained experiment components, and no feature component importing auth or marketing internals across boundaries.
- Browser checks for auth forms/validation, responsive navigation, scroll storytelling, Hero/footer/auth canvases, reduced motion, hydration, and console errors were unavailable in this execution environment. These remain open manual checks.
- No performance or GPU allocation improvement is claimed or measured.

**Remaining issues and Phase 4 readiness**

- `Badge` has no current consumer, but remains a generic UI primitive with project history; review it separately if shared UI cleanup is desired.
- The three inactive marketing alternatives remain as code rather than being removed. Their future use should be an explicit product decision.
- Browser verification of the moved components is still outstanding; production HTML/chunk inspection confirms route chunk separation, but cannot establish interactive behavior or GPU lifecycle correctness.
- Phase 4 backend contracts can proceed independently. Auth remains presentation/schema only, and no server sessions or provider integration were added.

#### Phase 3.5 implementation update — final architectural cleanup (2026-11-10)

- **Confirmed cleanup:** `src/components/intro/` and `src/components/experiment/` were empty in the worktree and unreferenced; removed the empty directories. The tracked intro files were already deleted in the existing worktree and were left as-is. No other empty source directories remain.
- **Ownership:** moved `SmoothScroll.tsx` into `src/components/motion/` and updated only the marketing layout import. It remains initialized only under `(marketing)`. Moved `DashboardStatus` into `src/features/dashboard/components/` and exported it through the existing dashboard public API because its markup/classes are dashboard-specific.
- **Confirmed unused removal:** removed `features/dashboard/components/DashboardHeader.tsx`. Repository-wide import/reference search found no use, its only CSS class `dash-mobile-header` is unreferenced, and current `dashboard/layout.tsx` provides its own mobile brand header. The component has prior Git history but no planned/live caller.
- **Fixture consistency:** moved project fixtures from `projects/data/demo-fixtures.ts` to `projects/demo/fixtures.ts`. Contracts and the localStorage adapter remain in `projects/data/`; the existing storage key and record shape are unchanged. Scans/findings keep their small `demo/` fixture and repository modules.
- Removed the unused `useDashboard` re-export from the provider module; consumers use the intentional `features/dashboard/public.ts` entry point. No other public exports were found redundant.
- `.gitignore` already covered dependencies, Next/build outputs, coverage, environment files, logs, build caches, TypeScript build info, OS metadata, and local editor config. Added common temporary editor/file suffixes (`*.tmp`, `*.temp`, `*.swp`, `*.swo`, `*~`). No ignored generated artifacts are tracked; local `tsconfig.tsbuildinfo` is ignored and was left in place.
- **Retained after review:** `Badge` has no current source consumer but remains a reusable UI primitive with established history. The three marketing alternatives remain documented in `features/marketing/experiments/README.md` and are not runtime imports.
- **Boundary verification:** shared UI imports no feature modules; auth imports no marketing feature internals; marketing owns Lenis/GSAP pointer providers; dashboard imports no marketing motion modules; `ShapeWaves` remains shared. Feature public APIs remain small and direct; no new abstractions or dependencies were added.
- **Validation:** `npm run lint`, `npm run typecheck`, and `git diff --check` passed. Default `npm run build` failed at CSS processing with Turbopack attempting to create a subprocess and bind a port (`Operation not permitted`) while writing `/favicon.ico/route` from `src/app/dashboard/dashboard.css`; this is the previously observed sandbox restriction, not an application compilation error. `npm run build -- --webpack` passed and emitted all expected routes: `/`, `/login`, `/cadastro`, `/recuperar-senha`, `/dashboard`, `/dashboard/findings`, `/dashboard/projects`, `/dashboard/projects/new`, `/dashboard/projects/[projectId]`, `/dashboard/scans`, and `/dashboard/settings`.
- Generated HTML/chunk inspection confirmed landing HTML loads marketing route chunks, auth HTML loads auth route chunks plus the shared ShapeWaves chunk, and dashboard HTML loads neither marketing route chunks nor ShapeWaves. The Webpack emitted ShapeWaves chunk is 217,194 bytes; this is output size, not a transfer/runtime/GPU measurement, and is not comparable with the prior Turbopack number.
- Repository hygiene checks found no empty directories outside explicitly preserved `.agents`/tooling locations, no tracked build/cache/env/log/OS artifacts, and no import cycles in the source graph. Shared `components/ui` has no feature imports. Browser smoke testing was unavailable, so no visual or interaction claim is made.

**Phase 3.5 remaining technical debt:** Dashboard overview/project-detail files retain dense JSX from the existing implementation; reformatting them was outside this cleanup because it could obscure behavior changes. Architecture is ready for commit organization and continued frontend work after browser smoke testing is available.

### Phase 4 — Establish backend contracts before provider decisions

- Introduce project, scan, finding, auth, and GitHub contracts/use cases within owning features. Add a server-only boundary and transport adapters only when a real integration is selected.
- Define validated input/output DTOs separately from persistence records. Keep GitHub user login and GitHub App installation distinct.
- Define scan lifecycle and versioned analysis result contract before adding queue or storage implementation.
- **Validation:** domain/use-case checks against deterministic fixtures; authorization tests before protected reads/mutations become real; HTTP contract tests for callbacks/webhooks; local contributor setup remains documented.

### Phase 5 — Add integrations in independently reversible slices

- Select auth, database/query layer, and queue after documenting trade-offs in ADRs. Implement one adapter at a time behind stable contracts.
- Replace local demo persistence and fixtures with server implementations while retaining demo seed/fallback behavior only if product requirements call for it.
- Add observability for scan status, failures, duration, and provider rate limits before production workload grows.
- **Validation:** migration/rollback rehearsal, authorization boundary checks, webhook signature checks, retry/idempotency checks for scans, and production smoke tests.

## Risks and compatibility considerations

- **Route groups:** route-group folders do not alter URLs, but duplicate page paths across groups can conflict. Move one route family at a time and check route build output.
- **Client boundary movement:** moving a provider or component can change hydration, context availability, and bundle splitting. Verify provider ancestors, serializable props, and hydration in production builds.
- **Motion behavior:** current scroll-linked animations may depend on global CSS variables/state and GSAP plugin registration. Search `src/app/globals.css`, `src/app/dashboard/dashboard.css`, and motion files before relocating. Preserve behavior on reduced-motion and touch devices.
- **WebGPU availability:** browser/GPU support can vary; ensure existing fallback behavior remains when lazy-loaded or split. Test browsers without WebGPU and tab visibility transitions.
- **Local demo data:** renaming storage keys or changing data shapes can strand users’ browser-local demo projects. Keep a compatibility reader/migration or explicitly version the demo storage format.
- **Auth semantics:** route labels do not establish a secure authentication flow. Do not represent demo forms as account creation before sessions/provider integration and server-side authorization exist.
- **CSS imports:** Next.js global CSS import restrictions/order may matter when relocating `lenis/dist/lenis.css` or dashboard styles. Verify against installed Next 16 documentation/build output.
- **Dependencies:** avoid removing GSAP/Motion/Lenis/vgpu based on general preference. Compare route chunk sizes and animation coverage, then remove only when no real usage remains.
- **Open-source license/security:** publishing without a license leaves reuse terms unclear; publishing vulnerability instructions without a private contact path is also incomplete. Resolve maintainers/contact details before public promises.

## Phase validation checklist

- [ ] Required paths still resolve: `/`, `/login`, `/cadastro`, `/recuperar-senha`, `/dashboard`, `/dashboard/projects`, `/dashboard/projects/new`, `/dashboard/projects/[projectId]`, `/dashboard/scans`, `/dashboard/findings`, `/dashboard/settings`.
- [ ] Existing marketing/auth/dashboard styling, content, animations, keyboard navigation, and reduced-motion behavior are preserved.
- [ ] `npm run lint`, `npm run typecheck`, and `npm run build` pass after structural changes.
- [ ] Client bundle boundaries are inspected on production output; no server-only modules, credentials, or unnecessary marketing animation stack enter dashboard/auth client graphs.
- [ ] All effects/listeners/RAF/WebGPU resources are cleaned up on unmount, visibility changes, and initialization failure; verify in browser profiling rather than source inspection alone.
- [ ] Browser-local demo project compatibility is preserved or intentionally migrated.
- [ ] Import rules are followed; no route imports another route module, no UI primitive imports a feature, and no cross-feature private import cycle is introduced.
- [ ] Documentation explains current demo limitations and gives a contributor a repeatable local setup.

## Final recommendation

Start with route-scoping the motion systems and extracting dashboard page workflows into the existing feature architecture. These changes reduce global client work and clarify ownership without requiring a backend, new state library, or a large rewrite. Treat the current dashboard repository as a replaceable demo adapter, not as a production backend foundation. Add backend contracts and provider-specific integrations only when product requirements and deployment constraints are known.

## Phase 1 implementation update — route boundaries and motion ownership

### Completed changes

- Added `src/app/(marketing)/layout.tsx` and moved the existing landing route entry from `src/app/page.tsx` to `src/app/(marketing)/page.tsx`. Route groups do not add a URL segment, so the landing route remains `/`.
- The marketing layout now owns `SmoothScroll`, `MotionProvider`, and the Lenis stylesheet import. The root `src/app/layout.tsx` retains document structure, fonts, shared metadata, and global styles only.
- Authentication remains in its existing `(auth)` route group and continues to render `AuthLayout` with its intentionally shared `ShapeWaves` background. It does not receive the marketing motion providers.
- Dashboard layout and provider were not changed. The dashboard no longer inherits Lenis/GSAP ticker initialization or the marketing delegated pointer/scroll listeners from the root layout.
- `ShapeWaves` was not modified. Hero and auth keep their eager instances. The existing `DeferredShapeWaves` wrapper remains on the landing closing scene; it observes the section with a 200% root margin and mounts the existing canvas only near the viewport, preserving a same-color container background before mount. This defers footer GPU setup without adding a second context or changing shaders/configuration.
- Global CSS rules for magnetic/card transforms and reduced motion remain unchanged to preserve visuals. They are inert on routes without elements carrying those attributes.

### Ownership and measured results

- **Motion ownership:** `src/app/(marketing)/layout.tsx` owns the landing Lenis/GSAP ticker and delegated pointer physics. Marketing sections may continue to use their own Motion/GSAP component effects. Auth owns only its existing animated ShapeWaves background; dashboard owns only its dashboard-specific controls.
- **Client-boundary review:** root and auth layouts remain Server Components. `SmoothScroll`, `MotionProvider`, and `ShapeWaves` remain Client Components because they use effects, browser APIs, or WebGPU. Dashboard pages that consume its client context remain client-side. No other boundary was changed as part of this phase.
- **Performance measurement:** no before/after browser timing or bundle-size benchmark is available from the current environment, and no production chunk analyzer was run. The architectural expectation is that auth/dashboard route trees no longer import the marketing layout’s `SmoothScroll`, Lenis stylesheet, or `MotionProvider`; this should be confirmed from production client chunk manifests/build analysis. The footer canvas is mounted later by viewport proximity, but actual GPU-memory savings were not measured.
- **Known global style behavior:** `--scroll-velocity` remains globally declared and the CSS motion selectors remain global for compatibility. Only the marketing layout writes the scroll velocity variable. Removing or relocating these CSS rules is outside the verified visual scope of this phase.

### Phase 1 validation record

- `npm run lint`: passed.
- `npm run build`: passed with Next.js 16.4.5 (Turbopack). The generated route table includes `/`, all three auth routes, and all existing dashboard routes, including `/dashboard/projects/[projectId]`.
- `npm run typecheck`: passed after the production build regenerated stale `.next/types` that had still referenced `src/app/page.tsx`. The first typecheck immediately after the route move failed only on those stale generated route references.
- Production client-reference manifest inspection: dashboard route manifests contain dashboard-specific modules and do not reference `ShapeWaves`, `vgpu`, `@vgpu/wgsl`, GSAP, Lenis, `SmoothScroll`, or `MotionProvider`. The auth manifest includes marketing `ShapeWaves` as required. The landing manifest includes the marketing motion bundle. This confirms the dashboard is no longer assigned those marketing client references by its route tree; it is not a before/after transfer-size measurement.
- `DeferredShapeWaves` source review: footer canvas creation is delayed until an IntersectionObserver sees the container within a 200% root margin, with cleanup on unmount and a background-color placeholder. No browser visual or GPU allocation measurement was available, so no claim is made about perceived loading or GPU-memory reduction.
- Browser checks for live scroll/interaction behavior, reduced-motion toggling, hydration/console errors, and actual WebGPU initialization count were not run in this environment. These remain required manual checks on a supported browser/device.
