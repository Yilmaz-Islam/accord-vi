// EmailJS configuration for the register/sponsor forms.
//
// Until PUBLIC_KEY below is filled in, both forms fall back to showing a
// placeholder "thanks" message without actually sending anything — see
// the guarded checks in main.js.
//
// To make this real (free, ~200 emails/month):
//   1. Sign up at https://www.emailjs.com/ and connect your email account
//      (Gmail/Outlook/etc.) under Email Services — note the Service ID.
//   2. Under Email Templates, create two templates:
//        - a "notification" template addressed to your own inbox, using
//          {{form_type}}, {{name}}, {{email}}, {{details}}, {{message}}
//        - a "confirmation" template addressed to {{email}} (the
//          submitter), e.g. "Hi {{name}}, thanks for your {{form_type}} —
//          we'll be in touch soon."
//   3. Under Account > General, copy your Public Key.
//   4. Paste all four values below.
window.EMAILJS_CONFIG = {
  publicKey: 'YqynHAMUMXnqxoAEx',
  serviceId: 'service_xnysqdr',
  notifyTemplateId: 'template_ylqze4n',
  confirmTemplateId: 'template_fvwx0sa'
};
