# Product Requirements Document (PRD)

**Product**: StyleSmith  
**Version**: v1.1 (Draft)  
**Owner**: Benjamin W. Slater  
**Updated**: Aug 24, 2025

---

## 1) Summary
StyleSmith is a local‑first web app for visually defining a tokenized design system and exporting production‑ready CSS artifacts:

- **reset.css** — optional selectable reset (**Josh Comeau — Recommended**)  
- **tokens.css** — `:root` custom properties (with dark mode media/class variants if enabled)  
- **utilities.css** — tight, token‑bound utility classes (responsive + state variants)  
- **style.css** — imports reset, tokens, utilities  
- **style.bundle.css** — optional inlined + minified single file  

The app includes:
- **Landing** (product overview & new/open project)
- **Editor** (variables/tokens, utilities selection, components, docs preview, code export)
- **Style Sheet** page (visual gallery & interactive specimens; printable/downloadable)

**Primary value**: bridge design ↔ code so teams go from tuned tokens to consistent, exportable CSS in minutes, not days. Deterministic outputs make enforcement and CI integration straightforward.

---

## 2) Users & Jobs-to-be-Done
**Primary users**
- **Design Systems PM / Design Ops** — define variables, publish utilities & docs
- **Front‑end Engineers** — export vars/utilities, wire into builds, enforce consistency
- **Designers** — visually tune styles, preview outcomes

**Top JTBD**
- Define/edit tokens, utilities, and components visually with confidence (live preview)
- Export standardized CSS artifacts for immediate project use
- Generate shareable, printable documentation/style sheet

---

## 3) Goals & Non‑Goals
**Goals (v1)**
- Fast, visual variable/component editing with live preview
- Per‑section toggles for variable categories, utility families, and components
- Deterministic, reproducible exports (fixed ordering & naming)
- Copy‑to‑clipboard and ZIP download delivery
- Local‑first saving (no login)

**Non‑Goals (v1)**
- Real‑time collaboration, shareable links, cloud accounts
- Full Tailwind‑like arbitrary utilities (tight, token‑bound only)
- Advanced versioning/releases

**Success metrics (post‑launch)**
- **TTFE (Time to First Export)**: ≤ 5 minutes for a new user (p50), ≤ 10 min (p90)
- **Export Reliability**: 99% of export attempts complete without error
- **Reopen & Continue**: ≥ 80% of users can reopen a project and see identical CSS (determinism)
- **Print/Doc Use**: ≥ 50% of projects export style sheet/docs at least once

---

## Key decisions (v1)
- **CSS Reset**: No default; **Josh Comeau — Recommended**; `reset.css` only generated/imported when selected.

---

## 4) In‑Scope Variable Categories (Tokens)
- Color (background, foreground, primary, semantic)
- Typography (families, sizes, line‑height, weight)
- Spacing (margin/padding scale)
- Sizing (width/height scales)
- Display & layout helpers
- Breakpoints
- Radii
- Shadows
- Border (width/style)
- Opacity
- State
- Position
- Overflow
- Motion (duration/easing)
- Z‑index

**CSS Reset Picker (optional; generated as **reset.css**, imported by **style.css** when selected; **Josh Comeau — Recommended**)
- Josh Comeau (default), Normalize.css, modern-normalize, Eric Meyer Reset,
  Andy Bell Modern Reset, Tailwind Preflight, CSS Remedy, Open Props Normalize

---

## 5) In‑Scope Component Categories (Generator)
- Buttons & button groups — primary/secondary/outline, loading/disabled
- Navigation bars & menus — horizontal/vertical, collapsible mobile, dropdowns
- Forms — inputs/selects/textareas/checkboxes/radios, validation states
- Grid/layout system — responsive container, columns (12‑col via CSS Grid/Flex)
- Cards & panels — header/body/footer
- Alerts & notifications — success/error/warning
- Modals & dialogs — accessible overlays
- Dropdowns & menus — keyboard support
- Tabs & accordions — content panels
- Tooltips & popovers — hover/focus overlays
- Tables & data displays — responsive, striped, bordered
- Icons & badges — decorative & count indicators
- Breadcrumbs & pagination — navigation patterns

> **v1 scope note**: **Docs‑first MVP** for v1 is **Buttons**, **Forms**, **Modals**, **Tabs**, **Tables**. Components are token‑styled and emitted as CSS class recipes with minimal structural HTML examples inside docs; no framework bindings. A tiny optional vanilla‑JS helper (**docs‑only**) powers demo behavior for Modals/Tabs and is **not** included in production exports.

---

## 6) Naming, Prefix, Units, Scales
**Naming scheme**
- **Default**: 5‑scale (e.g., `--size-3`, `--radius-2`, `--shadow-2`)
- **Options**: 100‑scale (`--spacing-100`, `--spacing-200`), Verbose (`--space-xs`, `--space-sm`), Custom pattern (e.g., `{category}-{level}` or `{category}-{semantic}`) with live preview
- **Prefix/namespace**: optional (`--ds-*`, `--brand-*`) applied across tokens & utilities (default: none)

**Units & conventions (defaults; user‑changeable)**
- Spacing & sizing: `rem`
- Font sizes: `rem`
- Line-height: unitless
- Border radius & widths: `rem`
- Shadows: tokenized strings
- Durations: `ms`
- Easing: cubic‑bezier strings

**Type scale generator**
- Default ratio **1.25**, base **1rem**; presets (1.2, 1.25, 1.333, 1.414, 1.5) + custom; drag‑to‑tune curve
- **Heading mapping**: By default, `h1–h6` map to the modular scale tokens and update automatically when ratio/base change. Suggested defaults:
  - `h1 → +3`, `h2 → +2`, `h3 → +1`, `h4 → 0`, `h5 → −1`, `h6 → −2`
  - Mapping is editable per project.
- All sizes expressed in `rem` to respect the user’s browser base size.

---

## 7) Utilities System (tight, token‑bound)
**Coverage** (each family toggleable)
- Layout: `display`, `position`, `inset`, `z`, `overflow`
- Spacing: `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml`, and `p*` (from spacing tokens)
- Sizing: `w`, `h`, `min-w`, `max-w`, `min-h`, `max-h` (from sizing tokens)
- Flex & Grid: `flex`, `grid`, `gap`, `grid-cols`, `place-*`, `justify-*`, `items-*`
- Typography: `text` (size), `font-weight`, `leading`, `tracking`, `font-family`
- Color: `text-*`, `bg-*`, `border-*` from color tokens (alpha scales later)
- Border: `border`, `border-{side}`, `rounded`
- Effects: `shadow`, `opacity`
- Motion & Transform: `transition`, `duration`, `easing`, `transform`, `scale/rotate/translate`

**Variants & modes**
- **Responsive prefixes**: `sm: md: lg: xl: 2xl:` (from user breakpoints)
- **State**: `hover: focus: active: disabled: focus-visible: visited:`
- **Dark mode**: `.dark` class toggle **and** `@media (prefers-color-scheme: dark)` supported
- **Negative values**: not in v1
- **Arbitrary values**: not in v1 (token‑only)
- **!important**: off by default

**Determinism**
- Given the same config, emitted CSS is byte‑for‑byte identical: fixed token ordering → utility ordering → variant ordering.

---

## 8) Visual Editing UX
- Inline table editing; sliders/steppers for numeric scales; color pickers (HEX/RGB/HSL/HWB; accept RGB/HSL/HSLA/OKLCH input)
- Batch generate via ratio; multi‑select edit
- Live preview panel per section
- Validation: duplicate‑name detection; basic unit/name linting
- Contrast: color picker shows WCAG status for text/background pairings
- Always‑on sync: the **Style Sheet** page updates as you edit
- Undo/redo: Post‑v1 (not included).

**Token imports (v1)**
- Paste CSS containing `:root` variables → parse into tokens
- *(Stretch)* Upload `tokens.css` file (same parser)

---

## 9) Exports & Packaging
**Files**

```css
/* style.css (always generated) */
/* Optional: include reset only if selected */
/* @import url("./reset.css"); */
@import url("./tokens.css");
@import url("./utilities.css");
```

- **reset.css** — chosen reset (Josh Comeau default)
- **tokens.css** — `:root { --* }` (+ dark mode media/class blocks if enabled)
- **utilities.css** — token‑bound utilities & variants
- **style.bundle.css** — optional single file (imports inlined), minified

**Delivery**
- ZIP download (client‑generated)
- Copy‑to‑clipboard (per file)
- **Export dialog options**: `Include docs (docs/)` **off by default**; `Include demo JS (components.js)` appears only when docs are included and relevant components are selected; both settings persist per‑project

**ZIP structure**
```
/
  style.css
  reset.css          (if selected)
  tokens.css
  utilities.css
  style.bundle.css        (if selected)
  README.md               (import order & usage)
  docs/
    utilities.html        (reference, optional)
    style-sheet.html      (visual page, optional)
    components.js         (demo helpers, optional; not required in production)
    assets/               (icons/fonts used in docs only, optional)
```

**README.md content (generated)**
- Purpose of each file; import order; dark mode notes (default is `@media (prefers-color-scheme: dark)`; `.dark` class is an optional alternative); naming/prefix reminders (**default prefix: none**); licensing notes for included reset.
- If **no reset** is selected, `reset.css` is **omitted** from the ZIP and the import in `style.css` is **commented out**.
- If docs are exported **and** Modals/Tabs demos are included, `docs/components.js` is provided for demo behavior only; **do not** ship it to production.

---

## 10) Saving, Accounts, Privacy
- **Auth/Projects**: No login in v1. Save projects to **IndexedDB** (via localForage). Preferences in localStorage. Multiple projects (create/rename/duplicate/delete)
- **Share/Collab**: None in v1 (later: read‑only/editable links, presence)
- **Privacy/telemetry**: Everything local by default; anonymous usage analytics opt‑in only. First-run prompt: “Help improve StyleSmith? Share anonymous usage analytics. No project or CSS data is sent.” [Enable] [No thanks] (remembered per device). A Settings toggle allows changing this anytime; no analytics are sent until enabled.

---

## 11) Tech Stack
- **Frontend**: React + Vite + TypeScript
- **App UI styling**: Plain external CSS files (no Tailwind / CSS‑in‑JS / inline CSS); maintainable class selectors
- **State**: Local component state only (consider module‑scoped stores for editor panes)
- **Storage**: IndexedDB (localForage) + localStorage for prefs
- **ZIP generation**: Client‑only
- **License/hosting**: Closed source for now

---

## 12) Acceptance Criteria (key examples)
**Editor & Tokens**
- User can create, edit, delete tokens in each category; changes reflect in preview within 100ms
- Duplicate token names are prevented with clear inline errors
- Type scale generator produces expected values for default and custom ratios
- Heading tokens drive `h1–h6` sizes via the default mapping; changing the ratio/base updates all headings immediately
- Body text remains at `1rem` unless overridden; all sizes are in `rem` to respect user settings
- Color contrast indicator displays WCAG AA/AAA pass/fail for selected foreground/background
- Importing pasted `:root` CSS parses ≥ 95% of well‑formed variables; unparsed items are listed with reasons

**Utilities**
- Toggling a utility family on/off adds/removes it from **utilities.css** and docs
- Responsive prefixes use the current breakpoint tokens; changing breakpoints updates generated classes
- State variants generate only for selected families to limit size
- Class ordering is deterministic across sessions

**Components (Docs‑first MVP)**
- Each MVP component produces: (a) CSS recipe classes, (b) minimal HTML example in docs, (c) accessibility notes & keyboard behavior where applicable.
- **Buttons**: primary/secondary/outline; disabled & loading states; min hit-area ≥ 44×44; focus-visible outline tokens.
- **Forms**: inputs/selects/textareas/checkboxes/radios; labels/description/error associations; required/invalid styling; focus-visible meets WCAG 2.2; inline/stacked spacing from tokens.
- **Modals**: overlay + dialog containers; ARIA `role="dialog"/"alertdialog"` with `aria-labelledby`/`aria-describedby`; inert background in docs demo; set initial focus & return focus in docs demo; Escape closes; focus trap in docs demo. CSS export contains visual styling only.
- **Tabs**: `role="tablist"/"tab"/"tabpanel"`; arrow-key + Home/End navigation in docs demo; visible selected state; proper hidden semantics. CSS export contains visual styling only.
- **Tables**: responsive pattern (stacked on small screens) with tokens; header/body/row striping; caption and `scope` attributes; no JS required.
- Docs export may include optional `docs/components.js` (≤ 2 KB gz) to power demo behaviors; **opt‑in** only and not required for production.

**Exports**
- ZIP contains all selected files with exact structure above
- **style.css** imports resolve to sibling files; **style.bundle.css** has imports inlined and minified
- If **no reset** is selected: `reset.css` is omitted and the `@import` in `style.css` is commented out
- Copy‑to‑clipboard works for each file and matches ZIP contents byte‑for‑byte
- **Export dialog** shows `Include docs` (default **off**). When toggled on, a secondary toggle `Include demo JS` appears only if Modals/Tabs are included; defaults **off**. Toggling affects ZIP contents immediately and is remembered per project.

**Saving**
- Creating/renaming/duplicating/deleting projects updates IndexedDB and project list instantly
- Reopening a project reproduces identical CSS outputs (hash match) given no edits
- On first run, analytics prompt appears; default is off; user choice persists per device; a Settings toggle exists; no analytics are sent until enabled.

**Docs/Style Sheet**
- Style Sheet reflects live token edits (no manual refresh)
- Headings (H1–H6) in docs follow the type scale tokens and update when ratio/base change
- Optional exports of `docs/utilities.html` and `docs/style-sheet.html` render without external network calls


---

## 20) Visual Design Language (V1)
**Vibe**: reminiscent of technical drawings; **Prussian blue** on **off‑white**. Dark mode is branded **“Blueprint Mode”** with colors flipped.

### Principles
- **Technical clarity**: thin rules, precise spacing, obvious structure (gridlines over gradients).
- **Paper → Blueprint**: light theme ≈ off‑white paper with Prussian blue ink; dark theme ≈ blueprint paper with light ink.
- **Low ornament**: minimal shadows, small radii, emphasis via outlines and contrast.
- **Accessibility first**: AA contrast for UI/body text; AAA where practical for body copy.

### Color DNA (tokens)
Light (default):
```css
:root {
  /* Extracted from logo */
  --color-bg:        #F4E8CB; /* off-white paper */
  --color-fg:        #1C4C64; /* prussian-ish ink */
  --color-surface:   #FFFFFF;
  --color-muted:     #5E6E77; /* subdued text */
  --color-border:    #6C8796; /* UI/divider lines (AA for non-text graphics) */
  --color-outline:   #2E6A8C; /* accent outline */
  --focus-ring:      #2E6A8C; /* ≥ 3:1 vs bg */

  /* States (can tune later) */
  --color-success:   #1D6B3F;
  --color-warning:   #8A5A00;
  --color-danger:    #8E2F2F;
}
```
Blueprint Mode (dark; colors flipped):
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:      #143343; /* blueprint paper */
    --color-fg:      #F4E8CB; /* light ink */
    --color-surface: #0F2A38;
    --color-muted:   #C9D6E0;
    --color-border:  #6C8796;
    --color-outline: #CFE0EA;
    --focus-ring:    #CFE0EA; /* ≥ 3:1 vs bg */

    --color-success: #69D099;
    --color-warning: #FFCF70;
    --color-danger:  #FF8E8E;
  }
}
```
> The chosen **bg/fg** pairs pass AAA for body text in both modes.

### Typography
- **Body**: system‑UI stack (no webfont), size via modular scale (default 1.25 ratio, base 1rem).
- **Code/Numbers**: monospace stack for inputs, tokens, specimens.
- **Styles**: strong = heavier weight, not color alone; italics sparing; tracking default; `tabular-nums` where data aligns.

### Density, Radii, Shadows
- **Density**: compact‑to‑medium (8px base grid expressed in `rem`).
- **Radii**: small by default (`--radius-1` ≈ 0.125rem, `--radius-2` ≈ 0.25rem).
- **Shadows**: minimal; prefer **1px inner/outer rules** for emphasis instead of heavy blur.

### Lines, Grid & Iconography
- **Rule weight**: 1px standard, 2px for emphasis (hairline look on standard DPR).
- **Gridlines**: **varied, layered scaffold** using `--color-border` — minor grid every 8px (1px), major grid every 64px (2px). Per-pane **offsets** (e.g., 0–8px) prevent perfect alignment across the entire app, keeping the look lively but still crisp. Visible in app chrome and specimens; off by default in exported docs.
- **Icons**: stroke icons at ~1.5px stroke; avoid filled glyphs.

### Motion
- **Tone**: precise and restrained; no bouncy easing.
- **Durations**: 120–200ms; `--duration-fast: 120ms`, `--duration: 160ms`, `--duration-slow: 200ms`.
- **Easing**: `--easing-standard: cubic-bezier(0.2, 0, 0, 1)`; respect `prefers-reduced-motion`.

### Component Styling Notes (Docs‑first set)
- **Buttons**: outline‑forward; default is outline button with transparent fill; primary uses Prussian blue fill on light, off‑white fill on Blueprint Mode.
- **Forms**: 1px outlines, generous focus rings using `--focus-ring`; filled inputs only on hover/focus.
- **Modals**: surface with 1px border and soft shadow `0 8px 24px rgba(0,0,0,.08)` (light) / `rgba(0,0,0,.4)` (dark).
- **Tabs**: underline/rail indicator (2px) instead of pill backgrounds.
- **Tables**: zebra rows with very low‑alpha rule separators; captions visible.

### Style Sheet (Specimens)
- Specimens use blueprint gridlines and measurement ticks.
- A visible theme toggle labeled **“Blueprint Mode”** switches the preview (still honors OS `prefers-color-scheme`).

### Acceptance Criteria (Visual)
- Light theme renders off‑white bg with Prussian blue fg; dark theme labeled **Blueprint Mode** flips palette; both meet WCAG 2.2 AA for body/UI text.
- Focus indicators use `--focus-ring` and have ≥ 3:1 contrast against adjacent colors.
- Default rule weights are 1px; emphasized rules 2px; no component uses blur radius > 24px.
- **Varied gridlines** render as 8px minor + 64px major layers, with optional per-pane offsets; lines are pixel-crisp at 1×/2×/3× DPR (no blur/moire); GPU overhead is negligible (no scrolling jank).
- Iconography uses stroke style; stroke width consistent across components.
- Motion tokens applied across interactive elements; `prefers-reduced-motion` disables non‑essential transitions.
- The Exported docs include the **Blueprint Mode** label on theme toggles when `docs/` is included.

### Open Tuning Knobs
- Exact hex values for off‑white and Prussian blue.
- Whether app chrome shows faint gridlines by default.
- Button default (outline vs filled) in light theme.


---

## 21) App‑Only Visuals Policy
**Scope**: The following treatments exist **only** to style the StyleSmith application UI. They **do not** affect exported CSS artifacts (`reset.css`, `tokens.css`, `utilities.css`, `style.css`, `style.bundle.css`) and are not included in ZIPs unless explicitly enabled for docs.

### Treatments
- **Varied gridlines**: layered minor/major grids (8px/64px) with subtle per‑pane offsets. Visible in app chrome and in‑app specimens by default. **Not exported**. If docs are exported, gridlines are **off by default** with an optional `Show gridlines in docs` toggle.
- **Sketch borders** (hand‑drawn outline vibe): optional class used in **app chrome only** (default **off**). **Never exported** to projects or docs.

### Tokens (app‑only)
```css
:root {
  --gridline-color: rgba(0,49,83,0.06);
  --grid-minor: 8px;
  --grid-major: 64px;
  --grid-weight-minor: 1px;
  --grid-weight-major: 2px;
}
/* Offsets applied per pane/container to vary alignment */
.pane[data-grid-offset="a"] { --grid-offset-x: 0px;  --grid-offset-y: 0px; }
.pane[data-grid-offset="b"] { --grid-offset-x: 4px;  --grid-offset-y: 2px; }
.pane[data-grid-offset="c"] { --grid-offset-x: 8px;  --grid-offset-y: 4px; }
```

### Implementation (CSS only; no assets)
```css
.app-chrome {
  --grid-offset-x: 0px; /* default; overridden by panes */
  --grid-offset-y: 0px;
  background-image:
    /* minor grid */
    linear-gradient(to right, var(--gridline-color) var(--grid-weight-minor), transparent 0),
    linear-gradient(to bottom, var(--gridline-color) var(--grid-weight-minor), transparent 0),
    /* major grid on top */
    linear-gradient(to right, var(--gridline-color) var(--grid-weight-major), transparent 0),
    linear-gradient(to bottom, var(--gridline-color) var(--grid-weight-major), transparent 0);
  background-size:
    var(--grid-minor) var(--grid-minor),
    var(--grid-minor) var(--grid-minor),
    var(--grid-major) var(--grid-major),
    var(--grid-major) var(--grid-major);
  background-position:
    var(--grid-offset-x) var(--grid-offset-y),
    var(--grid-offset-x) var(--grid-offset-y),
    var(--grid-offset-x) var(--grid-offset-y),
    var(--grid-offset-x) var(--grid-offset-y);
}
```

### Acceptance criteria
- Generating a ZIP with default settings produces **no** gridline or sketch‑border rules in any exported CSS file.
- Exported docs render **without** gridlines unless `Show gridlines in docs` is enabled at export time.
- **Varied gridlines**: default minor 8px & major 64px layers render crisp at multiple DPRs; per‑pane offsets vary alignment without visible blur.
- Toggling app‑only visuals does not change the hash of exported CSS for a given project configuration.

