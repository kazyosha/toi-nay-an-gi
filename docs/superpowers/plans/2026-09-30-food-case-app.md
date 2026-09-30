# Food Case App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vietnamese food randomizer with a CS:GO-inspired case-opening interaction, PostgreSQL persistence, and a protected admin CRUD area that deploys cleanly to Vercel.

**Architecture:** Use a Next.js App Router application with TypeScript. Read and mutation boundaries stay server-side through Prisma-backed Server Actions or Route Handlers; the reel and admin form interactions are isolated client components. PostgreSQL is provisioned through a Vercel Marketplace integration, with Prisma migrations and a separate seed command.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4, Motion, Prisma ORM, PostgreSQL via Prisma Postgres or Neon Marketplace, Vitest, Testing Library, and Playwright.

**Spec:** `docs/superpowers/specs/2026-09-30-food-case-design.md`

## Global Constraints

- Use a single dark theme with a violet-magenta primary accent.
- Use `DESIGN_VARIANCE: 8`, `MOTION_INTENSITY: 8`, and `VISUAL_DENSITY: 5` as the visual targets.
- Keep the product non-monetized: no wagers, paid cases, virtual currency, or redeemable rewards.
- Use PostgreSQL through a Vercel Marketplace integration; do not use SQLite for runtime data.
- Never write runtime uploads to the Vercel filesystem; store image URLs and leave Vercel Blob as an optional follow-up.
- Protect every `/api/admin/*` route and admin mutation with the server-side admin session check.
- Use weighted random selection only from active dishes matching the requested categories.
- Support loading, empty, error, keyboard, contrast, and reduced-motion states.
- Do not copy third-party logos, text, or image assets from the visual reference.
- Do not use em dashes in visible page copy.

## Review Focus

- Empty active pool: the draw API returns a stable `EMPTY_DISH_POOL` error and the public UI explains how to resolve it.
- Invalid dish input: schema validation rejects missing URLs, invalid categories, non-positive weights, and out-of-range spice levels before Prisma writes.
- Admin session boundary: unauthenticated requests cannot read or mutate admin data, and logout invalidates the session cookie.
- Serverless database behavior: Prisma client creation does not create an unbounded connection pool per request and production uses `DATABASE_URL` from Vercel.
- Reduced-motion and mobile: reel animation is replaced by a short state transition and all primary actions remain usable below 768px.

### Task 1: Scaffold the Next.js application and test foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `.env.example`
- Create: `.gitignore`
- Test: `tests/smoke/app-shell.test.tsx`

**Interfaces:**
- Produces a runnable Next.js app with `dev`, `build`, `lint`, `test`, `test:e2e`, and `db:*` script placeholders.
- Exposes the `@/*` import alias and a test environment that can render React components.

- [ ] **Step 1: Write the failing app shell test**

  Assert that rendering the root page exposes the product name, the primary `MỞ HÒM` action, and a visible category control region.

- [ ] **Step 2: Run the shell test and verify it fails**

  Run: `npm test -- --run tests/smoke/app-shell.test.tsx`

  Expected: FAIL because the Next.js app and root page do not exist.

- [ ] **Step 3: Scaffold the app and implement the minimal shell**

  Create the Next.js App Router project without a `src` directory, configure TypeScript, Tailwind v4 through `@tailwindcss/postcss`, Vitest with jsdom, and the root layout/page. Keep the first shell semantic and unstyled enough for later visual work.

- [ ] **Step 4: Run the shell test and build checks**

  Run: `npm test -- --run tests/smoke/app-shell.test.tsx`

  Expected: PASS.

  Run: `npm run build`

  Expected: Next.js production build succeeds without database access.

- [ ] **Step 5: Commit the scaffold**

  ```bash
  git add package.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs app tests vitest.config.ts .env.example .gitignore
  git commit -m "chore: scaffold next app and test foundation"
  ```

### Task 2: Add PostgreSQL schema, Prisma client, seed data, and dish validation

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `lib/db/prisma.ts`
- Create: `lib/dishes/types.ts`
- Create: `lib/dishes/validation.ts`
- Create: `lib/dishes/repository.ts`
- Create: `tests/unit/dishes/validation.test.ts`
- Create: `tests/unit/dishes/repository.test.ts`
- Modify: `package.json`
- Modify: `.env.example`

**Interfaces:**
- `DishCategory = 'RICE' | 'NOODLE' | 'SOUP' | 'SNACK' | 'DRINK' | 'OTHER'`.
- `DishInput = { name: string; slug: string; imageUrl: string; category: DishCategory; description?: string; spiceLevel: number; weight: number; isActive: boolean }`.
- `validateDishInput(input: unknown): DishInput` throws a structured validation error on invalid input.
- `listActiveDishes(categories: DishCategory[]): Promise<Dish[]>` returns only active dishes matching the requested categories.
- `listDishes(filters: DishListFilters): Promise<Dish[]>` powers the admin list.
- `createDish(input: DishInput): Promise<Dish>`.
- `updateDish(id: string, input: DishInput): Promise<Dish>`.
- `deleteDish(id: string): Promise<void>`.

- [ ] **Step 1: Write validation tests**

  Cover valid Vietnamese dish input, missing name, invalid image URL, unknown category, `spiceLevel` outside 0-3, and `weight` below 1.

- [ ] **Step 2: Run validation tests to verify failure**

  Run: `npm test -- --run tests/unit/dishes/validation.test.ts`

  Expected: FAIL because the validation module does not exist.

- [ ] **Step 3: Implement Prisma schema and validation**

  Add the `Dish` model with cuid ID, unique slug, timestamps, indexes on `category`, `isActive`, and `name`, then implement validation with Zod schemas exported from `lib/dishes/validation.ts`.

- [ ] **Step 4: Run validation tests to verify they pass**

  Run: `npm test -- --run tests/unit/dishes/validation.test.ts`

  Expected: PASS.

- [ ] **Step 5: Write repository contract tests**

  Mock the Prisma client and assert that active category filtering, admin filters, create, update, and delete use the expected fields and never expose inactive dishes through the active query.

- [ ] **Step 6: Implement Prisma client, repository, and seed**

  Use a singleton Prisma client for development reuse. Add `prisma/seed.ts` with at least 12 Vietnamese dishes across all categories and varied weights. Add `db:generate`, `db:migrate`, `db:seed`, and a Vercel-safe `postinstall` script.

- [ ] **Step 7: Run repository tests and Prisma validation**

  Run: `npm test -- --run tests/unit/dishes/repository.test.ts`

  Expected: PASS.

  Run: `npx prisma validate`

  Expected: schema is valid.

- [ ] **Step 8: Commit the data layer**

  ```bash
  git add prisma lib/db lib/dishes tests/unit/dishes package.json .env.example
  git commit -m "feat: add postgres dish data layer"
  ```

### Task 3: Implement weighted draw service and public draw endpoint

**Files:**
- Create: `lib/random/weighted-draw.ts`
- Create: `lib/random/weighted-draw.test.ts`
- Create: `app/api/draw/route.ts`
- Create: `app/api/draw/route.test.ts`
- Modify: `lib/dishes/repository.ts`

**Interfaces:**
- `selectWeightedDish(dishes: Pick<Dish, 'id' | 'weight'>[], random?: () => number): Pick<Dish, 'id'>` returns one item according to relative weights.
- `buildReelItems(dishes: Dish[], selectedId: string, length?: number): Dish[]` returns a deterministic-length reel with the selected dish at the pointer index.
- `POST /api/draw` accepts `{ categories?: DishCategory[] }` and returns `{ reelItems: Dish[]; selectedDish: Dish }`.
- The error response for no eligible dish is `{ code: 'EMPTY_DISH_POOL', message: string }` with HTTP 422.

- [ ] **Step 1: Write weighted draw tests**

  Cover one dish, two dishes with deterministic random values, unequal weights, invalid empty input, and selected dish placement in a reel.

- [ ] **Step 2: Run draw tests and verify failure**

  Run: `npm test -- --run lib/random/weighted-draw.test.ts`

  Expected: FAIL because the weighted draw module does not exist.

- [ ] **Step 3: Implement weighted selection and reel construction**

  Use cumulative weights and an injectable random function for deterministic tests. Keep the server-selected dish authoritative; the client only animates the returned reel.

- [ ] **Step 4: Run draw tests and verify they pass**

  Run: `npm test -- --run lib/random/weighted-draw.test.ts`

  Expected: PASS.

- [ ] **Step 5: Write endpoint tests**

  Mock the repository and assert category parsing, successful response shape, `EMPTY_DISH_POOL`, malformed JSON, and unsupported category handling.

- [ ] **Step 6: Implement `POST /api/draw`**

  Validate request categories, load active dishes, select the result server-side, and return a cache-disabled response suitable for a random operation.

- [ ] **Step 7: Run endpoint tests and commit**

  Run: `npm test -- --run app/api/draw/route.test.ts`

  Expected: PASS.

  ```bash
  git add lib/random app/api/draw
  git commit -m "feat: add weighted food draw endpoint"
  ```

### Task 4: Build the public case-opening experience

**Files:**
- Create: `components/case-opening/case-stage.tsx`
- Create: `components/case-opening/dish-reel.tsx`
- Create: `components/case-opening/dish-tile.tsx`
- Create: `components/case-opening/reveal-panel.tsx`
- Create: `components/case-opening/category-filter.tsx`
- Create: `components/ui/icon.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Test: `components/case-opening/case-stage.test.tsx`

**Interfaces:**
- `CaseStage` owns the draw lifecycle: `idle | drawing | revealed | error`.
- `DishReel` consumes `items: Dish[]`, `selectedId: string`, `isDrawing: boolean`, and `onComplete: () => void`.
- `CategoryFilter` consumes selected categories and emits `onChange(categories: DishCategory[])`.
- `RevealPanel` consumes `dish: Dish | null` and `onDrawAgain: () => void`.

- [ ] **Step 1: Write component behavior tests**

  Assert initial idle state, disabled draw while loading, category selection, empty-pool message, result reveal, draw-again reset, and reduced-motion completion without a long timeout.

- [ ] **Step 2: Run component tests and verify failure**

  Run: `npm test -- --run components/case-opening/case-stage.test.tsx`

  Expected: FAIL because the case-opening components do not exist.

- [ ] **Step 3: Implement the case-opening client island**

  Call `POST /api/draw`, render a 9 or 11 tile reel with a centered pointer, and animate only the reel state. Keep motion isolated in client components and implement a reduced-motion branch. Use accessible labels and keyboard-operable controls.

- [ ] **Step 4: Implement the visual system**

  Add dark indigo background, vát case frame, restrained violet-magenta glow, typography hierarchy, dish image treatment, focus styles, and responsive collapse below 768px. Use the reference as visual inspiration without copying its logo or copy.

- [ ] **Step 5: Run component tests and visual checks**

  Run: `npm test -- --run components/case-opening/case-stage.test.tsx`

  Expected: PASS.

  Run: `npm run lint && npm run build`

  Expected: PASS.

- [ ] **Step 6: Commit the public experience**

  ```bash
  git add app components
  git commit -m "feat: add food case opening experience"
  ```

### Task 5: Add admin authentication and protected admin shell

**Files:**
- Create: `lib/auth/admin-session.ts`
- Create: `lib/auth/admin-session.test.ts`
- Create: `middleware.ts`
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/login/login-form.tsx`
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`
- Create: `components/admin/admin-nav.tsx`
- Modify: `.env.example`

**Interfaces:**
- `createAdminSession(): Promise<void>` sets a signed, httpOnly, secure-in-production cookie.
- `hasAdminSession(): Promise<boolean>` validates the cookie server-side.
- `clearAdminSession(): Promise<void>` removes the cookie.
- `POST /admin/login` accepts `{ password: string }` and redirects on success or returns a form error on failure.

- [ ] **Step 1: Write auth tests**

  Cover correct password, incorrect password, missing environment variables, session expiry, and logout invalidation.

- [ ] **Step 2: Run auth tests and verify failure**

  Run: `npm test -- --run lib/auth/admin-session.test.ts`

  Expected: FAIL because the session module does not exist.

- [ ] **Step 3: Implement signed cookie session and route protection**

  Use Web Crypto-compatible signing or a small server-safe dependency. Keep `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` server-only. Middleware should redirect page requests and reject API requests without leaking admin data.

- [ ] **Step 4: Implement login and admin shell**

  Build a compact admin shell with navigation, sign-out, page title, and an empty dashboard state. Keep the admin visual language consistent with the public theme but prioritize clarity over spectacle.

- [ ] **Step 5: Run auth tests and commit**

  Run: `npm test -- --run lib/auth/admin-session.test.ts`

  Expected: PASS.

  ```bash
  git add lib/auth middleware.ts app/admin components/admin .env.example
  git commit -m "feat: add protected admin shell"
  ```

### Task 6: Build admin dish CRUD

**Files:**
- Create: `app/admin/dishes/page.tsx`
- Create: `app/admin/dishes/dish-table.tsx`
- Create: `app/admin/dishes/new/page.tsx`
- Create: `app/admin/dishes/[id]/edit/page.tsx`
- Create: `components/admin/dish-form.tsx`
- Create: `components/admin/delete-dish-button.tsx`
- Create: `app/api/admin/dishes/route.ts`
- Create: `app/api/admin/dishes/[id]/route.ts`
- Create: `app/api/admin/dishes/route.test.ts`
- Create: `app/api/admin/dishes/[id]/route.test.ts`

**Interfaces:**
- `GET /api/admin/dishes?query=&category=&isActive=` returns `{ dishes: Dish[] }`.
- `POST /api/admin/dishes` accepts `DishInput` and returns `{ dish: Dish }` with HTTP 201.
- `PATCH /api/admin/dishes/[id]` accepts a partial or complete `DishInput` and returns `{ dish: Dish }`.
- `DELETE /api/admin/dishes/[id]` returns HTTP 204 on success.

- [ ] **Step 1: Write CRUD route tests**

  Cover session rejection with 401, create with valid input, validation rejection with 400, list filtering, update, delete, and not-found behavior.

- [ ] **Step 2: Run CRUD tests and verify failure**

  Run: `npm test -- --run app/api/admin/dishes/route.test.ts app/api/admin/dishes/[id]/route.test.ts`

  Expected: FAIL because the admin route handlers do not exist.

- [ ] **Step 3: Implement protected route handlers**

  Check `hasAdminSession()` before repository access, validate every payload, return stable JSON errors, and prevent invalid or inactive data from entering the random pool through repository invariants.

- [ ] **Step 4: Implement list, filter, create, edit, toggle, and delete UI**

  Build accessible form fields for name, slug, image URL, category, description, spice level, weight, and active state. Use a confirmation dialog for deletion and keep toggle separate from destructive delete.

- [ ] **Step 5: Run CRUD tests and build**

  Run: `npm test -- --run app/api/admin/dishes/route.test.ts app/api/admin/dishes/[id]/route.test.ts`

  Expected: PASS.

  Run: `npm run build`

  Expected: PASS.

- [ ] **Step 6: Commit admin CRUD**

  ```bash
  git add app/admin app/api/admin components/admin
  git commit -m "feat: add admin dish management"
  ```

### Task 7: Add seed workflow, E2E coverage, and deployment documentation

**Files:**
- Create: `tests/e2e/public-draw.spec.ts`
- Create: `tests/e2e/admin-dishes.spec.ts`
- Create: `playwright.config.ts`
- Create: `README.md`
- Create: `docs/deployment/vercel.md`
- Modify: `package.json`
- Modify: `.env.example`

**Interfaces:**
- `npm run db:seed` seeds local/test data explicitly.
- `npm run test:e2e` starts the app against a configured test database and runs public/admin smoke flows.
- Deployment docs describe Vercel project linking, Marketplace database connection, environment variables, migration, and optional seed.

- [ ] **Step 1: Write public and admin E2E tests**

  Public test selects a category, opens the case, and verifies a dish reveal. Admin test logs in, creates a dish, finds it in the table, toggles it inactive, edits it, and deletes it.

- [ ] **Step 2: Run E2E tests against the current app**

  Run: `npm run test:e2e`

  Expected: failures identify any missing wiring before final polish.

- [ ] **Step 3: Wire seed/test database setup and fix the flows**

  Keep production seed opt-in. Use stable test dish fixtures and reset only the test database between runs.

- [ ] **Step 4: Add Vercel deployment documentation**

  Document `DATABASE_URL`, optional `DIRECT_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `prisma generate`, migration execution, Vercel Preview/Production variables, and the fact that runtime uploads must not use local disk.

- [ ] **Step 5: Run the complete verification suite**

  Run: `npm run lint`

  Expected: PASS.

  Run: `npm test -- --run`

  Expected: PASS.

  Run: `npm run build`

  Expected: PASS.

  Run: `npm run test:e2e`

  Expected: PASS with the configured test database.

- [ ] **Step 6: Commit release readiness changes**

  ```bash
  git add README.md docs/deployment tests package.json .env.example playwright.config.ts
  git commit -m "docs: add vercel deployment and end to end checks"
  ```

## Execution Notes

- Implement tasks sequentially because the public UI, admin UI, and E2E tests depend on the exact data and auth interfaces established earlier.
- If a package is missing from the scaffold, add it in the task that first consumes it and update the lockfile.
- If Vercel Marketplace credentials are not available locally, use `.env.example` plus a test PostgreSQL connection for local verification and document the remaining environment setup; do not hardcode secrets.
