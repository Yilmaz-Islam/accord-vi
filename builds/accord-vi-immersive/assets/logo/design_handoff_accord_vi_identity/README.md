# Handoff: ACCORD VI — "Resonance" identity mark

## Overview
Visual identity for **ACCORD VI**, the sixth edition of a two-night music event. The
deliverable is a monoline symbol ("Resonance"), its horizontal lockup with the
wordmark, five approved colourways, and two size-specific simplified cuts for small
UI use. This handoff covers implementing that mark as reusable code (icon component,
favicon set, brand token layer) plus the exploration board that documents how it was
chosen.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that
show the intended look and construction, not production code to copy directly. The
task is to **recreate them in the target codebase's existing environment** (React,
Vue, SwiftUI, native, etc.) using its established patterns and libraries. If no
environment exists yet, pick the most appropriate framework for the project and
implement there.

One exception worth calling out: the **SVG files in `exports/` ARE production assets**.
They are hand-authored, font-free vector files on a clean 120-unit grid and should be
used as-is (or inlined into an icon component) rather than redrawn.

## Fidelity
**High-fidelity.** Colours, stroke weights, geometry, tracking and clear-space rules
are final and specified to exact values below. Recreate them precisely. The
surrounding exploration board (`ACCORD VI Logo.dc.html`) is a documentation artefact,
not a screen to ship — treat it as hifi reference only if you are rebuilding the
brand-guidelines page.

## Screens / Views

### 1. Symbol — "Resonance" (primary asset)
- **Purpose:** the event's mark. Used as app icon, favicon, avatar, stage screen bug,
  merch print.
- **Canvas:** `viewBox="0 0 120 120"`, square, no padding baked in.
- **Construction (exact):**
  - Vertical axis: `<line x1="60" y1="8" x2="60" y2="112">`
  - Three arc pairs, symmetrical about the axis, stepping outward at even intervals:
    - r20: `M66.8,41.2 A20,20 0 0 1 66.8,78.8` and `M53.2,41.2 A20,20 0 0 0 53.2,78.8`
    - r34: `M71.6,28.1 A34,34 0 0 1 71.6,91.9` and `M48.4,28.1 A34,34 0 0 0 48.4,91.9`
    - r48: `M76.4,14.9 A48,48 0 0 1 76.4,105.1` and `M43.6,14.9 A48,48 0 0 0 43.6,105.1`
  - Centre node: `<circle cx="60" cy="60" r="4">`, **filled** with the ink colour, no stroke.
  - Strokes: `fill="none"`, `stroke-width="2.4"`, `stroke-linecap="round"`. No joins,
    no gradients, no shadow.
  - Six arcs = six waves for the sixth edition; the axis reads as the two nights
    either side of one event. Do not add or remove an arc pair.
- **Optional containing ring** (used on the swatch chips only, not the primary mark):
  `<circle cx="60" cy="60" r="54" opacity="0.3">` at the same stroke weight.

### 2. Lockup — symbol + wordmark (horizontal)
- **Purpose:** headers, posters, ticket footer, email signature.
- **Layout:** `display:flex; align-items:center; gap:40px` — symbol at 180px, then a
  `flex-direction:column; gap:14px` type block.
- **Components:**
  - Symbol: 180 × 180 px.
  - Line 1 — `ACCORD`: Sora, weight 300, 34px, `letter-spacing:0.34em`,
    `text-indent:0.34em` (cancels the trailing space so the block stays optically
    flush left), colour `#efece6`.
  - Line 2 — `SIXTH EDITION`: Sora, weight 300, 13px, `letter-spacing:0.4em`,
    `text-indent:0.4em`, `white-space:nowrap`, colour `#8f9099`.
- **Ground:** `#0e0f12`, padding 48px.
- The `text-indent` trick matters. Without it, tracked-out caps sit visually indented
  and the two lines no longer align.

### 3. Colourways (five approved)
Chip geometry: 120-unit circle plate `<circle cx="60" cy="60" r="60">` filled with the
ground, mark drawn over it at `stroke-width:2.6`. The two dark-ground chips also carry
a `r="59"` hairline in `#3a3c46` so the plate edge is visible on a dark page.

| Key | Name | Ink | Ground | Use |
| --- | --- | --- | --- | --- |
| k1 | BONE | `#efece6` | `#0e0f12` | default, everything |
| k2 | RED | `#f3d9d2` | `#5c1119` | night one / hero moments |
| k3 | MINT | `#7fe3d0` | `#101820` | night two / digital accents |
| k4 | BRASS | `#e0b455` | `#0e0f12` | print, foil, merch |
| k5 | INVERT | `#0e0f12` | `#efece6` | light grounds, press, invoices |

Ink and ground are a **pair**. Never mix an ink with a ground it is not listed against,
and never recolour arcs individually.

### 4. Size-specific cuts
The mark thins as it shrinks — fewer strokes, heavier weight, arcs pushed outward so
the gaps stay open.

| Context | Arcs | Stroke | Axis |
| --- | --- | --- | --- |
| ≥ 44px (full) | 3 pairs (r20/r34/r48) + centre node | 2.4 (4 at 44px) | y 8 → 112 |
| 24–43px | 1 pair, r40 | 6 | y 16 → 104 |
| ≤ 16px | 1 pair, r46 (spread wider) | 6 | y 20 → 100 |

Small cuts drop the centre node — at 16px it fills in and reads as a blob.
Exact paths are in `exports/resonance-24px-simplified.svg` and `-16px-simplified.svg`.

### 5. Exploration board (`ACCORD VI Logo.dc.html`)
Documentation only. Dark board, `#161826`-family ground, cards at `#14151a` with
`1px solid #23252e` borders and 8px radius, Sora Light headings, section kickers at
12px / `0.28em` tracking / uppercase / 55% opacity. Turn 4 holds the two finalists
(4a "Six Node", 4b "Resonance" — 4b is the chosen mark); turn 3 holds the four
monoline candidates it came from. Rebuild this only if you need a public
brand-guidelines page.

## Interactions & Behavior
The identity is static; there are no interactions in the design. Two behaviours the
implementation should own:

- **Size switching.** The icon component picks its cut from the rendered size, not from
  a prop the caller has to remember: `size >= 44` → full, `24–43` → mid, `< 24` → small.
  Do this in code — a manually-chosen variant will drift.
- **Colourway switching.** Ink and ground come from one token pair, so a caller asks
  for `variant="brass"`, never for two separate colours.
- If the mark is ever animated (title sequence, loader), arcs should draw **outward
  from the axis**, inner pair first, ~120ms apart, `ease-out`. Never rotate the axis
  off vertical.

## State Management
None. The symbol is a pure presentational component: props `size` (number, default 24)
and `variant` (enum of the five colourway keys, default `bone`), plus an optional
`withPlate` boolean for the circular ground chip. No data fetching, no state.

## Design Tokens

**Brand ink / ground**
```
--accord-bone        #efece6   primary ink, also body text on dark
--accord-ink         #0e0f12   primary ground, also ink on k5
--accord-red-ink     #f3d9d2
--accord-red-ground  #5c1119
--accord-mint        #7fe3d0
--accord-mint-ground #101820
--accord-brass       #e0b455
```

**Board / UI neutrals**
```
--surface        #14151a   card
--surface-alt    #101116   swatch strip
--ground         #0e0f12   deep panel
--border         #23252e   card border / dividers
--plate-edge     #3a3c46   chip hairline on dark
--text           #efece6
--text-muted     #9a9aa8   body copy
--text-dim       #8f9099   labels
--text-faint     #6f7180   meta
```

**Typography** — Sora only (Google Fonts), weights 200 / 300.
```
display   42px / 1.1  / w200
card head 16px        / w400 / 0.16em / uppercase
body      14-17px / 1.6-1.65 / w300
kicker    12px / 0.28em / uppercase
label     11-13px / 0.14-0.18em
wordmark  34px / w300 / 0.34em      ACCORD
sub       13px / w300 / 0.4em       SIXTH EDITION
```

**Geometry**
```
grid          120 x 120 units
stroke        2.4 units (full), 6 units (simplified cuts)
linecap       round, always
radius        8px (cards)
clear space   18 units = 15% of the mark's width, all four sides
min size      16px screen / 6mm print
```

## Assets
Everything is vector, authored by hand in this project — no third-party or licensed
artwork, nothing to attribute.

- `exports/resonance-k{1..5}-*.svg` — five colourways, with ground plate
- `exports/resonance-k{1..5}-*-transparent.svg` — same inks, no plate (use these when
  the host surface supplies the background)
- `exports/resonance-24px-simplified.svg`, `-16px-simplified.svg` — small cuts
- `exports/README.txt` — the usage rules, condensed

Fonts are **not** embedded in any SVG: the symbol files contain no type at all, and any
lockup sent to print must have its wordmark converted to outlines. Load Sora from
Google Fonts for screen use.

Not yet produced, and worth generating during implementation: a favicon set
(16/32/180/512), a monochrome single-path version for embroidery, and CMYK/Pantone
values for `#e0b455` if brass goes to foil.

## Files
- `ACCORD VI Logo.dc.html` — the exploration board; turn 4 card `#4b` is the chosen
  mark, and the four cards in turn 3 show what it was chosen over
- `exports/` — the production SVG pack and its README
- `image-slot.js`, `support.js` — runtime for the HTML board only; **do not port**

## Implementation notes
1. Start from `exports/`. Inline the arc geometry into one icon component and drive
   ink/ground from the token pair — do not ship five separate image files.
2. Put the five colourways in the token layer, not in component code, so a new ground
   never invents a new ink.
3. Build the size threshold in, per "Interactions & Behavior" above.
4. Enforce clear space with the component's own padding (15% of width) so callers
   cannot crowd it.
5. Sanity check at 16px on both grounds before you call it done — that is where this
   mark fails first.
