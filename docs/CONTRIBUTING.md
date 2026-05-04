# Contributing to Event Horizon

> Read this before opening a PR. The README is the spec; this document is the workflow.

## 1. Local setup

Requirements:

- Node `>=20.10` (we ship `.nvmrc` pinned to 22)
- `pnpm` `>=9` (`corepack enable && corepack prepare pnpm@10.33.0 --activate`)
- A modern browser with WebGL2 (Chrome / Firefox / Safari latest)

```sh
git clone <repo>
cd space
pnpm install
pnpm dev          # http://localhost:5173
pnpm typecheck    # strict TS
pnpm lint         # Biome
pnpm test         # Vitest unit
pnpm test:e2e     # Playwright (one-time: pnpm test:e2e:install)
pnpm build        # production bundle into dist/
pnpm size         # gate the bundle against §13 budgets
```

A clean clone should take **under 10 minutes** to reach a running dev server (DoD §17).

## 2. Branching

Per README §15.1:

- `main` — protected, always shippable.
- `develop` — integration; nightly auto-deploy to staging.
- `task/<n>-<slug>` — one branch per task in §16. Squash-merged into `develop` on completion.
- `fix/<slug>`, `art/<slug>` — small flights, allowed to skip the task numbering.

Never push directly to `main`. Never force-push `main` or `develop`.

## 3. Commits

[Conventional Commits](https://www.conventionalcommits.org/). Examples:

- `feat(disk): add Doppler beaming uniform`
- `fix(camera): clamp infall mode at r_s + ε`
- `chore(ci): bump playwright to 1.49`

Cadence: at least every 60 minutes of focused work. Never commit a broken build to a task
branch — use a `wip:` prefix and force-push the **task branch only** if you have to.

## 4. Pre-commit hook

Husky + lint-staged runs Biome on staged files. If a hook fails, **fix the underlying issue** —
do not pass `--no-verify`. The README §15.4 review gate explicitly forbids skipping checks.

## 5. Sign-offs

Every PR template (`.github/pull_request_template.md`) includes the four-hat checklist:

- **Aria** — web design / motion / a11y
- **Kael** — system / build / perf
- **Nova** — art / shaders / look
- **Vex**  — physics / scientific fidelity

Mark the hats that reviewed. A task is not "done" until all listed hats sign off
(see each task in README §16 for the required set), CI is green, and the deploy is verified.

## 6. CI gates

Pull requests must pass, in order:

1. **Lint** (`pnpm lint`)
2. **Typecheck** (`pnpm typecheck`)
3. **Unit tests** (`pnpm test`)
4. **Build** (`pnpm build`)
5. **Size budget** (`pnpm size`) — gzipped JS ≤ 220 KB, gzipped CSS ≤ 25 KB, idle assets ≤ 8 MB
6. **E2E** (`pnpm test:e2e`) — Chromium smoke

A red gate is a hard stop. Fix forward, don't disable.

## 7. Dual-remote backup ritual (README §15.3, §15.6)

Configure two remotes the first time you clone:

```sh
git remote add archive git@nas.local:event-horizon/space.git   # or your second provider
git remote -v
# origin   github.com:.../space.git (fetch)
# origin   github.com:.../space.git (push)
# archive  nas.local:.../space.git  (fetch)
# archive  nas.local:.../space.git  (push)
```

At the end of each task in README §16:

```sh
TASK=1; SLUG=foundations
# 1. annotated tag
git tag -a "v0.${TASK}-${SLUG}" -m "Task ${TASK} — ${SLUG}"

# 2. push to BOTH remotes
git push origin  "v0.${TASK}-${SLUG}"
git push archive "v0.${TASK}-${SLUG}"
git push origin  HEAD
git push archive HEAD

# 3. snapshot bundle (cold-storage shipping)
mkdir -p backups
git bundle create "backups/v0.${TASK}.bundle" --all

# 4. verify (per §15.6)
git fsck --full
git bundle verify "backups/v0.${TASK}.bundle"
shasum -a 256 "backups/v0.${TASK}.bundle" >> backups/CHECKSUMS.txt
git add backups/CHECKSUMS.txt
git commit -m "chore(backup): record sha256 for v0.${TASK}"

# 5. ship the bundle to cold storage (S3 Glacier / Backblaze / NAS)
# (out-of-band; keep one copy off-site)
```

The `backups/*.bundle` files are gitignored on purpose — only the checksum
manifest belongs in the repo. The bundles themselves live in two cold
locations (your archive remote + cold-storage upload), per §15.3.

To verify a bundle restores cleanly:

```sh
git clone backups/v0.1.bundle restore-test
cd restore-test && git log --oneline | head
```

If the restore succeeds, you may delete the `restore-test/` directory and tag the
next task. If it fails, **do not** tag — debug first.

## 8. Code style

- **TypeScript strict** is enabled. New code passes `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and `verbatimModuleSyntax`.
- **No comments** explaining what code does — name things well. Comments are for *why*: an invariant, a workaround, a non-obvious physical interpretation.
- **No new files** unless they earn their place. Prefer extending an existing module.
- **Imports** use the `@/`, `@canvas/`, `@physics/` … aliases declared in `tsconfig.app.json` and `vite.config.ts`. Never import across hat boundaries (UI must not import from `canvas/core`, etc.).

## 9. Filing an issue

Use the templates in `.github/ISSUE_TEMPLATE/` (added in T12). Until then:

- Title: `[T<task#>] <one-sentence symptom>`
- Body: repro steps · expected · actual · GPU/UA/quality tier · screenshot if visual.

## 10. Asking questions

Open a discussion, tag the relevant hat, and reference the README section that motivates the
question. The README is the spec; if the spec is wrong, amend the README in the same PR.

— Truth, awe, agency, in that order when they conflict.
