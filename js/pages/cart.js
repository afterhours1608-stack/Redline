// ===========================
// REDLINE — Cart Page Logic
// ===========================

import { getCartItems, removeFromCart, updateCartQty, getCartTotal } from '../utils/cart-store.js';
import { formatRupiah } from '../utils/helpers.js';

export function initCartPage() {
  renderCart();
  window.addEventListener('cart:updated', renderCart);
}

function renderCart() {
  const container = document.getElementById('cart-container');
  if (!container) return;

  const items = getCartItems();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <h2 class="cart-empty__title">Keranjang Kosong</h2>
        <p class="cart-empty__text">Belum ada produk di keranjang belanja kamu</p>
        <a href="/katalog.html" class="btn btn--primary">Mulai Belanja</a>
      </div>
    `;
    return;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal >= 300000 ? 0 : 15000;
  const total = subtotal + shipping;

  container.innerHTML = `
    <div class="cart-layout">
      <div>
        <div class="cart-table">
          <div class="cart-table__header">
            <span>Produk</span>
            <span>Harga</span>
            <span>Jumlah</span>
            <span>Total</span>
            <span></span>
          </div>
          ${items.map(item => {
            const price = item.salePrice || item.price;
            return `
              <div class="cart-table__item">
                <div class="cart-table__product">
                  <img src="${item.image}" alt="${item.name}" class="cart-table__product-img" loading="lazy" />
                  <div>
                    <a href="/produk.html?slug=${item.slug}" class="cart-table__product-name">${item.name}</a>
                    <div class="cart-table__product-variant">${item.size} / ${item.color}</div>
                  </div>
                </div>
                <div class="cart-table__price">${formatRupiah(price)}</div>
                <div>
                  <div class="qty-selector">
                    <button class="qty-selector__btn" data-action="decrease" data-key="${item.key}">−</button>
                    <input type="number" class="qty-selector__value" value="${item.qty}" min="1" data-key="${item.key}" />
                    <button class="qty-selector__btn" data-action="increase" data-key="${item.key}">+</button>
                  </div>
                </div>
                <div class="cart-table__total">${formatRupiah(price * item.qty)}</div>
                <button class="cart-table__remove" data-remove="${item.key}" aria-label="Hapus">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="order-summary">
        <h3 class="order-summary__title">Ringkasan Pesanan</h3>
        <div class="promo-input">
          <input type="text" class="input" placeholder="Kode promo" />
          <button class="btn btn--outline btn--sm" onclick="alert('Kode promo berhasil!')">Terapkan</button>
        </div>
        <div class="order-summary__row">
          <span>Subtotal</span>
          <span>${formatRupiah(subtotal)}</span>
        </div>
        <div class="order-summary__row">
          <span>Estimasi Ongkir</span>
          <span>${shipping === 0 ? '<span style="color: var(--color-success)">GRATIS</span>' : formatRupiah(shipping)}</span>
        </div>
        ${shipping === 0 ? '<div class="order-summary__row" style="color: var(--color-success); font-size: var(--font-size-xs);">🎉 Free ongkir untuk pembelian di atas Rp 300.000!</div>' : ''}
        <div class="order-summary__row order-summary__row--total">
          <span>Total</span>
          <span>${formatRupiah(total)}</span>
        </div>
        <a href="/checkout.html" class="btn btn--primary btn--full btn--lg">Lanjut ke Checkout</a>
      </div>
    </div>
  `;

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
      } else {
        if (item.qty <= 1) removeFromCart(key);
        else updateCartQty(key, item.qty - 1);
      }
    }
  });
}
