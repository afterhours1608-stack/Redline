// ===========================
// REDLINE — Main Entry
// Shared initialization for all pages
// ===========================

import '../css/variables.css';
import '../css/reset.css';
import '../css/typography.css';
import '../css/layout.css';
import '../css/components.css';
import '../css/animations.css';

// Navbar & Footer styles (inline with components)
import '../css/navbar.css';
import '../css/footer.css';
import '../css/cart-drawer.css';

import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { renderCartDrawer } from './components/cart-drawer.js';
import { setupScrollAnimations } from './utils/helpers.js';

// Init shared components
document.addEventListener('DOMContentLoaded', () => {
  // Trigger entrance animation
  requestAnimationFrame(() => {
    document.body.classList.add('is-ready');
  });

  renderNavbar();
  renderCartDrawer();
  renderFooter();
  setupScrollAnimations();

  // Sleek Page Transition Interceptor
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    
    // Only intercept internal links
    if (link && link.href && link.hostname === window.location.hostname && link.target !== '_blank' && !link.hash) {
      // Don't intercept if modifier keys are pressed (open in new tab)
      if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey) return;
      
      e.preventDefault();
      
      // Trigger exit animation
      document.body.classList.add('is-animating-out');
      
      // Navigate after animation completes (matches CSS transition duration)
      setTimeout(() => {
        window.location.href = link.href;
      }, 500);
    }
  });
});
