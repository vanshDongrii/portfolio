// ---------------------------------------------
// Mobile nav toggle (accessible: aria-expanded, focus management)
// ---------------------------------------------
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? 'Close menu' : 'Menu';
  });

  // Close menu on Escape
  nav.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
      toggle.focus();
    }
  });
})();

// ---------------------------------------------
// Accessible contact form validation
// Announces errors via aria-live, moves focus to first invalid field
// ---------------------------------------------
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusEl = document.getElementById('form-status');

  function setError(field, message) {
    var wrapper = field.closest('.form-field');
    var errorEl = document.getElementById(field.getAttribute('data-error-target'));
    wrapper.classList.add('has-error');
    field.setAttribute('aria-invalid', 'true');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(field) {
    var wrapper = field.closest('.form-field');
    var errorEl = document.getElementById(field.getAttribute('data-error-target'));
    wrapper.classList.remove('has-error');
    field.setAttribute('aria-invalid', 'false');
    if (errorEl) errorEl.textContent = '';
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = form.querySelectorAll('[data-required]');
    var firstInvalid = null;

    fields.forEach(function (field) {
      var value = field.value.trim();
      var valid = true;

      if (value === '') {
        valid = false;
        setError(field, 'This field is required.');
      } else if (field.type === 'email' && !isValidEmail(value)) {
        valid = false;
        setError(field, 'Enter a valid email address.');
      } else {
        clearError(field);
      }

      if (!valid && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      statusEl.textContent = 'There was a problem with your submission. Please check the highlighted fields.';
      statusEl.className = 'form-status is-visible';
      statusEl.style.background = '#F5E1DE';
      statusEl.style.color = '#A3312A';
      return;
    }

    // Simulated success (no backend wired up in this static skeleton)
    form.reset();
    statusEl.textContent = 'Thanks — your message has been noted. This is a static demo, so no email was actually sent.';
    statusEl.className = 'form-status is-visible success';
    statusEl.focus();
  });
})();
