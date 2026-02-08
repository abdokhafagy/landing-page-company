/**
 * Portfolio Module
 * Handles project filtering, search, and modal display
 */

window.Portfolio = (function() {
  'use strict';

  let filterBtns = [];
  let cards = [];
  let modal = null;
  let activeFilter = 'all';

  /**
   * Setup filtering
   */
  function setupFiltering() {
    filterBtns.forEach(btn => {
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');

      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        setActiveFilter(filter);
        filterCards(filter);
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  /**
   * Set active filter button
   */
  function setActiveFilter(filter) {
    activeFilter = filter;

    filterBtns.forEach(btn => {
      const isActive = btn.getAttribute('data-filter') === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
  }

  /**
   * Filter portfolio cards
   */
  function filterCards(filter) {
    cards.forEach((card, i) => {
      const category = card.getAttribute('data-category');
      const show = filter === 'all' || category === filter;

      setTimeout(() => {
        if (show) {
          card.style.display = 'block';
          card.classList.remove('hidden');
          card.removeAttribute('aria-hidden');
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          card.classList.add('hidden');
          card.setAttribute('aria-hidden', 'true');
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      }, i * 50);
    });

    // Screen reader announcement
    announceChange(filter);
  }

  /**
   * Announce filter change for accessibility
   */
  function announceChange(filter) {
    let announcement = document.getElementById('portfolio-announcement');
    if (!announcement) {
      announcement = document.createElement('div');
      announcement.id = 'portfolio-announcement';
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      document.body.appendChild(announcement);
    }

    const count = cards.filter(c => 
      filter === 'all' || c.getAttribute('data-category') === filter
    ).length;

    announcement.textContent = `Showing ${count} projects`;
  }

  /**
   * Setup modal functionality
   */
  function setupModal() {
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    // View details buttons
    cards.forEach(card => {
      const btn = card.querySelector('.view-details, [data-modal-trigger]');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openModal(card);
        });
      }
    });

    // Close handlers
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    if (overlay) {
      overlay.addEventListener('click', closeModal);
    }

    // Keyboard close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  /**
   * Open modal with project details
   */
  function openModal(card) {
    if (!modal) return;

    // Get project data
    const title = card.querySelector('.card-title')?.textContent || '';
    const category = card.querySelector('.card-category')?.textContent || '';
    const image = card.querySelector('img')?.src || '';

    // Populate modal
    const modalTitle = modal.querySelector('.modal-title');
    const modalCategory = modal.querySelector('.modal-category');
    const modalImage = modal.querySelector('.modal-image');

    if (modalTitle) modalTitle.textContent = title;
    if (modalCategory) modalCategory.textContent = category;
    if (modalImage) modalImage.src = image;

    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Focus trap
    const focusable = modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) {
      focusable[0].focus();
    }
  }

  /**
   * Close modal
   */
  function closeModal() {
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  /**
   * Initialize module
   */
  function init() {
    filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
    cards = Array.from(document.querySelectorAll('.portfolio-card'));
    modal = document.getElementById('projectModal');

    if (cards.length === 0) {
      console.warn('No portfolio cards found');
      return;
    }

    setupFiltering();
    setupModal();

    // Set initial state
    setActiveFilter('all');

    console.log('🖼️ Portfolio ready');
  }

  return {
    init,
    filter: filterCards,
    openModal,
    closeModal
  };

})();
