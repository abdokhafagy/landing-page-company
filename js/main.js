/**
 * Main Application Module
 * Summit Edge Consulting - Landing Page
 * Initializes all components and manages application state
 */

(function() {
  'use strict';

  /**
   * Initialize all modules in order
   */
  function initModules() {
    const moduleList = [
      'Utils',
      'DarkModeToggle',
      'LanguageToggle',
      'Navigation',
      'Portfolio',
      'Carousel',
      'ContactForm'
    ];

    moduleList.forEach(name => {
      try {
        if (window[name] && typeof window[name].init === 'function') {
          window[name].init();
          console.log(`✅ ${name} initialized`);
        }
      } catch (error) {
        console.error(`❌ Error initializing ${name}:`, error);
      }
    });
  }

  /**
   * Setup scroll reveal animations
   */
  function setupRevealAnimations() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  /**
   * Setup page loader
   */
  function setupLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          loader.classList.add('fade-out');
          setTimeout(() => loader.remove(), 500);
        }, 300);
      });
    }
    document.body.classList.add('loaded');
  }

  /**
   * DOM ready handler
   */
  function onReady() {
    console.log('🚀 Initializing Summit Edge App...');
    
    setupLoader();
    initModules();
    setupRevealAnimations();

    console.log('🎉 Application ready!');
    
    window.dispatchEvent(new CustomEvent('appReady'));
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

})();
