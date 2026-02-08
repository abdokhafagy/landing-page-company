/**
 * Navigation Module
 * Handles sticky nav, scrollspy, hamburger menu, and smooth scrolling
 */

window.Navigation = (function() {
  'use strict';

  let header = null;
  let navLinks = null;
  let hamburger = null;
  let navContainer = null;
  let sections = [];
  let activeLink = null;

  /**
   * Setup sticky header
   */
  function setupStickyHeader() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    header.classList.toggle('scrolled', window.scrollY > 50);
  }

  /**
   * Setup scroll spy
   */
  function setupScrollSpy() {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateActiveLink(entry.target.id);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  /**
   * Update active navigation link
   */
  function updateActiveLink(sectionId) {
    if (activeLink) {
      activeLink.classList.remove('active');
      activeLink.removeAttribute('aria-current');
    }

    const link = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
    if (link) {
      activeLink = link;
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  }

  /**
   * Setup smooth scrolling
   */
  function setupSmoothScroll() {
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);

        if (target) {
          closeMobileMenu();

          const headerHeight = header ? header.offsetHeight : 80;
          const targetPos = target.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });

          history.replaceState(null, null, `#${targetId}`);

          // Accessibility: focus target after scroll
          setTimeout(() => {
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
          }, 500);
        }
      });
    });
  }

  /**
   * Setup mobile menu
   */
  function setupMobileMenu() {
    if (!hamburger || !navContainer) return;

    hamburger.addEventListener('click', toggleMobileMenu);

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navContainer.classList.contains('active')) {
        closeMobileMenu();
        hamburger.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navContainer.classList.contains('active') &&
          !navContainer.contains(e.target) &&
          !hamburger.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  /**
   * Toggle mobile menu
   */
  function toggleMobileMenu() {
    const isOpen = navContainer.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    navContainer.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  /**
   * Handle initial hash in URL
   */
  function handleInitialHash() {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          const headerHeight = header ? header.offsetHeight : 80;
          window.scrollTo({
            top: target.offsetTop - headerHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }

  /**
   * Initialize module
   */
  function init() {
    header = document.getElementById('header');
    navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    hamburger = document.getElementById('hamburger');
    navContainer = document.getElementById('navLinks');
    sections = Array.from(document.querySelectorAll('section[id]'));

    if (!header) {
      console.warn('Header not found');
      return;
    }

    setupStickyHeader();
    setupScrollSpy();
    setupSmoothScroll();
    setupMobileMenu();
    handleInitialHash();

    console.log('🧭 Navigation ready');
  }

  return {
    init,
    closeMobileMenu
  };

})();
