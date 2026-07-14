// contact.js: Contact form validation
// Demonstrates: form validation, event handling, DOM manipulation.

(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  if (!form) return;

  var fields = {
    cName:    { el: document.getElementById('cName'),    err: document.getElementById('err-cName') },
    cEmail:   { el: document.getElementById('cEmail'),    err: document.getElementById('err-cEmail') },
    cPhone:   { el: document.getElementById('cPhone'),    err: document.getElementById('err-cPhone') },
    cMessage: { el: document.getElementById('cMessage'),  err: document.getElementById('err-cMessage') }
  };

  var status = document.getElementById('formStatus');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var DIGITS_RE = /^\d+$/;

  function setError(field, message) {
    field.el.classList.toggle('invalid', !!message);
    field.err.textContent = message || '';
  }

  function validateName() {
    var v = fields.cName.el.value.trim();
    if (!v) { setError(fields.cName, 'Please enter your name.'); return false; }
    setError(fields.cName, '');
    return true;
  }

  function validateEmail() {
    var v = fields.cEmail.el.value.trim();
    if (!v) { setError(fields.cEmail, 'Please enter your email address.'); return false; }
    if (!EMAIL_RE.test(v)) { setError(fields.cEmail, 'That email address doesn\'t look right.'); return false; }
    setError(fields.cEmail, '');
    return true;
  }

  function validatePhone() {
    var v = fields.cPhone.el.value.trim();
    if (!v) { setError(fields.cPhone, 'Please enter your phone number.'); return false; }
    if (!DIGITS_RE.test(v)) { setError(fields.cPhone, 'Phone number should contain digits only.'); return false; }
    setError(fields.cPhone, '');
    return true;
  }

  function validateMessage() {
    var v = fields.cMessage.el.value.trim();
    if (!v) { setError(fields.cMessage, 'Please add a short message.'); return false; }
    setError(fields.cMessage, '');
    return true;
  }

  // live validation as the user leaves each field
  fields.cName.el.addEventListener('blur', validateName);
  fields.cEmail.el.addEventListener('blur', validateEmail);
  fields.cPhone.el.addEventListener('blur', validatePhone);
  fields.cMessage.el.addEventListener('blur', validateMessage);

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var validName    = validateName();
    var validEmail   = validateEmail();
    var validPhone   = validatePhone();
    var validMessage = validateMessage();

    var allValid = validName && validEmail && validPhone && validMessage;

    status.classList.remove('ok', 'err', 'show');

    if (!allValid) {
      status.textContent = 'Please fix the highlighted fields before sending.';
      status.classList.add('err', 'show');
      return;
    }

    // No backend is wired up yet, this simulates a successful send.
    status.textContent = 'Message sent. Thanks for reaching out, I\'ll reply soon.';
    status.classList.add('ok', 'show');
    form.reset();
  });
})();
