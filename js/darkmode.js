/**
 * Dark Mode Toggle Module
 * Handles theme switching with localStorage persistence
 */

window.DarkModeToggle = (function() {
  'use strict';

  let themeBtn = null;
  let currentTheme = 'light';

  /**
   * Get preferred theme from storage or system
   */
  function getPreferredTheme() {
    const saved = localStorage.getItem('summit-theme');
    if (saved) return saved;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Apply theme to document
   */
  function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('summit-theme', theme);
    
    updateButton();
    
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme }
    }));
  }

  /**
   * Update button icon and aria-label
   */
  function updateButton() {
    if (!themeBtn) return;

    const icon = themeBtn.querySelector('i');
    if (icon) {
      if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
        themeBtn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        icon.className = 'fas fa-moon';
        themeBtn.setAttribute('aria-label', 'Switch to dark mode');
      }
    }

    themeBtn.setAttribute('aria-checked', currentTheme === 'dark');
  }

  /**
   * Toggle theme
   */
  function toggle() {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  }

  /**
   * Handle keyboard events
   */
  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  }

  /**
   * Watch for system theme changes
   */
  function watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('summit-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /**
   * Initialize module
   */
  function init() {
    themeBtn = document.getElementById('themeToggle') || 
               document.querySelector('[data-theme-toggle]') ||
               document.querySelector('.theme-toggle');

    if (!themeBtn) {
      console.warn('Theme toggle button not found');
      return;
    }

    // Set initial theme
    setTheme(getPreferredTheme());

    // Setup accessibility
    themeBtn.setAttribute('role', 'switch');
    themeBtn.setAttribute('tabindex', '0');

    // Event listeners
    themeBtn.addEventListener('click', toggle);
    themeBtn.addEventListener('keydown', handleKeydown);

    // Watch system changes
    watchSystemTheme();

    // Sync across tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'summit-theme' && e.newValue) {
        setTheme(e.newValue);
      }
    });

    console.log('🌙 Dark Mode: ' + currentTheme);
  }

  return {
    init,
    setTheme,
    toggle,
    getTheme: () => currentTheme
  };

})();
