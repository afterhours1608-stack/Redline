// ===========================
// REDLINE — Utility Helpers
// ===========================

/**
 * Format number as Indonesian Rupiah
 */
export function formatRupiah(amount) {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
}

/**
 * Debounce function
 */
export function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle(fn, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Setup Intersection Observer for scroll animations
 */
export function setupScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // Optionally unobserve after animation
          // observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.animate-on-scroll, .stagger-children').forEach((el) => {
    observer.observe(el);
  });

  return observer;
}

/**
 * Get URL search param
 */
export function getUrlParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/**
 * Set URL search params without reload
 */
export function setUrlParams(params) {
  const url = new URL(window.location);
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });
  window.history.replaceState({}, '', url);
}

/**
 * Generate star SVGs
 */
export function generateStars(rating, size = 16) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    } else if (i - 0.5 <= rating) {
      html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><defs><linearGradient id="half${i}"><stop offset="50%" stop-color="#F59E0B"/><stop offset="50%" stop-color="#E8E8E1"/></linearGradient></defs><path fill="url(#half${i})" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    } else {
      html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#E8E8E1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
  }
  return html;
}

/**
 * Show toast notification
 */
export function showToast(message, duration = 3000) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('active');
  });

  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Truncate text
 */
export function truncate(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
