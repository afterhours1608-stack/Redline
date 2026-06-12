// ===========================
// REDLINE — Cart Drawer Component
// ===========================

import { getCartItems, removeFromCart, updateCartQty, getCartTotal, initCartListener } from '../utils/cart-store.js';
import { formatRupiah } from '../utils/helpers.js';

export function renderCartDrawer() {
  const drawer = document.createElement('div');
  drawer.id = 'cart-drawer-wrap';
  drawer.innerHTML = `
    <div class="drawer-overlay" id="cart-overlay"></div>
    <div class="drawer" id="cart-drawer">
      <div class="drawer__header">
        <h3 class="drawer__title">Keranjang Belanja</h3>
        <button class="modal__close" id="cart-close" aria-label="Tutup keranjang">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="drawer__body" id="cart-items">
        <!-- Items rendered here -->
      </div>
      <div class="drawer__footer" id="cart-footer" style="display:none;">
        <div class="cart-drawer__subtotal">
          <span>Subtotal</span>
          <span class="font-semibold" id="cart-subtotal">Rp 0</span>
        </div>
        <p class="cart-drawer__note">Ongkos kirim dihitung saat checkout</p>
        <a href="/keranjang.html" class="btn btn--outline btn--full" style="margin-bottom: var(--space-2);">Lihat Keranjang</a>
        <a href="/checkout.html" class="btn btn--primary btn--full">Checkout</a>
      </div>
    </div>
  `;

  document.body.appendChild(drawer);
  initCartDrawerEvents();
  updateCartDrawer();
}

function initCartDrawerEvents() {
  const overlay = document.getElementById('cart-overlay');
  const closeBtn = document.getElementById('cart-close');

  const closeDrawer = () => {
    document.getElementById('cart-drawer').classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  };

  const openDrawer = () => {
    document.getElementById('cart-drawer').classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
  };

  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  // Listen for cart toggle
  window.addEventListener('cart:toggle', openDrawer);

  // Also open on add
  window.addEventListener('cart:updated', () => {
    updateCartDrawer();
  });
}

function updateCartDrawer() {
  const items = getCartItems();
  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  const subtotalEl = document.getElementById('cart-subtotal');

  if (items.length === 0) {
    footer.style.display = 'none';
    container.innerHTML = `
      <div class="cart-drawer__empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p class="cart-drawer__empty-text">Keranjang belanja kosong</p>
        <a href="/katalog.html" class="btn btn--primary btn--sm">Mulai Belanja</a>
      </div>
    `;
    return;
  }

  footer.style.display = 'block';
  subtotalEl.textContent = formatRupiah(getCartTotal());

  container.innerHTML = items.map(item => `
    <div class="cart-item" data-key="${item.key}">
      <img src="${item.image}" alt="${item.name}" class="cart-item__img" loading="lazy" />
      <div class="cart-item__info">
        <a href="/produk.html?slug=${item.slug}" class="cart-item__name">${item.name}</a>
        <div class="cart-item__variant">${item.size} / ${item.color}</div>
        <div class="cart-item__bottom">
          <div class="cart-item__qty">
            <button class="cart-item__qty-btn" data-action="decrease" data-key="${item.key}">−</button>
            <span class="cart-item__qty-value">${item.qty}</span>
            <button class="cart-item__qty-btn" data-action="increase" data-key="${item.key}">+</button>
          </div>
          <span class="cart-item__price">${formatRupiah((item.salePrice || item.price) * item.qty)}</span>
        </div>
      </div>
      <button class="cart-item__remove" data-remove="${item.key}" aria-label="Hapus">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  `).join('');

  // Event delegation
  container.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.remove);
      return;
    }

    const qtyBtn = e.target.closest('[data-action]');
    if (qtyBtn) {
      const key = qtyBtn.dataset.key;
      const item = items.find(i => i.key === key);
      if (!item) return;

      if (qtyBtn.dataset.action === 'increase') {
        updateCartQty(key, item.qty + 1);
      } else if (qtyBtn.dataset.action === 'decrease') {
        if (item.qty <= 1) {
          removeFromCart(key);
        } else {
          updateCartQty(key, item.qty - 1);
        }
      }
    }
  });
}
