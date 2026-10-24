# AUDIT v2 (2026-10-23)
Round: the client's colour pick applied across the site. Builds on v1 (same day). Nothing pushed yet.

## What changed
- **Theme:** Turquoise & Gold with Deep teal. Deep teal (#0F8F87) now leads: buttons, eyebrow labels,
  headings' highlight words, countdown, links, focus rings, selected states, prices, stats, logo rings,
  lineup card art, the Platinum tier's shimmer, the sticky bottom bars and the loading screen rings.
- **Gold (#E0B455) is the partner:** the "VI" in the logo and loading screen, "Most popular" badge,
  placeholder tags, account chips and the playing-card letters on the lineup.
- **Gold kept where it carries meaning:** the Gold sponsor tier, "pending payment" colours in admin and
  account, avatar colour choices, admin search highlights, the gold sparkle dust on the lineup.
- **Readability fixes that came with it:** buttons fade from a lighter teal into #0F8F87 (a darker end
  would have made the dark button text unreadable); dark text on the Title sponsor badge.
- **Also:** the staff-access popup, admin and gate focus rings and the gate scanner frame are teal; the
  worker's emails use teal for the button and header (needs a worker deploy). 404 links left-aligned.

## What was checked
- 10 public pages at phone size: every text colour measured against its background. The only failure
  (Title sponsor badge, 4.36:1) was fixed; the home "Accord" flag is the gradient lettering, not a fault.
- Screenshots of every page: no gold left in brand roles, logo reads "Accord" white + "VI" gold.
- No sideways scrolling, no console errors, all scripts parse.

## What was NOT verified
- Not seen on a real phone; colours on real screens (especially cheap Android panels) can look different.
- Admin and gate pages only checked for leftover gold in the code, not visually signed in.
- Emails not re-sent (worker not deployed).
