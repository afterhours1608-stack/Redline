// ===========================
// REDLINE — Product Card Component
// ===========================

import { formatRupiah } from '../utils/helpers.js';

export function createProductCard(product, options = {}) {
  const { showQuickAdd = true } = options;
  const displayPrice = product.salePrice || product.price;

  const card = document.createElement('a');
  card.className = 'product-card';
  card.href = `/produk.html?slug=${product.slug}`;

  let badgeHtml = '';
  if (product.badge) {
    const badgeClass = {
      hot: 'badge--hot',
      new: 'badge--new',
      sale: 'badge--sale',
      limited: 'badge--limited',
    }[product.badge] || '';
    badgeHtml = `<div class="product-card__badges"><span class="badge ${badgeClass}">${product.badgeText}</span></div>`;
  }

  let quickAddHtml = '';
  if (showQuickAdd) {
    quickAddHtml = `
      <div class="product-card__quick-add">
        <button class="btn btn--primary btn--full btn--sm" data-quick-add="${product.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Tambah ke Keranjang
        </button>
      </div>
    `;
  }

  card.innerHTML = `
    <div class="product-card__image-wrap hover-zoom">
      ${badgeHtml}
      <img class="product-card__image product-card__image--front" src="${product.frontImage}" alt="${product.name}" loading="lazy" />
      <img class="product-card__image product-card__image--back" src="${product.backImage}" alt="${product.name} belakang" loading="lazy" />
      ${quickAddHtml}
    </div>
    <div class="product-card__info">
      <div class="product-card__name">${product.name}</div>
      <div class="product-card__price">
        ${product.salePrice
          ? `<span class="product-card__price-current price--sale">${formatRupiah(product.salePrice)}</span>
             <span class="product-card__price-original">${formatRupiah(product.price)}</span>`
          : `<span class="product-card__price-current">${formatRupiah(product.price)}</span>`
        }
      </div>
    </div>
  `;

  // Quick add click handler
  if (showQuickAdd) {
    card.addEventListener('click', (e) => {
      const quickAddBtn = e.target.closest('[data-quick-add]');
      if (quickAddBtn) {
        e.preventDefault();
        e.stopPropagation();
        import('../utils/cart-store.js').then(({ addToCart }) => {
          addToCart(product, product.sizes[0], product.colors[0]?.name || 'Default', 1);
          import('../utils/helpers.js').then(({ showToast }) => {
            showToast(`${product.name} ditambahkan ke keranjang!`);
          });
        });
      }
    });
  }

  return card;
}

export function createProductGrid(products, container, options = {}) {
  container.innerHTML = '';
  products.forEach(product => {
    container.appendChild(createProductCard(product, options));
  });
}
