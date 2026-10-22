# Repo vision audit: are the GitHub repos current and consistent with the new vision?

Audited 2026-10-22 on dockerserver. READ-ONLY: nothing was edited, pushed or opened in any repo. Method: `git fetch`, then `git show` / `git grep` on the refs named below. Authority used: `module-docs/dev-team-prd.html` (Executive summary, How it fits GraphX, NFRs), `OWNER-IDEAS.md` PD-1..170 (esp. PD-100, 101, 118, 131..170), `STUDIO-PLAN.md`, `WORKING-AGREEMENT.md`. Line numbers are on the named ref. A "conflict" means the text or code disagrees with the decision cited; severity is my judgement.

Refs audited:

| Repo | Refs and head (date) |
|---|---|
| graphx-studio | `origin/crd/studio-native-v1` e45d72ba (2026-10-21); `origin/main` e3147154 (2026-07-27) |
| graphx-prepress | `origin/main` 931a607 (2026-10-21, one-line README); `origin/crd/prepress-integration` = same commit; six open draft PRs #1..#6, newest `crd/prepress-renames-20261022` deb88fb (#3) and `crd/prepress-artifact-contract-20261022` b3a0dd4 (#6) |
| graphx-platform OneVision | worktree `onevision-rust-foundation-20261018` b28eb619 (2026-10-21); PR #428 (draft, open) |
| graphx-production-core | `origin/main` 4801700 (2026-10-22, 2 files); PR #1 `crd/core-scaffold` 4821124; PR #2 `crd/module-contract-20261022` e05e0b2 |
| graphx-visualizer | `origin/main` 335b694 (2026-10-17); `origin/crd/vz-landing` edbf32a (2026-10-21) |
| graphx-docs | `origin/main` 47b8925 (2026-10-14) |

Fix owners: **C** = Claude (Studio, visualizer), **X** = Codex (Prepress), **J** = joint (production-core), **O** = owner / graphx-docs (decision docs need the owner).

---

## Headline findings

1. **No repo points at the new vision.** Zero references to `dev-team-prd`, `WORKING-AGREEMENT`, `STUDIO-PLAN` or the tracker links in any repo's markdown. Only Studio (3 files: OWNER-IDEAS) and production-core (1 file) mention the decision register; Studio, production-core, visualizer and graphx-docs mention `ONE-APP`. Prepress #1 carries tracker links in 2 files.
2. **graphx-studio's front door is the wrong product.** The default branch `main` (2026-07-27) is 1,721 commits behind the integration branch and has 24 commits that are not in it. Even on the integration branch, README, AGENTS.md and CLAUDE.md still describe the Python "PDF Block Builder" (June to September 2026). A reader of GitHub sees no native Studio.
3. **graphx-prepress `main` is a stub.** All content lives in six open draft PRs, and they are not one stack: #6 (artifact-contract) is based on #2 (runtime), not on #1 (extract). README.md, AGENTS.md and RESTART.md exist in three incompatible versions and will collide on merge.
4. **OneVision names remain in shipped Prepress code** (UI label "Inspect OneVision XML", 63 files named `Ov*`/`ov-*`, `ov.*` module keys in `module-plan.json`) against PD-153.
5. **graphx-docs (source of truth #2) stops at 2026-10-15.** ADR-0001 (`owner-decisions/2026-10-15-one-app-architecture.md`) puts SQLite as authoritative desktop storage (line 57), caps the browser (line 419) and gives Claude/Codex single-owner scopes that are now the other way round (lines 340-341). None of PD-37..170 is mirrored. PR #48 (OneVision foundation) is open.
6. **Good news:** graphx-production-core already encodes PD-152/153/166 (Postgres only, GraphX names only, joint crates, no GPL). The visualizer `crd/vz-landing` branch has already removed OneVision names (PR #102). Prepress has no SQLite and its journal is PostgreSQL (PD-152 met). Studio's `docs/architecture/*` (2026-10-21) is current and accurate.

---

## 1. GraphX Studio (`GraphXCPI/graphx-studio`)

### Currency

| Item | State |
|---|---|
| Last commits | integration `crd/studio-native-v1` 2026-10-21 (PR #269); `main` 2026-07-27 |
| Branch gap | native is 1,721 ahead, 24 behind `main`. GitHub default branch is `main`. Open PR #1 "integration checkpoint" is from 2026-07-12 (STUDIO-PLAN already asks to close it). |
| Current and good | `docs/architecture/{README,OVERVIEW,CONCEPTS,ACTION-FLOW,GLOSSARY,MODULE-MAP,REORG-PLAN}.md` (2026-10-21, source `baaf9f4c`); `LANES.toml` (2026-10-21); `docs/studio-v1/DECISION-LEDGER.md` (2026-10-19); `docs/STUDIO-V1-PCC-CH-DESKTOP-LIMITS.md` (PD-101 built) |
| Stale | `README.md` (2026-09-07), `AGENTS.md` (2026-09-08), `CLAUDE.md` (2026-07-26), `STUDIO-HANDOFF.md` (2026-06-22), `STUDIO-BUILD-SEQUENCE.md`, `M1-*`, `M2-*` (June), `docs/product/*` (2026-07-27), `docs/studio-cutover-runbook.md` |
| Restart note | `RESTART.md` is on `main` (2026-07-12) but deleted on the integration branch. No root restart record on the branch people work on; real restart notes sit in `coordination/` and `/home/chris/graphx-build/*` (outside the repo). |

### Conflicts with the vision

| # | file:line | Quote | Conflicts with | Sev | Fix | Owner |
|---|---|---|---|---|---|---|
| S1 | `README.md:1` (whole file) | "# PDF Block Generator" | PD-137 (one product, "PDF Block Builder" becomes "Templates & VDP"), PD-100/118 (native Studio is the product) | High | Update: new README = GraphX Studio entry (modes, native app, links). Move current text to `docs/templates-vdp/README.md`, renamed "Templates & VDP". | C |
| S2 | `AGENTS.md:1`, `AGENTS.md:3` | "# PDF Block Builder Agent Notes" / "builds the GraphX/OPS PDF Block Builder: a FastAPI web app" | PD-137; and it is the agent contract for the repo, so every agent reads the wrong product | High | Update: Studio-first AGENTS.md (CodeGraph protocol, LANES.toml, shared-crate rule); keep the Python notes as a legacy section named Templates & VDP. `CLAUDE.md:1` is a pointer, fix with it. | C |
| S3 | `main` branch (`e3147154`) and PR #1 | default branch is the July Python repo | Currency; PD-100 "keep a deployed testable build" | High | Owner decision: promote integration to default (or merge). First preserve the 24 `main`-only commits (`git rev-list origin/crd/studio-native-v1..origin/main`). Close PR #1 (already in STUDIO-PLAN "Awaiting owner"). | O + C |
| S4 | `docs/STUDIO-PARALLEL-EXECUTION-20261014.md:20` | "Claude owns the approved Rust production-engine port and production pipeline ... Codex owns native app-specific tools/UI/canvas" | PD-166 (no single owner; Claude=Studio, Codex=Prepress; every crate joint), PD-155 (engine lives in graphx-production-core) | High | Mark superseded (banner + link to production-core README). Same wording in `docs/STUDIO-CRAFT-REALIGNMENT-PLAN-20261014.md:157` and `docs/STUDIO-ONE-APP-CONTRACT-ALIGNMENT-20261014.md:69`, `docs/STUDIO-CRAFT-EXTENSION-API-DRAFT-20261014.md:53`. | C |
| S5 | `docs/STUDIO-UNIFICATION-HANDOFF.md:6` (also REALIGNMENT-PLAN:6, EXTENSION-API-DRAFT:6, ONE-APP-CONTRACT-ALIGNMENT:6) | "new Rust-defined job format owned by the production-engine lane" | PD-166 / PD-145 (job ticket and module API are shared crates, joint) | Med | Mark superseded; point to `graphx-module-manifest` and PrepressPort docs once posted. | C |
| S6 | `docs/STUDIO-OWNER-DESIGN-ALIGNMENT-20261016.md:18` | "two-way sync while Studio and OneVision each run independently ... OneVision/OVServer remain read-only" | PD-144 (interim: Studio hands jobs to OneVision lines), PD-145 (full embedding, Action palette), PD-149 (parity runs on production allowed), PD-153 | Med | Update the row: independent-sync model replaced by the PD-144/145/151 plan; drop OneVision wording from product docs. | C |
| S7 | `docs/STUDIO-V1-IN1-LIMITS.md:36` | "`IN_MEMORY_DECODE_MAX_PIXELS = 4_000_000` is the engine budget" | PD-101 (no 4,000,000 px cap on desktop), PD-156 (browser streams via server) | Med | Verify the constant is not applied on the desktop profile; if it is, fix code; either way add a "superseded by PD-101/156, removed with IN2" note. Same figure in `docs/STUDIO-CRAFT-NATIVE-LOCAL-PHOTO-PROOF-20261015.md:9` (labelled development limits; add the PD pointer). | C |
| S8 | `docs/STUDIO-V1-PC2-HOSTILE-HARDENING.md:117` | "`max_open_bytes` 256 MiB / 4 GiB" (browser/desktop) | PD-156 (no browser size refusal once streaming lands), PD-157 | Low | Add a note that browser limits are interim until the streaming pipeline (NFR-02). Desktop row is already handled by PCC-CH. | C |
| S9 | `docs/product/VISION.md:1` ("from VDP tool to full design studio"), `docs/product/PRD-A..D`, `TECH-A..D`, `ROADMAP.md`, `DEV-PLAN.md`, `FLOW4-BATCH-COMPOSER.md` | React/Python web studio plan, Track B "The Proofing Engine" as a separate product | STUDIO-PLAN FOCUS, PD-100, PD-133 (proofing moves into Studio), PD-137 | Med | Mark superseded by STUDIO-PLAN and the dev-team PRD (banner), or move to `docs/archive/`. | C |
| S10 | `AGENTS.md:499`, `README.md:72`, `src/pdf_block_generator/accounts.py:10` | "transaction-consistent SQLite" / `import sqlite3` | PD-152 (Postgres only, no SQLite; PD-152 names Prepress, PD-147 says local shadow DBs use the same schema) | Med | Ask the owner whether PD-152 covers the legacy Templates & VDP backend. If yes: add to the migration plan and mark "legacy, to be replaced". If no: record the exception. No code change before that. | O then C |
| S11 | `.github/workflows/ci.yml:1` (also `governance-docs-validation.yml` on `main`) | "name: CI" (`push: branches: ["**"]`) | Owner rule: never use GitHub Actions | Med | Owner decision: disable or remove (not edited here, because editing Actions is itself covered by the rule). | O |
| S12 | `docs/ops-template-publish-automation.md:1`, `AGENTS.md:125`, `docs/agent-api.md:3` | "Agent & n8n Workflow Design" | PD-145 (automations are Prepress lines and recorded Studio flows) | Low | Label n8n use "transitional" (graphx-docs TECH-STACK-REGISTER:83 already does). | C |
| S13 | `deep-interview-pbb-usability-m1-20260619-220107.md:49` | "`VisualGraphxLLC/GraphX-Manage` ... prepress-automation module (React Flow) replacing OneVision" | AGENTS.md git boundaries (old org), PD-143/151 | Low | Move to `docs/archive/` with a "historical" banner (old org name is allowed only as labelled provenance). | C |
| S14 | `docs/architecture/OVERVIEW.md` (modes table), `docs/adr/ADR-PDF-NATIVE-PROJECT.md` | PD-63 labels (Design, Image, Develop, Vector, PDF Press); no mention of graphx-production-core (0 references repo-wide) | PD-137 modes (Design, Edit PDF, Templates & VDP, Production), PD-154/155 (one PDF engine in production-core) | Low | Update after the owner answers how PD-137 modes map to PD-63 phases (PRD "Open"); add a "moves to graphx-production-core in the freeze window" note beside the PDF crates in MODULE-MAP. | C |

Checked and fine: no OneVision text in Studio code; Ghostscript appears only as the PD-48 isolated tool (`docs/adr/ADR-PDF-NATIVE-PROJECT.md:1087,1114`: "not used for flattening", consistent); no "rebuild Craft" language (the realignment plan says reuse); desktop-limits work already implements PD-101.

### Missing

- A `docs/README.md` index pointing to the dev-team PRD (Drive doc 00), STUDIO-PLAN, WORKING-AGREEMENT, OWNER-IDEAS register and the tracker (`TRACKER-LINKS.md`). Zero such links today.
- A root `RESTART.md` on the integration branch (AGENTS.md workspace contract requires one).
- A pointer to `graphx-production-core` and the PD-155 freeze-window move plan.

---

## 2. GraphX Prepress (`GraphXCPI/graphx-prepress`) and the OneVision docs

### Currency

| Item | State |
|---|---|
| Main | `origin/main` = one commit (2026-10-21), README is 2 lines. `prepress-integration` is the same commit. |
| Real content | Open draft PRs: #1 extract (653 files, 2026-10-21), #2 runtime journal, #3 renames (deb88fb, 665 files, 2026-10-22), #4 journal proof, #5 doc monitor, #6 artifact contract. #3 is stacked on #1; #6 is stacked on #2 only. |
| README / RESTART | #3 README and RESTART are current to 2026-10-22 and honest about state. #6 README says "repository bootstrap ... dormant PostgreSQL journal" (a different README). The three versions will conflict. |
| Platform OneVision docs | `graphx-platform` worktree and PR #428 (draft, still OPEN, updated 2026-10-22): body says "module-first delivery plan ... Implementation is paused for plan review"; `docs/onevision/README.md` status "ACTIVE". Not marked frozen anywhere. |
| Linked from vision docs | No link to graphx-production-core, Studio, PD-151/164/166 in any Prepress file (0 references). |

### Conflicts with the vision

| # | file:line (ref `prepress-renames-20261022` unless noted) | Quote | Conflicts with | Sev | Fix | Owner |
|---|---|---|---|---|---|---|
| P1 | `apps/web/app/automate/flows/assembly-editor/AssemblyLineEditor.tsx:988`, `NativeInspectionView.tsx:28` | "Inspect OneVision XML" (visible button label) | PD-153 (no OneVision names user-visible or in shipped code) | High | Update: GraphX wording ("Inspect legacy line file"), or hide behind an internal-only flag. | X |
| P2 | 63 files named `Ov*.tsx` / `ov-*.ts` under `apps/web/app/automate/flows/` (e.g. `OvAppendBlankPagesSettings.tsx`) and `Ov*` identifiers (135 hits in `apps`) | `export function OvAppendBlankPagesSettings` | PD-153 ("immediately rename") | High | Update: rename in a mechanical PR in a freeze window (PR #3 already renamed catalog IDs; this is the remaining code layer). | X |
| P3 | `docs/onevision/module-plan.json:14` (87 keys) | `"module_key": "ov.data-sources.source-folder"` | PD-153 (module keys), step-2 review B1 (GraphX-owned module IDs) | High | Update: GraphX keys; keep an `ov.*` crosswalk only in the internal, non-shipped mapping data. | X |
| P4 | `docs/onevision/README.md:2,4` | "# OneVision module-first build plan" / "Status: ACTIVE" | PD-148 (re-plan by real usage), PD-151, PD-164 (PP-00..), PD-153 | High | Mark superseded by the usage re-plan (`production-inventory/prepress-usage-replan.md`) or rewrite. Whole `docs/onevision/` tree (95 module docs, 1,347 mentions, group "ASURA") should be moved under an internal provenance path and renamed. | X |
| P5 | `docs/onevision/README.md:17-20` | "Focus: Work on one module at a time." / "Scope: 87 main-palette modules" / "Module complete: Every native setting and mode" | PD-148 (top ~20 module types first, never-used to backlog), PD-166, PD-151 (capabilities land in shared crates) | Med | Update to the re-plan: usage-ordered, shared crate first, shadow-run before switching (PD-143). | X |
| P6 | `docs/onevision/README.md:19`, `packages/automation/rust/CONTRACT.md:4`, `PLAN.md:72` | "Future n8n/JSON redesigns are excluded" / "does not adopt n8n semantics" | PD-145 (designers record flows and save them as Prepress automations; an automation format is needed) | Low | Reword: GraphX automation format, no n8n. | X |
| P7 | `apps/web/app/automate/flows/local-workflow/model.ts:50`, `AssemblyLineEditor.tsx:878`, `packages/automation/rust/src/lib.rs:51-53` | `MAX_PDF_BYTES = 5 * 1024 * 1024` / "Choose a nonempty PDF up to 5 MiB." | PD-156 (no size refusal in the browser for Studio or Prepress), PD-157 | Med | Document as preview-only sandbox; plan the resumable-upload and server path (PD-156). Do not ship as the product limit. | X |
| P8 | `packages/automation/rust/src/native_device_log/serializer.rs:8`, `apps/web/.../printmark/xml.ts:5` | `"http://www.onevision.com/2013/Workspace2series/deviceLogVer2"` | PD-153 | Med | Keep only inside an internal-only adapter if byte-compatibility is required, and say so in the file header; otherwise rename. Also `CHECKS.md` files with the old branch name `crd/onevision-rust-foundation-20261018`. | X |
| P9 | `docs/planning/estimates-method.md:3,7` | "provisional human engineering-hour range" / "A person-hour means ..." | Owner rule: estimate at measured agent speed (PD-148 re-estimate; PD-164 item 4) | Low | Update after PP-01/02 measurements. | X |
| P10 | Branch stack: `#6 crd/prepress-artifact-contract-20261022:README.md,AGENTS.md,RESTART.md` vs `#3` | three different root docs | Currency / merge safety | Med | Rebase #6 (and #2/#4/#5) onto the merged #1/#3, or merge in a defined order; one RESTART with PD-151/164/166 context. | X |
| P11 | graphx-platform PR #428 and `worktrees/graphx-platform/onevision-rust-foundation-20261018/docs/onevision/README.md:1-4` | "Build OneVision baseline editor and Rust workflow foundations ... Implementation is paused" | PD-37 moved to graphx-prepress; PD-148/151 supersede the module-first plan | Med | Add a FROZEN / superseded-by-graphx-prepress#1 notice to the PR body and README. Do not edit code. | X (with owner OK) |

Checked and fine: no SQLite anywhere (PD-152); PostgreSQL journal in PR #2/#4/#6 is dormant and gated (PD-164, PD-167/168); no Ghostscript or GPL; no old-org references; no `.github/workflows`.

### Missing

- README pointing to the dev-team PRD, WORKING-AGREEMENT, OWNER-IDEAS, the tracker (PR #1 has Drive tracker links in `docs/project-links.json` but not in the README), and the Studio side.
- A section on the shared-crate plan: which Prepress code moves to `graphx-production-core`, which PDF/colour/nest engines retire (PD-143, 154, 161..163), and the module manifest (PD-165).
- A single merged RESTART with next safe action.

---

## 3. GraphX production-core (`GraphXCPI/graphx-production-core`)

### Currency

`main` is a 2-file stub (README says the "layout, owners and status are added by the scaffold PR"). PR #1 (scaffold, 2026-10-22) and PR #2 (module contract, 2026-10-22) are open and current. README crate table lists every crate as Joint (PD-166). RESTART (2026-10-22) is accurate about what exists and what does not.

### Conflicts with the vision

| # | file:line | Quote | Conflicts with | Sev | Fix | Owner |
|---|---|---|---|---|---|---|
| C1 | `RESTART.md:5` (PR #2) | "Codex owns this bounded contract contribution" | PD-166 (no single owner; every crate joint). PD-165 allows Codex to draft the manifest, so this is wording only | Low | Reword: "drafted by Codex (PD-165), reviewed by Claude". | J |
| C2 | `AGENTS.md:9` vs `AGENTS.md:11` and `README.md:9` | rule 1 "No legacy-system names ... in ... docs" while rule 3 says "OneVision extraction" | PD-153 | Low | Say "legacy-system extraction" in both files. | J |
| C3 | `main` README | "layout, owners and status are added by the scaffold PR" | Currency | Low | Merge PR #1 first (PD-145 order), then PR #2. | J |

Checked and fine: `AGENTS.md:13` Postgres only; `:14` no GPL/AGPL, MPL only for krilla/resvg; `:15` no GitHub Actions; no SQLite/Ghostscript/n8n; no workflows.

### Missing

README links to the dev-team PRD, WORKING-AGREEMENT and tracker (it already links OWNER-IDEAS in `docs/architecture/README.md:10` and ONE-APP). An explicit list of which Studio crates (`graphx-limits`, PDF crates) and which Prepress crates move in, with the freeze-window date.

---

## 4. GraphX visualizer (`GraphXCPI/graphx-visualizer`)

### Currency

`main` 2026-10-17; `crd/vz-landing` is 43 commits ahead (2026-10-21; includes the OneVision rename PR #102, Postgres catalogue, demo container). Open PRs: #79, #89, #90, #99, #100 (the production studios; owner decision pending per STUDIO-PLAN). `README.md` and `RESTART.md` were last touched 2026-10-14/16 and match neither branch.

### Conflicts with the vision

| # | file:line (ref `crd/vz-landing`) | Quote | Conflicts with | Sev | Fix | Owner |
|---|---|---|---|---|---|---|
| V1 | `README.md:5,14` | "**display-first** ... standalone visualizer app approved by the owner 2026-10-13" | PD-135 (demo = Studio prototyping system), PD-70/74 (production studios fold into Studio as product modes) | High | Update: state it is the prototyping system for Studio production modes, with the promotion path demo to dev to prod. | C |
| V2 | `README.md:17,85` | "Runtime: none yet. No deployment exists" / "Not deployed anywhere" | `demo.visualgraphx.com` exists (PD-135); `crd/demo-container` | High | Update to the real demo deployment and its Access boundary. | C |
| V3 | `README.md:72,82` | "pure TypeScript geometry ... the single source of truth" / "No backend, database, storage, or auth yet" | Rust engine `crates/graphx-engine*` and `db/postgres/` exist on this branch; PD-143 (one shared nest crate) | Med | Update layout section; say which engine is canonical during the port. | C |
| V4 | `RESTART.md:3,11` | "Verified: 2026-10-14 ... PRs #1-#71 merged" | Currency (43 commits and 30 PRs later) | Med | Rewrite the restart record (state, open PRs #89/#90, next safe action). | C |
| V5 | `crates/graphx-colour/README.md:3` | "The owner approved a colour engine of our own ... written in Rust only" | PD-161/163 (one shared colour engine in graphx-production-core) | Med | Add "to be folded into graphx-color" pointer; no code move before the freeze window. | C then J |
| V6 | `docs/CONTRACTS.md:3747`, `docs/PLAN.md:50` | "No backend: the PDF is written in the browser" / "browser-side PDF / SVG parsers (pure TS)" | PD-154 (one shared PDF engine) | Low | Note as prototype engine; retire when production-core PDF crate lands. | C |
| V7 | `docs/vehicle-wrap-demo.md:5,131` | "the dev SQLite store and the demo state store migrate to the Postgres catalogue later" | PD-152 spirit | Low | Already labelled demo-grade; add a date to move it to Postgres. | C |
| V8 | `README.md` (whole) | no mention of Studio at all | PD-135 | Med | Covered by V1; add link block (see Missing). | C |

Checked and fine: no OneVision names on `vz-landing` (rename PR #102 merged); `AGENTS.md:182` Ghostscript isolated-tool exception matches PD-48; `AGENTS.md:89` old org kept only as "never restore"; `README.md:66` no GitHub Actions; no workflows. On `main` the OneVision rename is still missing.

### Missing

Landing branch not merged to `main`. No link to the dev-team PRD, WORKING-AGREEMENT, STUDIO-PLAN, tracker, or to the production-studio fold-in plan (doc 11).

---

## 5. GraphX docs (`GraphXCPI/graphx-docs`), source of truth #2

### Currency

`origin/main` 2026-10-14 (merge of PR #47). `DECISIONS-LOG.md` last entry 2026-10-15 (line 1275, D5/D9..D18). `README.md` and `RESTART.md` last touched 2026-08-02 / 2026-08-01; `atomic-specs/studio.md` and `atomic-specs/prepress.md` 2026-08-01; `TECH-STACK-REGISTER.md` 2026-08-01; `SYSTEM-MAP.md` 2026-08-03. Open PRs: #48 (OneVision baseline and isolated Rust foundation, 2026-10-19), #45 (studio feature scope, 2026-10-08), #43, #42, #40. None of PD-37..PD-170 is recorded in this repo.

### Conflicts with the vision

| # | file:line | Quote | Conflicts with | Sev | Fix | Owner |
|---|---|---|---|---|---|---|
| D1 | `owner-decisions/2026-10-15-one-app-architecture.md:57` (ADR-0001) | "Storage \| SQLite + a content-addressed store (authoritative)" and `:218` "local SQLite or Platform DesignStore" | PD-152 (Postgres only), PD-147 (local shadow DB, same schema, synced), PD-77 (the saved file is a PDF with Studio data embedded) | High | Add a "Superseded in part" note and amend §2/§5: local store = Postgres shadow DB per PD-147/152; project file = PDF-native per PD-77. Needs the owner, rank-0 text. | O |
| D2 | same ADR `:340-341` (§8 ownership table) | "Claude \| The engine ... Codex \| Craft forks and extensions; canvas and camera" | PD-166 (Claude=Studio, Codex=Prepress, every shared crate joint), PD-155 (engine in graphx-production-core) | High | Replace the table with the PD-166 model. | O |
| D3 | same ADR `:419` | "Size limits (2026-10-14): desktop has no size limit; browser capped." | PD-156 (browser streams via server, no cap/refusal; supersedes PD-95's wall) | High | Amend: browser = small files local, large ones resumable-upload and server-processed. | O |
| D4 | same ADR `:30` ("visualizer engine is the canonical nesting and paneling engine"), `:111` | D15 "freeze Studio's visualizer copy" | PD-143 (one shared nest crate, shadow-proven vs OneVision; other nest engines retire) | Med | Amend: the visualizer nest is the source for the shared crate, not a separate canonical engine. | O |
| D5 | same ADR `:55,330,417` and `DECISIONS-LOG.md:1259,1262` (D8) | "bundle Ghostscript in the installer (isolated separate program ...)" | Consistent with PD-48 (isolated, own AGPL fork). Studio's PDF-native ADR says "No Ghostscript flattening" | Low | No conflict; add a one-line cross-reference so the two docs are read together. | O |
| D6 | `atomic-specs/studio.md:58` | "Studio is a service code repo (graphx-studio, Python+React)" | PD-100/137 (native Rust/egui Studio with modes; Python app is now "Templates & VDP") | High | Update: rewrite the repo/runtime section; keep the tier names (`studio-light`, `studio-pro`) only if still wanted. | O |
| D7 | `atomic-specs/prepress.md:315,458,467`, `:308` | "Absorption path: parse OneVision lines -> automation_recipe" / "Re-home the proofing lifecycle" / "Full proofing studio" | PD-37/131/143/145/151 (Prepress is the OneVision replacement built on shared crates), PD-133 (proofing moves into Studio) | High | Update: Prepress spec to the PD-148 usage re-plan, shared crates and Action palette; proofing section to PD-133. | O |
| D8 | `SYSTEM-MAP.md:80,226,241,258` | "OneVision legacy recipe runtime" ... repos `graphx-prepress-onevision-reference` | PD-153 (docs ok as internal; product names are not), PD-155 (no mention of graphx-prepress/production-core as repos) | Med | Refresh the map: add graphx-prepress, graphx-production-core, graphx-visualizer role (PD-135). | O |
| D9 | `owner-decisions/*` and `DECISIONS-LOG.md` | no entries after 2026-10-15 | PD-37, 100, 101, 118, 131..170 are rank-0 owner decisions that live only in `coordination/OWNER-IDEAS.md` | High | Mirror through a reviewed PR (WORKING-AGREEMENT: "decisions are mirrored into graphx-docs"); resolve PR #48 against PD-148/151/153. | O |
| D10 | `NAMING-REGISTRY.md:23,49` | "GraphX Studio: The designer studio / VDP / proofing engine" | PD-137 (one product with four modes), PD-133 | Med | Update the Studio row with the four modes and "Templates & VDP". | O |
| D11 | `.github/workflows/docs-validation.yml:1` | "name: Docs integration validation" | Owner rule: never use GitHub Actions | Low | Owner decision (as S11). | O |

### Missing

Pointer from `README.md` section 1 "Start here" to the dev-team PRD (Drive doc 00), STUDIO-PLAN, WORKING-AGREEMENT, OWNER-IDEAS and the tracker. No ADR for graphx-production-core (PD-145/155) or Prepress replan (PD-148/151/164).

---

## Prioritized fix list

### P0: do first (low effort, removes the most confusion)

1. **Studio front door (C):** rewrite `README.md`, `AGENTS.md`, `CLAUDE.md` on the integration branch as Studio-first (S1, S2); add `docs/README.md` index and root `RESTART.md` (Missing). One small docs PR, no code.
2. **Studio default branch (O + C):** owner decides to make `crd/studio-native-v1` the default or merge it; preserve the 24 `main`-only commits first; close PR #1 (S3).
3. **graphx-docs ADR-0001 amendments (O):** D1, D2, D3 (SQLite authority, ownership table, browser cap), then mirror PD-37..170 (D9). These are rank-0 texts, so they need the owner's go-ahead and a reviewed PR.
4. **Prepress PD-153 sweep (X):** P1 (visible label), P3 (module keys), then P2 (file/identifier renames) in a freeze window; mark `docs/onevision/README.md` superseded (P4, P5).
5. **Prepress branch order (X):** fix the PR stack so README/AGENTS/RESTART do not collide (P10); write one RESTART with the shared-crate plan.

### P1: this week

6. **Visualizer (C):** V1, V2, V4 (README and RESTART match the demo/prototyping role); merge `crd/vz-landing` to `main` after the owner confirms PRs #89/#90 (STUDIO-PLAN Awaiting owner).
7. **Studio superseded banners (C):** S4, S5, S6, S9, S13 (single-owner, OneVision-independence and July product docs). Banner only, no content deletion.
8. **graphx-docs specs (O):** D6, D7, D8, D10, resolve PR #48.
9. **PR #428 freeze notice (X, owner OK):** P11.
10. **Browser-limit docs (C, X):** S7, S8, P7 (PD-101/156 notes; verify the 4,000,000 px constant is not used on desktop).
11. **GitHub Actions (O):** decide S11 and D11 (workflows exist in Studio and graphx-docs).

### P2: next freeze window / later

12. **Production-core (J):** merge PR #1 then #2; fix C1, C2; add the move-in list per crate and freeze-window date (C3).
13. **Fold-in pointers (C, X):** V5, V6 (visualizer colour/PDF engines), S14 (Studio PDF crates and modes table after the PD-137 mapping answer).
14. **Estimates and automation wording (X):** P6, P8, P9.
15. **SQLite scope (O then C):** S10 (does PD-152 cover the legacy Templates & VDP backend?), V7.
16. **n8n labels (C):** S12.

### Owner decisions needed (batched)

1. Make the native-v1 branch the Studio default, and what happens to its 24 `main`-only commits (S3).
2. Does PD-152 (no SQLite) apply to the legacy Python Templates & VDP backend (S10, V7)?
3. Disable or remove the GitHub Actions workflows in graphx-studio and graphx-docs (S11, D11)?
4. Approve the ADR-0001 amendments and the PD-37..170 mirror into graphx-docs (D1..D4, D9).
5. May PR #428 get a FROZEN notice (P11)?
6. Is the OneVision XML adapter (P8) allowed as an internal-only module for parity work?

---

## Notes on scope

- Only the refs listed were read; the 40+ other Studio and visualizer feature branches were not audited. Studio `packages/craft-forks/**` (vendored upstream READMEs and licences) were excluded from the conflict searches.
- Nothing was run or built. Conflicts about code behaviour (S7, P7) are based on constants and docs; verify before changing.
- `.omx/` directories in Studio (planning leftovers from the disabled OMX tooling) were not treated as current docs.
