// Accord VI — site interactions
// Mobile nav toggle, countdown, FAQ accordion, and registration form handling.
// Shared across index.html / register.html / sponsor.html — every block below
// guards for missing elements since no single page has all of them.

// Email verification worker — see accord-vi-verify-worker/.
// prod: swap for the deployed worker's real URL once ALLOWED_ORIGINS there
// includes the production site origin too.
const VERIFY_WORKER_URL = 'https://accord-vi-verify.accordbccmvi.workers.dev';

// Shared two-step flow for the register and sponsor forms: submitting stage 1
// asks the worker to email a 6-digit code, then reveals stage 2 for entering
// it. Only a correct code makes the worker send the real notification to us —
// junk/typo'd emails never reach our inbox.
function setNote(note, text, kind) {
  note.textContent = text;
  note.classList.remove('is-error', 'is-success');
  if (kind) note.classList.add(kind);
}

function wireEmailForm({ form, note, stage1, stage2, codeInput, verifyBtn, buildDetails }) {
  const emailField = form.querySelector('[name="email"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const detailsField = form.querySelector('[name="details"]');
    if (detailsField && buildDetails) detailsField.value = buildDetails();

    const payload = Object.fromEntries(new FormData(form).entries());
    setNote(note, 'Sending you a verification code…');
    submitBtn.disabled = true;

    fetch(`${VERIFY_WORKER_URL}/request-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) throw new Error(data.error || 'Could not send code');
        setNote(note, `We've emailed a code to ${emailField.value}. Enter it below to confirm.`, 'is-success');
        stage1.hidden = true;
        stage2.hidden = false;
        codeInput.focus();
      })
      .catch((err) => {
        setNote(note, err.message || 'Something went wrong — please try again.', 'is-error');
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });

  verifyBtn.addEventListener('click', () => {
    const code = codeInput.value.trim();
    if (!code) {
      setNote(note, 'Enter the 6-digit code first.', 'is-error');
      return;
    }
    setNote(note, 'Checking…');
    verifyBtn.disabled = true;

    fetch(`${VERIFY_WORKER_URL}/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailField.value, code })
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) throw new Error(data.error || 'Incorrect code');
        setNote(note, "Thanks — you're confirmed! We've received this.", 'is-success');
        stage2.hidden = true;
        form.reset();
      })
      .catch((err) => {
        setNote(note, err.message || 'Incorrect code — please try again.', 'is-error');
      })
      .finally(() => {
        verifyBtn.disabled = false;
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 600,
    easing: 'ease-out',
    once: true,
    offset: 60,
    disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  });

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the mobile menu after tapping a link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Countdown to Accord VI (18 Oct 2026, local time) — index.html and register.html
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');

  if (cdDays && cdHours && cdMins && cdSecs) {
    const countdownTarget = new Date('2026-10-18T00:00:00');

    function updateCountdown() {
      const diff = countdownTarget - new Date();
      if (diff <= 0) {
        cdDays.textContent = cdHours.textContent = cdMins.textContent = cdSecs.textContent = '0';
        return;
      }
      const s = Math.floor(diff / 1000);
      cdDays.textContent = Math.floor(s / 86400);
      cdHours.textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, '0');
      cdMins.textContent = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      cdSecs.textContent = String(s % 60).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // FAQ accordion — index.html
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (faqQuestions.length) {
    faqQuestions.forEach((btn) => {
      const answer = btn.nextElementSibling;
      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        faqQuestions.forEach((other) => {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        });
        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  // Registration form — register.html only
  const form = document.getElementById('contactForm');
  if (form) {
    wireEmailForm({
      form,
      note: document.getElementById('formNote'),
      stage1: document.getElementById('registerStage1'),
      stage2: document.getElementById('registerStage2'),
      codeInput: document.getElementById('registerCode'),
      verifyBtn: document.getElementById('registerVerifyBtn'),
      buildDetails: () => {
        const school = document.getElementById('school')?.value || '—';
        const count = document.getElementById('attendeeCount')?.value || '—';
        return `School/group: ${school} | Attendees: ${count}`;
      }
    });
  }

  // Sponsorship inquiry form — sponsor.html only
  const sponsorForm = document.getElementById('sponsorForm');
  if (sponsorForm) {
    wireEmailForm({
      form: sponsorForm,
      note: document.getElementById('sponsorFormNote'),
      stage1: document.getElementById('sponsorStage1'),
      stage2: document.getElementById('sponsorStage2'),
      codeInput: document.getElementById('sponsorCode'),
      verifyBtn: document.getElementById('sponsorVerifyBtn'),
      buildDetails: () => {
        const company = document.getElementById('company')?.value || '—';
        const tier = document.getElementById('tier')?.value || 'not sure yet';
        return `Company: ${company} | Tier: ${tier}`;
      }
    });
  }
});
