// ===========================
// REDLINE — Navbar Component
// ===========================

import { initCartListener } from '../utils/cart-store.js';

export function renderNavbar() {
  const nav = document.createElement('div');
  nav.id = 'site-header';
  nav.innerHTML = `
    <div class="announcement-bar" id="announcement-bar">
      Memuat...
    </div>
    <!-- Main Navigation -->
    <header class="navbar" id="navbar">
      <div class="navbar__inner container">
        <!-- Mobile menu toggle -->
        <button class="navbar__menu-toggle hide-desktop" id="menu-toggle" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <!-- Logo -->
        <a href="/" class="navbar__logo" style="align-items: center;">
          <img src="/images/redline_logo_new.png" alt="REDLINE" class="navbar__logo-img" id="nav-logo" style="height: 75px; width: auto; object-fit: contain; display: block;" />
          <span class="navbar__logo-text" id="nav-text" style="display: none;">REDLINE</span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="navbar__nav hide-mobile" id="main-nav">
          <div class="navbar__dropdown">
            <a href="/katalog.html?cat=kaos-pria" class="navbar__link">Kaos</a>
            <div class="navbar__dropdown-menu">
              <a href="/katalog.html" class="navbar__dropdown-item">Semua Produk</a>
              <a href="/katalog.html?cat=kaos-pria" class="navbar__dropdown-item">Kaos Pria</a>
              <a href="/katalog.html?cat=kaos-wanita" class="navbar__dropdown-item">Kaos Wanita</a>
              <a href="/katalog.html?cat=kaos-anak" class="navbar__dropdown-item">Kaos Anak</a>
            </div>
          </div>
          <a href="/katalog.html?cat=hoodie" class="navbar__link">Hoodie</a>
          <a href="/katalog.html?cat=topi" class="navbar__link">Topi</a>
          <a href="/katalog.html?cat=aksesori" class="navbar__link">Aksesori</a>
        </nav>

        <!-- Right actions -->
        <div class="navbar__actions">
          <!-- Search -->
          <button class="navbar__action-btn" id="search-toggle" aria-label="Cari">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          <!-- Account -->
          <a href="/akun.html" class="navbar__action-btn hide-mobile" aria-label="Akun">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </a>

          <!-- Cart -->
          <button class="navbar__action-btn navbar__cart-btn" id="cart-toggle" aria-label="Keranjang">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span class="navbar__cart-count" id="cart-count" style="display:none;">0</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Menu Drawer -->
    <div class="mobile-menu-overlay" id="mobile-menu-overlay"></div>
    <div class="mobile-menu" id="mobile-menu">
      <div class="mobile-menu__header">
        <span class="navbar__logo-text" style="font-size: 1.25rem;">REDLINE</span>
        <button class="mobile-menu__close" id="mobile-menu-close" aria-label="Tutup menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <nav class="mobile-menu__nav">
        <a href="/" class="mobile-menu__link">Home</a>
        <a href="/katalog.html" class="mobile-menu__link">Semua Produk</a>
        <a href="/katalog.html?cat=kaos-pria" class="mobile-menu__link">Kaos Pria</a>
        <a href="/katalog.html?cat=kaos-wanita" class="mobile-menu__link">Kaos Wanita</a>
        <a href="/katalog.html?cat=kaos-anak" class="mobile-menu__link">Kaos Anak</a>
        <a href="/katalog.html?cat=hoodie" class="mobile-menu__link">Hoodie</a>
        <a href="/katalog.html?cat=topi" class="mobile-menu__link">Topi</a>
        <a href="/katalog.html?cat=aksesori" class="mobile-menu__link">Aksesori</a>
        <div class="mobile-menu__divider"></div>
        <a href="/akun.html" class="mobile-menu__link">Akun Saya</a>
        <a href="/tentang.html" class="mobile-menu__link">Tentang Kami</a>
        <a href="/faq.html" class="mobile-menu__link">FAQ</a>
        <a href="/kontak.html" class="mobile-menu__link">Hubungi Kami</a>
      </nav>
    </div>

    <!-- Search Overlay -->
    <div class="search-overlay" id="search-overlay">
      <div class="search-overlay__inner container">
        <div class="search-overlay__header">
          <div class="search-overlay__form">
            <input type="text" class="search-overlay__input" id="search-input" placeholder="Search" autocomplete="off" />
            <span class="search-overlay__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
          </div>
          <button class="search-overlay__close" id="search-close" aria-label="Tutup pencarian">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="search-overlay__results" id="search-results"></div>
      </div>
    </div>
  `;

  document.body.prepend(nav);
  initNavbarEvents();
  initCartBadge();
  fetchNavSettings();
}

async function fetchNavSettings() {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    
    if (data.announcement) {
      const bar = document.getElementById('announcement-bar');
      if (bar) bar.innerText = data.announcement;
    } else {
      const bar = document.getElementById('announcement-bar');
      if (bar) bar.style.display = 'none';
    }

    // if (data.logo_url) {
    //   const logo = document.getElementById('nav-logo');
    //   const text = document.getElementById('nav-text');
    //   if (logo) {
    //     logo.src = data.logo_url.startsWith('http') ? data.logo_url : `${data.logo_url}`;
    //     logo.style.display = 'block';
    //     if (text) text.style.display = 'none';
    //   }
    // }
  } catch (err) {
    const bar = document.getElementById('announcement-bar');
    if (bar) bar.style.display = 'none';
  }
}

function initNavbarEvents() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-menu-overlay');
  const mobileClose = document.getElementById('mobile-menu-close');
  const searchToggle = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const cartToggle = document.getElementById('cart-toggle');

  // Sticky navbar on scroll
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  });

  // Scroll to top on navbar click
  navbar.addEventListener('click', (e) => {
    // Do not scroll if clicking a button or link inside navbar
    if (!e.target.closest('a') && !e.target.closest('button') && !e.target.closest('input')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Mobile menu
  menuToggle?.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
  });

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  };

  mobileClose?.addEventListener('click', closeMobileMenu);
  mobileOverlay?.addEventListener('click', closeMobileMenu);

  // Search overlay
  searchToggle?.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
    setTimeout(() => searchInput.focus(), 300);
  });

  const closeSearch = () => {
    searchOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    searchInput.value = '';
    document.getElementById('search-results').innerHTML = '';
  };

  searchClose?.addEventListener('click', closeSearch);

  searchOverlay?.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  // Search input
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) {
      document.getElementById('search-results').innerHTML = '';
      return;
    }
    // Dynamic import to avoid circular deps
    import('../data/products.js').then(({ searchProducts }) => {
      searchProducts(query).then(results => {
        renderSearchResults(results);
      });
    });
  });

  // Cart toggle
  cartToggle?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('cart:toggle'));
  });

  // Close search on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeMobileMenu();
    }
  });
}

function renderSearchResults(results) {
  const container = document.getElementById('search-results');
  if (results.length === 0) {
    container.innerHTML = '<p class="search-overlay__empty">Produk tidak ditemukan.</p>';
    return;
  }

  container.innerHTML = results.slice(0, 6).map(p => `
    <a href="/produk.html?slug=${p.slug}" class="search-result-item">
      <img src="${p.frontImage}" alt="${p.name}" class="search-result-item__img" loading="lazy" />
      <div class="search-result-item__info">
        <div class="search-result-item__name">${p.name}</div>
        <div class="search-result-item__price">${p.salePrice ? `<span class="price--sale">Rp ${new Intl.NumberFormat('id-ID').format(p.salePrice)}</span> <span class="price--original">Rp ${new Intl.NumberFormat('id-ID').format(p.price)}</span>` : `Rp ${new Intl.NumberFormat('id-ID').format(p.price)}`}</div>
      </div>
    </a>
  `).join('');
}

function initCartBadge() {
  initCartListener(({ count }) => {
    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  });
}
