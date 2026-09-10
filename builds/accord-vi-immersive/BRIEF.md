# BRIEF — Accord VI (Immersive)

Interviewed via structured multiple-choice (AskUserQuestion), 2026-09-09. Not
self-authored; not delegated — the eight topics below reflect the user's actual
selections, each with the option label they picked.

## 1. Vibe
**"Cinematic & prestige."** Selected over "Concert-night electric," "Warm &
communal," and "Raw & underground." Reads as: slower, moodier, film-poster
quality — treats Accord like a major cultural event, not just a school concert.
No external references were volunteered beyond the option's own framing.

## 2. Scroll journey (their words, via selection)
**"Countdown → Nights → Proof → Register."** Open on urgency (countdown/date),
reveal the two nights, prove it's real (past editions/stats), end on one action.
Selected over a night-by-night walkthrough and a legacy-first ordering.

## 3. Energy curve
**"Loud open, quiet turn, loud close."** Hits hard immediately, pulls back for
the credibility/story section, surges again to close.

## 4. Feeling curve stage-by-stage, and the peak
- **Countdown (open):** urgency / anticipation — a literal countdown to 18 Oct,
  loud.
- **The Two Nights (turn):** awe / clarity — the page physically divides into
  Night 1 and Night 2, quieter, deliberate, the visitor understands the
  offer.
- **Proof (substance):** trust — real numbers (6th year, 1,000–1,300
  attendees, 25–50K reach, 1,000+ tickets at Accord V), quiet but building.
- **Register (close):** resolve / commitment — loud again, one action.

**The peak, verbatim from selection:** "The two nights physically split apart"
— the screen dramatically divides into Night 1 (Live Concert) and Night 2
(Qawwali Night) as its own big reveal moment. Lives in the Two Nights act.

## 5. Signature move (seed)
**"Logo mark as a scroll scrubber."** Selected over a split-screen-as-mechanic
option and a countdown-drives-scroll option. Built as: the Resonance mark (the
event's own 6-arc identity symbol) is drawn arc-by-arc via
`stroke-dashoffset`, driven by whole-page scroll fraction — a bespoke global
progress variable, not any per-act `--sc-p` — so the mark is fully formed only
once the visitor reaches the close. Six arcs for the sixth edition; fully
resonant only at commitment. Persistent, fixed, present the entire page.

## 6. Aesthetic family
**Maximalist.** Selected over Premium-minimal, Editorial, and Dense. Per
taste.md's own table this is "earned by: culture brands, events, food, anything
abundant" — matches a 1,000+ attendee two-night concert far better than
restraint would.

## 7. Structure: one world, or distinct scenes
**Distinct scenes.** Selected explicitly over one continuous worldflight, with
the reasoning shown to the user at decision time: fits the four-beat journey
naturally as separate acts, far less fragile/expensive than an unbroken camera
flight.

## 8. Assets
**"Only what we already have."** Selected over generating new photoreal assets
and over supplying additional real footage. Confirmed inventory: the Resonance
mark (SVG, six colourways), the brand's navy/brass tokens and Sora/Inter
typefaces, and six licensed-free stock concert/crowd photographs already used
on the existing Accord VI site. No generation, no spend, no `KIE_AI_API_KEY`
needed for this build.

---

## The tell-someone sentence
**"It's the site where the two nights physically split the screen in half,
and the community's own six-arc mark finishes drawing itself just as you hit
register."**

## Authored silence
The pause between the Countdown act's close and the Two Nights act's opening
frame — a beat of near-black with the mark alone, not yet split, not yet
drawn past two arcs — is intentional silence, not dead scroll. It exists so
the divide that follows reads as a change of state rather than continuous
motion.

## Relationship to the existing Accord VI site
This build is a **second, independent site** — an immersive teaser/landing
experience. It does not replace or modify `Accord website/` (the existing
plain-HTML three-page site: `index.html`, `register.html`, `sponsor.html`).
The Register close act links out to the existing site's real registration
form rather than duplicating it, so the actual submission logic, conditional
attendee/sponsor fields, and event-info accuracy live in one place.
