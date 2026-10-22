## FOCUS: make Studio work for designers
**"Working"** means a designer can open, place, edit (shapes, text, images, vector), save, reopen and export (PDF, PNG) real shop files, in both desktop and browser, with no dead buttons. Everything below serves that; nothing else starts until it is met.
**Do these 6, in order** (IDs are in section 4 and `handoff-2026-10-18/CRAFT-PARITY-GAPS.md`):
1. P0 base test fix: designcraft ui-egui tests build and pass on the base (S; unblocks every merge). PARTLY DONE: the tracker marks it Done via #265 (b15534d6), whose vendored-hayro Cargo pin (12a3f0a1, on base) makes the designcraft ui-egui standalone build compile again. NOT fully done: the #265 PR body says one ui-egui lib test, the `host_files` dirty-close test, still fails on the base itself (fails the same way without #265; ui-egui lib 721 run, 1 failure). Finish by fixing or updating that one test; until then `cargo test` for ui-egui is not fully green.
2. P1b + P1 Export: finish/merge Export PNG, then Export PDF, SVG, JPEG (parity rows 6, 7, 12; the biggest gap).
3. F2 toolbars PR (b) (`crd/studio-fix-toolbars-dock`; F1 property bar part 1 is merged as #262).
4. F4 property bar remaining parts (node tools, pie/arc angles, text and image controls, relative rotate).
5. P2 PDF fallback as vector, so a PDF that cannot open editable keeps sharp vectors, not a picture.
6. P8 Vector tools parity (parity row 14: Shape Builder, Scissors/Knife first, one family at a time).
**NOT NOW** (wait until "working" is met): DAM server/DM1, large-file pipeline (L1, L2), hostile-PDF hardening beyond the current state (P5, P10), desktop updater (D3), readability beyond new code, size trims (P4), CM5, store/workers rows not needed for save.
**Designer test script** (run on every test-build refresh; the first failing step becomes the top item):
1 New document. 2 Draw a rectangle; set fill and outline with the colour palette (left click = fill, right click = outline). 3 Click-to-type text and type a sentence.
4 Place an image (PNG or JPEG). 5 Open a 2-page PDF with the file picker (page picker appears). 6 Save. 7 Close with "Don't Save".
8 Reopen the saved file; everything is still there and editable. 9 Export PDF and open it in an outside viewer. 10 Send feedback with the Feedback button.

## AWAITING OWNER (decisions that block or shape work; answer these first)
Sources: the "Owner?" column in section 4 and the Blocked rows of the Checklist sheet (2026-10-21). Mark each answered in `OWNER-IDEAS.md` (PD id) the same turn.
- F7 (nothing-selected default fill): when no object is selected and you pick a colour, should the next new shape use it (engine feature, M, 4 to 8 h)? Needs F3 first.
- Browser Save UX (O1): use the File System Access API so Save rewrites the same file with no prompt (Chrome/Edge only; other browsers keep the download-and-confirm path)? M, 4 to 8 h.
- Desktop updater (D3): should the app check the test site for a newer signed build and offer to install it? Proposed only. Also needs D5 signing and D1.
- Apple Developer account (notarisation) and Windows code-signing certificate (D5): you supply both; builds stay unsigned and warn until then. Vendor validation can add 1 to 3 weeks.
- PKCE binding (D4): accept the current risk (mitigated by an account confirmation) or add server-side session binding so a copied challenge cannot be replayed? S, 2 to 4 h, High-risk path.
- CorelDRAW .cdr import: build a parser or use a licensed converter? Proprietary format, XL, 5 to 10 days, low confidence; no fork has one.
- Visualizer Gemini PRs #89 and #90 (they hold the production studios): #89 has REQUEST_CHANGES and you merge it; #90 is "salvage and close". Confirm the plan: address the review, land the Claude VZ fixes (`crd/vz-landing`), salvage then close #90.
- PD-107 items: confirm or override the severity rule (blocks Export error gating), and whether export/print gets a confirm dialog with a logged override (M, needs Export P1).
- PD-73 popout lane: browser pop-out panels passed the spike on 4 engines; which lane builds them (L, 1 to 2 days)?
- Claude builds, Codex reviews only: recommended, not confirmed. Codex is sometimes stopped by OpenAI's cyber filter on hostile-PDF work and by its own timeouts; confirm the split before the week starts.
- Delete the "Old Checklist (archive)" tab in the tracker sheet? Deleting is irreversible, so it waits for your word.
- About 2,200 anonymous docker volumes were left for now (cleanup 2026-10-21, list in `cleanup-20261021/volumes-dangling.txt`): prune later or keep?
- Rotate the OpenRouter key (keys live in `~/.config/graphx-llm`; rotation was flagged earlier, PD-91): approve and schedule it?
- PR GraphXCPI/graphx-studio#1 ("GraphX Studio integration checkpoint", an old July 2026 checkpoint, branch `claude/crazy-engelbart-900be6`): close it?
- Also open in the sheet (smaller): P4 accept the +307 KB web bundle growth or trim (recommended: accept); which Photo tools and shop fonts to do first (PH3, P9); PD-82 fold-in items and ADA wording (legal goes to you per PD-60).

---

# GraphX Studio: the current plan

Written 2026-10-21 (host dockerserver). This one page replaces day-to-day use of the older plan
(`claude-review-20261017/STUDIO-V1-BUILD-PLAN.md`, kept for history). Decisions are in
`OWNER-IDEAS.md` (PD ids). Per-lane detail is in the RESTART notes listed in section 6.

## 1. Goal

Ship the full v1 of GraphX Studio as decided in PD-44, by combining the working Craft apps
(DesignCraft, VectorCraft, PhotoCraft) into one interface and building on top of them (PD-100:
"Craft was working, we are just combining them"), not by re-making them. A test build must always
be live so the owner and the designers can use it, report problems in the app, and steer the work
(PD-104, PD-105). Big new ideas wait; a working app to test comes first.

## 2. Where it stands now

Integration branch `crd/studio-native-v1` in `GraphXCPI/graphx-studio`, merged through PR #269 (2026-10-21; #262 property bar part 1 and #265 toolbar docking are merged,
#260-#269 otherwise docs/readability). All lanes are paused by PD-112 until the weekly reset (Sat Oct 24, 4 PM Pacific / 23:00 UTC).

What works in the live test build:
- Opens on a blank document. File > New Document works. Page-by-page canvas with a CorelDRAW-style
  bottom bar (page nav, page tabs, status strip, colour strip) (#219, #220, #229).
- File > Open, Import and Place for Studio copies, DesignCraft, VectorCraft and PhotoCraft files,
  PNG, JPEG, TIFF, PSD, PSB, GIF, WebP, BMP, SVG, SVGZ, EPS (#232, #236, #238, #243).
- PDF and AI-PDF open as editable artwork (#249). A multi-page PDF asks which pages (All, range,
  single, with thumbnails) (#258; never seen on screen yet, owner to check). A PDF that cannot be
  opened natively falls back to a raster picture plus a notice (#253).
- Save and Save As, with editable text; Don't Save works; New Document after opening a file no
  longer blanks the UI (#241, #257).
- Typing: undo has no 32-step cap and typing is one undo step (#237). Click-to-type point text (#251).
- Tool flyouts open on click, hold and right-click; the colour strip works like Corel (left click =
  fill, right click = outline) (#252).
- Draggable, dockable, floating colour palettes and subtle grips (#256).
- Phase tabs that do nothing are hidden (#242). ArtCraft/Discord branding is gone (#231).
- In-app Feedback panel (lower-right button, screenshots) (#246); desktop sign-in with PKCE (#254, #255).
- PDF engine hardening: decode, render, structure budgets, loud diagnostics for dropped content
  (#202, #227, #240, #244, #247, #250); desktop has no artificial size limits (#207 to #218, #233).

What does NOT work yet: Export to PDF, SVG, JPEG; most of the CorelDRAW-style property bar;
Vector tools / Image Trace / Photo crop; desktop updater; signed Mac and Windows builds.

Open PRs outside graphx-studio that this work touches (checked with `gh pr view`, 2026-10-21; none are mine to merge without the owner):
- GraphXCPI/graphx-visualizer #79 (open, base main): orch Rust engine phase 3 inc1, browser WASM under 250 KB gzip (411,880 to 245,846 B), bit-exact, High-risk.
- graphx-visualizer #89 (open, base main): owner and Gemini production studios (DieCut/SAV/PDF, PG catalogue, CNC/fiducials, nesting/imposition/bindery, 360 studio; 13 commits). Review state REQUEST_CHANGES per the tracker; owner merges.
- graphx-visualizer #90 (open, base #89's branch): Gemini UI standardisation (sidebars, Layers/Spots/Colors, modal cost calculator, canvas handles). Plan: salvage then close.
- graphx-visualizer #99 (draft, base #89's branch): Gemini CorelDRAW-style Objects panel (fill/outline chips, hover eye/lock).
- graphx-visualizer #100 (draft, base #99's branch): standard layer set, finishing sublayers, optional sewing print, selectable exterior cuts.
- GraphXCPI/graphx-dam #1 (DRAFT, base main): salvage and review PR that preserves the legacy DAM work in its canonical repo (overlay, patches, manifests, reviews); not a release or deployment request.

Links:
- Browser build: https://studio-test.visualgraphx.com/app (Google login, @visualgraphx.com).
- Desktop downloads (Linux, Windows, macOS, unsigned): https://studio-test.visualgraphx.com/downloads
  (desktop installers built at 4e642078; the web build is a different, newer one, see below. Neither includes #258 or later).
- Web test site (`/app`): release 20261021T114338Z-baaf9f4c (published by the coordinator, 2026-10-21). It does not include #258 or later either.
  Both sites are therefore behind the base head (e45d72ba at #269); refreshing them is first action 1 after the reset.
- Owner's direct (Tailscale) build, always branch head: (tailnet-only URL, see FACTS on the server)
- Designer feedback list: `feedback/feedback.jsonl` on the test deployment; triaged items go to
  `handoff-2026-10-18/OWNER-TEST-FEEDBACK.md`.

### FIRST ACTIONS AFTER RESET (Sat Oct 24, 23:00 UTC), in order
1. Refresh both test sites and the desktop builds to the latest head (D1): build web plus the three desktops with `GRAPHX_BUILD_SHA`, `tools/refresh.sh`, then `tools/go-live.sh verify` (steps in `/mnt/data-d/docker/development/graphx-studio-test/RESTART.md`).
2. Merge the EXP and FNT branches up to base and open their PRs (`crd/studio-exp-png-export` 8793f567 and `crd/studio-fnt-bundled-styles` 54762dd2, both pushed, about 369 commits behind). See `/home/chris/graphx-build/INGEST-RESTART.md`.
3. Resume the FOCUS queue from item 1 (finish the one failing ui-egui test), then Export.
4. Update the tracker with the graphx-project-update skill (links in `TRACKER-LINKS.md`).
Lane restart notes are listed in `README.md` ("Lane restart notes").

## 3. Rules that matter (decisions still in force)

- PD-44: full v1 scope. PD-100: build on the working Craft code; do not blow it apart.
- PD-63 / PD-69 / PD-75: product and mode names are locked; Design is the base interface; Image,
  Develop, Vector and PDF Press are contextual tool sets; their basic tools live in the left toolbar.
- PD-65 / PD-70: one unified interface, specialised panels, no per-studio bespoke UI.
- PD-77: Studio is a PDF workspace; the saved file is a real PDF (1.3 to 2.0) with editable Studio data embedded.
- PD-80: the primary action is a split button that follows context (Add to order / Request proof / Save-Export).
- PD-81: ADA wording is "Meets the checked ADA rules" only, never "ADA compliant".
- PD-84: CodeGraph before edits, PR lists connections, concept folders, `//!` headers, rustdoc, small files.
- PD-85 / PD-90: approved licences (OFL, IJG, CDLA, MPL-2.0 for krilla/resvg); keep notices and credits.
- PD-93: build from the core out; readability is a must; do not widen scope.
- PD-94 / PD-95: never show or print something different from the file; any problem is a file error saying exactly what.
- PD-96: block every outside-reaching PDF action (links, JavaScript, remote files) and strip on save.
- PD-97: every saved PDF embeds a standard Output Intent profile; shop device ICCs only in internal PDFs.
- PD-98: large files, minimum slice only, and only after the core lanes finish.
- PD-101: desktop has no artificial limits; only real memory, and running out is a file error, never a crash.
- PD-102 / PD-103: page-by-page canvas with tabs; context-sensitive CorelDRAW-style property bar.
- PD-104 / PD-105: Craft-level parity for designer testing; in-app feedback, same in browser and desktop.
- PD-106: file I/O comes first and is never re-blocked; desktop uses installed system fonts.
- PD-107: if a problem changes the output it is a file error that blocks print/export until explicitly overridden.
- PD-108 / PD-109 / PD-110: colour strip left=fill right=outline; palettes and every toolbar re-anchorable.
- PD-111: multi-page PDF open asks which pages.
- PD-112: preserve usage until Sat Oct 24, 4 PM Pacific / 23:00 UTC; start nothing new before then.
- PD-89: split work between Claude and Codex; the reviewer is the other family. PD-99: minimal reviews.
- Never use GitHub Actions. Never print secrets. Never touch Docker ports 4100/3000/3100/4376.

## 4. NEXT WEEK queue (start after Sat Oct 24, 4 PM Pacific / 23:00 UTC)

Size: S under half a day, M about a day, L several days at agent speed. "Session" = the owning lane
session. "Owner?" = needs an owner decision before it starts. Every item ends with a test-build
refresh after merge (section 5).

### FRAME lane (session: studio-frame)

| # | Item | Size | Depends on | Done-test | Owner? |
|---|---|---|---|---|---|
| F1 | Finish PB1 (property bar part 1): merge the already-reviewed branch `crd/studio-fix-prop-bar1` (review APPROVE, fixer was running; not merged as of #259) | S | merge latest base, pr-gate | Select a rectangle, ellipse, curve, text: the top bar changes with the selection and edits X/Y/W/H, rotation, corner radius, outline | DONE (#262) |
| F2 | PR (b): toolbars adopt the dock framework + fix the duplicate "Vector tools" submenu (branch `crd/studio-fix-toolbars-dock`; Codex build done or nearly; needs ONE Claude review) | M | F1 may share files; merge F1 first | Drag a toolbar to another edge, reorder it, reset layout; Vector tools shows only extras | DONE (#265) |
| F3 | Default vs Document palette split (notes `/home/chris/graphx-build/FIX-palettes/FOLLOWUP-default-vs-document-palette.md`): Default = built-in CMYK + greys; Document = only colours stored with the file, starts empty | S | F2 | New doc: Document palette empty; dropping or using a colour adds it; reopening keeps it | answered (coordinator, 2026-10-21) |
| F4 | Property bar parts 2+: node tools for curves, pie/arc angles, text and image controls, relative rotate for several objects, PB1 minors | L | F1 | Each object type in the PD-103 list shows its controls | no |
| F5 | Small follow-ups: hide-focus minors, text-click minors 7/10/11, `pending_urls` open_url no-op, Photo/Vector corner-arrow patch (`PHOTO-VECTOR-flyout-corner-arrow.md`) | M | none | Listed items closed in journals | no |
| F6 | Identify the clipped coloured tabs at the far left edge (owner feedback 2026-10-20, still open) | S | none | Owner confirms the tabs are explained or removed | no |
| F7 | Nothing-selected default fill/outline for new objects (engine feature) | M | F3 | Pick a colour with nothing selected; the next shape uses it | yes |

### FILE I/O and PDF lane (session: studio-pdf-native-file-f / pdffmt)

| # | Item | Size | Depends on | Done-test | Owner? |
|---|---|---|---|---|---|
| P0 | Fix base: designcraft ui-egui test suite no longer builds standalone (broken by a recent PDF picker change, found by studio-frame while merging #262) | S | none | `cargo test` for designcraft ui-egui builds and passes on the base | no |
| P1 | Export PDF, SVG, JPEG (IO1-10..12; PNG export belongs to studio-develop). Plan: `/home/chris/graphx-build/IO1/PLAN.md` | L | none | Export a doc to each format, reopen the PDF and SVG in Studio and in an outside viewer; page count and size match; failures are file errors | no |
| P1b | Finish and merge Export PNG (studio-develop EXP branch, built but never merged; File > Export is not wired yet) | S | none | Export the current page to PNG at a chosen DPI from desktop and browser; the file opens in an image viewer | no |
| P2 | PDF fallback as vector, not raster: when a PDF cannot be opened as editable artwork, keep it as vector content (placed PDF) instead of a picture | M | P1 shares PDF writer; request in `REQUEST-PDF-OPEN-FALLBACK.md` | Business-card sample opens with text and lines still sharp at 800% zoom, plus the PD-95 notice | no |
| P3 | Verify by hand what was never seen on screen: PD-111 page picker, interactive file pickers, browser Open end to end | S | none | Owner or QA run through the 19-file test pack `claude-review-20261017/pdf-open-test-pack/` | no |
| P4 | Size trim for #233 / #232: bundle grew +307 KB Brotli because browser Open now ships decode_v3 (`PDF-SIZE-BISECT-233.md`). Recommendation: accept it (headroom to 22 MB is 2.31 MB), or do the cheap `from_slice` change (<= 10 KB) | S | none | Size baseline recorded; no trim attempted beyond the cheap one | yes (accept vs trim) |
| P5 | EPS hardening follow-up: SVGZ bomb test, panic guard around importers, JPX/JBIG2/CCITT PDFs refused whole, no wall-clock cancel on a pathological PDF, atomic-write symlink and permission handling | M | none | Hostile-input tests pass; PR bodies' follow-up list is closed | no |
| P6 | Remove temporary LANES.toml exceptions (OPEN1-desktop-open, PF2a-intake-record, PD106-CRAFT-IO; expire 2026-10-27) once P1 is done | S | P1 | `check-lane-ownership.sh` passes without them | no |
| P7 | PDF-native file format (PD-77): PF2b, PF2c, PF3w, PF3r, PF4 to PF8 per the ADR | L | P1, core settled | A saved Studio file opens as a normal PDF elsewhere and reopens fully editable | no |
| P8 | Remaining Craft parity: Vector tool families, Image Trace, Photo crop (frame-fit buttons are the interim), VectorCraft effects, Photo PH3 tools (`CRAFT-PARITY-GAPS.md` rows 10 to 16) | L (split per tool) | P1 first | Each tool works on the test build and appears in the parity list as PASS | no |
| P9 | Fonts: desktop uses installed system fonts; browser uses Local Font Access plus the bundled set with Bold/Italic (PD-106) | M | none | A shop font installed on the machine is selectable and prints with the right face; missing font is a file error | no |
| P10 | Fold in remaining base problems: web bundle growth beyond #232, hostile-PDF corpus, wall-clock cancel | S | none | Recorded in QUAL baseline | no |

### DESKTOP and DESIGNER-ACCESS lane (session: designer-access with coordinator)

| # | Item | Size | Depends on | Done-test | Owner? |
|---|---|---|---|---|---|
| D1 | Refresh the test site at the current head: build web plus the three desktops with `GRAPHX_BUILD_SHA`, run `tools/refresh.sh`, then `tools/go-live.sh verify` (steps in `/mnt/data-d/docker/development/graphx-studio-test/RESTART.md`) | M | merges above | `/app` and `/downloads` serve the new SHA; rollback is one command | no |
| D2 | Real signed-in tests: site widget Send, desktop PKCE exchange and keychain on Windows, macOS, Linux; Windows and macOS builds have never run on real machines | M | D1 | A report sent from each OS lands in `feedback.jsonl` | machines needed (BigMac, MBP) |
| D3 | Desktop updater (PROPOSED, not yet decided): the app checks the test site for a newer signed build and offers to install | M | D1, D5 | Install an older build; it offers and applies the update; failure leaves the old build working | yes |
| D4 | Server-side session binding for the PKCE login (`SERVER-bind-login-to-session.md`); currently an accepted risk, mitigated by an account confirmation | S | none | Copied-challenge replay is refused by the server | yes (accept risk or fix) |
| D5 | Mac and Windows signing: Apple Developer account (notarisation) and a Windows code-signing certificate | M | account and cert | Signed builds open on a clean Mac and Windows PC without a warning | yes (owner supplies both) |
| D6 | Check licences of the 5 small third-party ICC profiles embedded by crates | S | none | Each licence recorded or the profile removed | no |

### DAM and DM1 (session: dam-server)

| # | Item | Size | Depends on | Done-test | Owner? |
|---|---|---|---|---|---|
| M1 | Resume DM1 (shared types + BlobStore; treated High-risk). Specs 10-70 done, spec 75 in flight, branch `crd/dam-dm1-shared-types` @79f1f85, no PR yet. Then DS3, DS6, DS5 | L | none | PR with two-family review; DS3 quarantines when ClamAV is absent | no |

### Large files (PD-98, only after the core lanes finish)

| # | Item | Size | Depends on | Done-test | Owner? |
|---|---|---|---|---|---|
| L1 | Pipeline S2 (tus upload, preview pyramid, signed range reads), SV2 (tus client, OPFS range reads), IN2 (streaming ingest + pyramid) | L | P1, P7, core settled | A large browser image opens as a preview with no blank or refusal | no |
| L2 | Full-resolution browser tiles and Huge Document (TLa*, TLb1, PC4, SV3, SV4) | L | L1 | Zoom into a huge image on the web at full resolution | later |

### Open owner-feedback items (from `OWNER-TEST-FEEDBACK.md`)

| # | Item | Size | Depends on | Done-test | Owner? |
|---|---|---|---|---|---|
| O1 | Browser Save is clunky (prompt for a name, then "Confirm download"). Consider the File System Access API (Chrome/Edge) to save in place | M | none | Save writes the same file again with no prompt | yes |
| O2 | Triage new designer reports from `feedback.jsonl` into the feedback file and assign them | S, weekly | none | Every new report has a status line | no |
| O3 | Verify items marked done but not yet confirmed on the test build (Feedback button, flyouts, colour strip, New after PDF) with the owner | S | D1 | Owner says yes in the feedback file | no |

Order of attack: F1, F2 (finish what is built) and D1 first so the test build is current, then P1
(Export) in parallel, then F3, P2, P3, F4, P5. Mac/Windows signing and the updater start as soon as
the owner provides the accounts. Large files and DM1 follow the core.

## 5. How we work

- Work split (PD-89): design, plan and build roughly half Claude and half Codex, in parallel; the
  reviewer is always the other family; at most 2 Codex jobs at a time; sessions are orchestrators.
- Minimal reviews (PD-99): ONE review per PR (Standard); fix blockers only, merge, track the rest.
  High-risk keeps both families in one round plus a ledger row. Merge authority is PD-46.
- After every merge that changes the app, refresh the test sites (D1 steps), and tell the coordinator.
- Feedback triage: read `feedback.jsonl`, add a line per report to `OWNER-TEST-FEEDBACK.md`, assign
  a lane, and log each owner idea in `OWNER-IDEAS.md` the same turn.
- Blocker check: every lane reports only merges and blockers; a blocker is posted to
  `handoff-2026-10-18/LANES-STATUS.md` and the ONE-APP board the same hour.
- Usage pacing: check weekly usage at the start of each day; at about 85 to 90% stop new work, finish
  in-flight reviews, write RESTART notes (as done for PD-112) and hand off to Codex if needed.

## 6. Where things live

| What | Path |
|---|---|
| Source repo (integration branch) | `GraphXCPI/graphx-studio`, `crd/studio-native-v1` |
| Worktrees | `/mnt/data-d/dev/GraphXCPI/worktrees/graphx-studio/<task>` |
| Owner decisions (PD ids) | `/mnt/data-d/dev/GraphXCPI/coordination/OWNER-IDEAS.md` |
| Lane log and status | `coordination/handoff-2026-10-18/LANES-STATUS.md` |
| Owner/designer test feedback | `coordination/handoff-2026-10-18/OWNER-TEST-FEEDBACK.md` |
| Craft parity list | `coordination/handoff-2026-10-18/CRAFT-PARITY-GAPS.md` |
| Rules every lane session reads | `coordination/handoff-2026-10-18/LANE-SESSION-BRIEF.md` |
| FRAME lane restart | `/home/chris/graphx-build/FRAME-RESTART.md` |
| PDF lane restart | `coordination/handoff-2026-10-18/studio-pdf-RESTART.md` |
| File I/O lane restart | `coordination/handoff-2026-10-18/PDFFMT-RESTART.md` |
| Test site deployment | `/mnt/data-d/docker/development/graphx-studio-test/` (RESTART.md, README.md, tools/) |
| Build scratch and briefs | `/home/chris/graphx-build/<ID>/` |
| Old v1 build plan (history only) | `coordination/claude-review-20261017/STUDIO-V1-BUILD-PLAN.md` |
| Cross-session board | `coordination/ONE-APP.md` |

## Findings from the 2026-10-21 module-doc refresh (to plan after the reset)
- File > Open has a flat 32 MiB cap on every file, desktop included; this contradicts PD-101.
- A document with both text and placed artwork can't be saved yet; the interim writer refuses it.
- The PDF worker (guard, budgets, diagnostics) isn't linked into the app, and `set_decode_limits` is never called.
- Five toolbar buttons do nothing (Free Transform, Note, Color Theme, Measure, Vertical Type on a Path).
  The top-bar Search field and the reference-point grid aren't connected either.
- Page-tab names aren't saved with the file. The Default and Document palettes show the same list (F3).
- Export PNG (EXP) and fonts (FNT) branches are now backed up on GitHub (pushed 2026-10-21: crd/studio-exp-png-export 8793f567, crd/studio-fnt-bundled-styles 54762dd2); both are ~369 commits behind base and still need a merge + PR.
- Visualizer: VZ fixes #91-#98 sit on `crd/vz-landing` (no PR to main); the production studios are only on the #89 stack.
- Full write-ups are in the Drive module docs; their sources are in coordination/module-docs/.
- PD-114 Google Fonts (owner, 2026-10-21): self-host the full Google Fonts library on our server; font list shows all families, download on first use + cache, desktop "download all"; embed used fonts on save/PDF. Plus: server mirror auto-syncs with upstream; desktop setting "Keep in sync" vs "Keep what I have"; easy upload/sync of designers' local fonts, shared with the whole shop (no licence checks; compliance is the tenant's/user's, as in Adobe/Corel). Do after FNT branch is merged. Size: L.
- PD-115/116/117 (owner, 2026-10-21, FRAME lane after reset): panel-tab overflow or vertical rotated tabs; Window > Panels multi-select + save workspace; dedupe the Layout toolbar into the designer toolbar as grouped flyouts. Screens: handoff-2026-10-18/screens/owner-20261021/.
- Production integration (doc 12, PRD-01..89): ON HOLD. PD-118 (owner, 2026-10-21): it starts only after the Studio baseline design system is built and owner-approved, and it builds on those systems. The owner is also reviewing the map and its 15 decisions first.
- PRD-142 (owner said "do it", 2026-10-22): rename OneVision names/text out of the visualizer code and UI on crd/vz-landing (PD-153). Tracker row 266.
