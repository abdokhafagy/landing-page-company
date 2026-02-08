/**
 * Contact Form Module
 * Handles form validation and submission
 */

window.ContactForm = (function() {
  'use strict';

  let form = null;
  let submitBtn = null;
  let successMessage = null;

  // Validation patterns
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  };

  // Error messages
  const messages = {
    en: {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
      minLength: 'Minimum {min} characters required',
      success: 'Message sent successfully! We will contact you soon.'
    },
    ar: {
      required: 'هذا الحقل مطلوب',
      email: 'يرجى إدخال بريد إلكتروني صحيح',
      phone: 'يرجى إدخال رقم هاتف صحيح',
      minLength: 'الحد الأدنى {min} أحرف',
      success: 'تم إرسال الرسالة بنجاح! سنتواصل معك قريبًا.'
    }
  };

  /**
   * Get current language
   */
  function getLang() {
    return document.documentElement.lang || 'en';
  }

  /**
   * Get error message
   */
  function getMsg(key, params = {}) {
    const lang = getLang();
    let msg = messages[lang]?.[key] || messages.en[key] || key;
    
    Object.keys(params).forEach(k => {
      msg = msg.replace(`{${k}}`, params[k]);
    });
    
    return msg;
  }

  /**
   * Validate single field
   */
  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    const required = field.hasAttribute('required');
    const minLength = field.getAttribute('minlength');

    let error = '';

    // Required check
    if (required && !value) {
      error = getMsg('required');
    }
    // Email validation
    else if (type === 'email' && value && !patterns.email.test(value)) {
      error = getMsg('email');
    }
    // Phone validation
    else if (type === 'tel' && value && !patterns.phone.test(value)) {
      error = getMsg('phone');
    }
    // Min length
    else if (minLength && value.length < parseInt(minLength)) {
      error = getMsg('minLength', { min: minLength });
    }

    showFieldError(field, error);
    return !error;
  }

  /**
   * Show field error
   */
  function showFieldError(field, error) {
    const wrapper = field.closest('.form-group') || field.parentElement;
    let errorEl = wrapper.querySelector('.field-error');

    if (error) {
      field.classList.add('invalid');
      field.classList.remove('valid');
      field.setAttribute('aria-invalid', 'true');

      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.setAttribute('role', 'alert');
        wrapper.appendChild(errorEl);
      }
      errorEl.textContent = error;
    } else {
      field.classList.remove('invalid');
      field.classList.add('valid');
      field.removeAttribute('aria-invalid');

      if (errorEl) {
        errorEl.remove();
      }
    }
  }

  /**
   * Validate entire form
   */
  function validateForm() {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    fields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Handle form submission
   */
  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      // Focus first invalid field
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '...';

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      showSuccess();
      form.reset();
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = originalText;

      // Clear validation states
      form.querySelectorAll('.valid, .invalid').forEach(el => {
        el.classList.remove('valid', 'invalid');
      });
    }, 1500);
  }

  /**
   * Show success message
   */
  function showSuccess() {
    if (successMessage) {
      successMessage.classList.add('active');
      successMessage.textContent = getMsg('success');
      
      setTimeout(() => {
        successMessage.classList.remove('active');
      }, 5000);
    } else {
      // Create toast notification
      const toast = document.createElement('div');
      toast.className = 'toast-notification success';
      toast.setAttribute('role', 'alert');
      toast.textContent = getMsg('success');
      document.body.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.add('show');
      });

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 5000);
    }
  }

  /**
   * Setup real-time validation
   */
  function setupRealTimeValidation() {
    const fields = form.querySelectorAll('input, textarea, select');

    fields.forEach(field => {
      // Validate on blur
      field.addEventListener('blur', () => validateField(field));

      // Clear error on input
      field.addEventListener('input', () => {
        if (field.classList.contains('invalid')) {
          validateField(field);
        }
      });
    });
  }

  /**
   * Initialize module
   */
  function init() {
    form = document.getElementById('contactForm') ||
           document.querySelector('.contact-form');

    if (!form) {
      console.warn('Contact form not found');
      return;
    }

    submitBtn = form.querySelector('[type="submit"]');
    successMessage = document.querySelector('.form-success');

    // Event listeners
    form.addEventListener('submit', handleSubmit);
    setupRealTimeValidation();

    // Add novalidate for custom validation
    form.setAttribute('novalidate', '');

    console.log('📝 Contact form ready');
  }

  return {
    init,
    validate: validateForm
  };

})();
