# AUDIT v1 (2026-10-23)
Round: new date, 30-second songs, compression, device-aware wording, back buttons, button sizes,
loading screen. The previous version is safe in git (commit a00759b). Nothing here is pushed yet.

## What changed
- **Date:** every mention moved to Saturday 21 and Sunday 22 November 2026 (72 places on 13 site files,
  plus the worker's emails and ticket labels). The countdown now counts to midnight Pakistan time.
  Terms "last updated" set to 23 October 2026; the worker's terms version bumped to 2026-10-23.
- **Songs:** each artist track is now the loudest 30 seconds of the song (usually the hook), evened
  out in volume, with a short fade in and out so the loop doesn't jump. 2.4–3.3 MB each became 0.47 MB.
- **Compression:** fonts converted to compressed web fonts with only Latin characters
  (1,315 KB down to 406 KB, all weights kept); artist photos from PNG to JPEG (391 KB down to 54 KB).
- **Device-aware:** "Tap" on phones, "Click"/"Hover" with a mouse (lineup, artist reveal, home,
  register receipt upload, account). Form boxes are 16px so iPhones no longer zoom in when tapped.
- **Back button:** a back arrow at the top-left of all 10 inner pages (icon on phones, "Back" on
  desktop). It returns to the previous page, or goes home (or to the lineup) if opened directly.
  The two old in-page "Back to the lineup" links were removed so there is one back button.
- **Buttons:** one scale: main buttons 52px, small pills 44px, account tabs 48px. Home closing
  buttons now read "Register →" / "Sponsor →" on one line (full wording kept for screen readers).
- **Loading screen:** the Accord mark draws ring by ring, the wordmark settles, then it fades
  (about 0.9 s, never more than 1.8 s), once per visit, gentler with Reduce Motion turned on.
- **Small fixes:** tab icon added to the 3 lineup pages (was a console error).

## What was checked
- 13 pages at phone (375×812, touch) and desktop (1280×800) in headless Chrome: no sideways
  scroll, back button in the same spot on every inner page, only the new dates, button heights only
  44/48/52, compressed fonts load everywhere, no console errors.
- Home closing buttons at 10 widths (320–1600 px): all 52px, no overflow.
- Loading screen filmed at full speed and at 1/10 speed: dot, line, rings, wordmark, fade.
- All 17 scripts parse; the three song clips are 30.0 s.

## What was NOT verified
- Not tested on a real iPhone or Android phone, or with Reduce Motion turned on.
- The song clips were picked by loudness, not by ear; listen to check each starts somewhere sensible.
- Worker date changes are not deployed and its tests were not re-run (no logic changed, text only).
- Admin and gate pages were left alone (staff tools); signed-in account screens not re-checked.
