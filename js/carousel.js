/**
 * Carousel Module
 * Testimonials slider with auto-play, touch support, and accessibility
 */

window.Carousel = (function() {
  'use strict';

  let container = null;
  let slides = [];
  let dots = [];
  let prevBtn = null;
  let nextBtn = null;
  let current = 0;
  let autoPlayTimer = null;
  let isPlaying = true;
  let touchStartX = 0;
  let isRTL = false;

  const AUTOPLAY_DELAY = 5000;
  const SWIPE_THRESHOLD = 50;

  /**
   * Setup slides initial state
   */
  function setupSlides() {
    slides.forEach((slide, i) => {
      slide.style.display = 'none';
      slide.classList.remove('active');
      slide.setAttribute('aria-hidden', 'true');
      slide.setAttribute('tabindex', '-1');
    });
  }

  /**
   * Show specific slide
   */
  function showSlide(index) {
    // Wrap around
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    // Hide current
    slides[current].style.display = 'none';
    slides[current].classList.remove('active');
    slides[current].setAttribute('aria-hidden', 'true');

    // Show new
    current = index;
    slides[current].style.display = 'block';
    slides[current].classList.add('active');
    slides[current].setAttribute('aria-hidden', 'false');

    // Update dots
    updateDots();

    // Announce for screen readers
    announceSlide();
  }

  /**
   * Update dot indicators
   */
  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current);
    });
  }

  /**
   * Announce current slide for accessibility
   */
  function announceSlide() {
    let announcement = document.getElementById('carousel-announcement');
    if (!announcement) {
      announcement = document.createElement('div');
      announcement.id = 'carousel-announcement';
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      document.body.appendChild(announcement);
    }
    announcement.textContent = `Testimonial ${current + 1} of ${slides.length}`;
  }

  /**
   * Show next slide
   */
  function next() {
    showSlide(current + 1);
  }

  /**
   * Show previous slide
   */
  function prev() {
    showSlide(current - 1);
  }

  /**
   * Setup navigation buttons
   */
  function setupNavigation() {
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prev();
        pauseAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        next();
        pauseAutoPlay();
      });
    }
  }

  /**
   * Setup dot indicators
   */
  function setupDots() {
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        pauseAutoPlay();
      });

      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showSlide(i);
          pauseAutoPlay();
        }
      });

      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
    });
  }

  /**
   * Setup touch events
   */
  function setupTouch() {
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;

      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        if (diff > 0) {
          isRTL ? next() : prev();
        } else {
          isRTL ? prev() : next();
        }
        pauseAutoPlay();
      }
    }, { passive: true });
  }

  /**
   * Setup keyboard navigation
   */
  function setupKeyboard() {
    container.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          isRTL ? next() : prev();
          pauseAutoPlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          isRTL ? prev() : next();
          pauseAutoPlay();
          break;
        case 'Home':
          e.preventDefault();
          showSlide(0);
          pauseAutoPlay();
          break;
        case 'End':
          e.preventDefault();
          showSlide(slides.length - 1);
          pauseAutoPlay();
          break;
      }
    });
  }

  /**
   * Start auto-play
   */
  function startAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(next, AUTOPLAY_DELAY);
    isPlaying = true;
  }

  /**
   * Pause auto-play
   */
  function pauseAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
    isPlaying = false;

    // Resume after inactivity
    setTimeout(() => {
      if (!isPlaying) startAutoPlay();
    }, 10000);
  }

  /**
   * Setup hover pause
   */
  function setupHoverPause() {
    container.addEventListener('mouseenter', () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    });

    container.addEventListener('mouseleave', () => {
      if (isPlaying) startAutoPlay();
    });
  }

  /**
   * Initialize module
   */
  function init() {
    container = document.getElementById('testimonialsCarousel') ||
                document.querySelector('.testimonials-carousel');

    if (!container) {
      console.warn('Carousel container not found');
      return;
    }

    slides = Array.from(container.querySelectorAll('.testimonial-slide'));
    dots = Array.from(container.querySelectorAll('.dot'));
    prevBtn = container.querySelector('.testimonials-btn.prev, .carousel-prev');
    nextBtn = container.querySelector('.testimonials-btn.next, .carousel-next');

    if (slides.length === 0) {
      console.warn('No carousel slides found');
      return;
    }

    isRTL = document.documentElement.dir === 'rtl';

    setupSlides();
    setupNavigation();
    setupDots();
    setupTouch();
    setupKeyboard();
    setupHoverPause();

    // Show first slide
    showSlide(0);

    // Start auto-play
    startAutoPlay();

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pauseAutoPlay();
      } else if (isPlaying) {
        startAutoPlay();
      }
    });

    console.log('🎠 Carousel ready');
  }

  return {
    init,
    next,
    prev,
    showSlide,
    startAutoPlay,
    pauseAutoPlay
  };

})();
