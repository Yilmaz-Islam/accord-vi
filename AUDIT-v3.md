# AUDIT v3 (2026-10-24)
Round: the 200-emails-a-month limit. The owner is moving EmailJS to the $9 plan (2,000 emails a month).
This round adds a bot check and cuts one email per registration. Local only; nothing pushed or deployed.

## What changed
- **"Are you human" check (Cloudflare Turnstile)** on sign-up, "Send the code again" and the sponsor form.
  Most people see nothing; Cloudflare only shows a tick box when it is unsure. On narrow phones the box is
  the square version so it never spills out of the form. The worker refuses those three requests without a
  valid token once `TURNSTILE_SECRET` is set, so a bot can no longer use up the email allowance.
- **Organisers' morning summary:** one email at 09:00 Pakistan time with the last 24 hours of registrations
  (name, email, pass, price, payment method, receipt), how many still wait for a payment check, and totals
  confirmed so far. No email on a day with nothing new and nothing waiting. Sponsor interest still emails
  the organisers straight away.
- **Emails per registration:** 4 → 3 (code, "we got it", "payment confirmed"), plus about 1 summary a day.
  On the $9 plan that is roughly 600 registrations a month.
- Privacy Policy names Cloudflare Turnstile; "Last updated" is now 24 October 2026.

## What was checked
- All 266 earlier worker checks still pass, plus 9 new summary checks and 5 human-check checks, run with
  Cloudflare's always-pass and always-fail test keys.
- The sign-up page at phone size: the check runs invisibly, its token reaches the worker, and the code
  screen opens. The visible box (forced with the test key) fits at 360px and 414px wide. No sideways
  scrolling, no console errors, all scripts parse.

## What was NOT verified / still needed
- **The check is OFF until the owner creates the Turnstile widget** (Cloudflare dashboard, free) and adds
  the keys. The steps are in the worker repo's ACCOUNTS.md.
- The real summary email was not sent; its layout depends on the EmailJS notify template.
- The sponsor form was not submitted end to end (it talks to the live worker even on localhost).
- Not tested on a real phone.

# Part 2: the official ACCORD 6.0 sponsorship letter (same day)
Handed over from the owner's other session. Dates stay 21–22 November (the letter's 13–14 Nov are old).

## What changed
- **Sponsor packages** now match the letter exactly: Gold PKR 500,000, Silver PKR 300,000, Bronze PKR 150,000,
  with the letter's own lists. Diamond, Platinum, the "Most popular" and "Title sponsor" badges and
  "Custom / à la carte" are gone (sponsor page cards, sponsor form menu, registration tier chips, page descriptions).
- **Real contacts** replace the placeholder: accord22@bh.edu.pk, 0302 7778889 and 0303 2338989 (tap to call)
  on the sponsor page, Terms and Privacy.
- **Venue:** "Beaconhouse Cantt Campus, Askari Bypass Road, Multan" everywhere, in map links, Google's event
  data and the worker's emails.
- **Who it's for:** BSS and non-BSS students in classes VI to XI (ages 11 to 17); parents and guests can still
  register. Schedule activities are "Science, Business and Agility". A Formal Dinner note (day to be confirmed).
- **Name:** visible text says "Accord 6.0". The logo, the loading screen, the bank account title on the
  register page and the logo's screen-reader label still say "Accord VI". Emails now say "Accord 6.0".
- Terms and Privacy "Last updated 24 October 2026"; the worker's TERMS_VERSION is 2026-10-24.

## Checked
- All 13 pages at phone and desktop size: no sideways scrolling, no console errors, no old dates.
- Screenshots of the new packages (phone and desktop), the contact list and the schedule.
- All 275 worker checks pass with the new name, address and terms version.

## Not done / watch
- The schedule still carries its "based on last year" tag, because the times are still last year's.
- EmailJS's own "From name" setting (in the EmailJS dashboard) may still say "Accord VI".
- Not seen on a real phone.
