// ===========================
// REDLINE — Product Detail Page Logic
// ===========================

import { getProductBySlug, getProducts } from '../data/products.js';
import { addToCart } from '../utils/cart-store.js';
import { formatRupiah, generateStars, showToast, getUrlParam } from '../utils/helpers.js';
import { createProductCard } from '../components/product-card.js';

let selectedSize = '';
let selectedColor = '';
let qty = 1;
let currentProduct = null;

export async function initProductPage() {
  const slug = getUrlParam('slug');
  if (!slug) {
    window.location.href = '/katalog.html';
    return;
  }

  const product = await getProductBySlug(slug);
  if (!product) {
    document.getElementById('pdp-container').innerHTML = `
      <div class="catalog-empty" style="padding: var(--space-20);">
        <h2>Produk tidak ditemukan</h2>
        <p class="text-secondary">Produk yang kamu cari tidak tersedia.</p>
        <a href="/katalog.html" class="btn btn--primary" style="margin-top: var(--space-4);">Lihat Katalog</a>
      </div>
    `;
    return;
  }

  currentProduct = product;
  selectedSize = product.sizes[0];
  selectedColor = product.colors[0]?.name || '';

  renderProduct(product);
  initGallery(product);
  initSizeOptions(product);
  initColorOptions(product);
  initQtySelector(product);
  initAddToCart(product);
  initTabs();
  initSizeGuide(product);
  await renderRelated(product);
}

function getCurrentVariantPrice(product) {
  // Try exact size-color match first
  const key = `${selectedSize}-${selectedColor}`;
  if (product.variantPrices && product.variantPrices[key] != null) {
    return product.variantPrices[key];
  }
  // Fallback to size-based price
  if (product.variantPricesBySize && product.variantPricesBySize[selectedSize] != null) {
    return product.variantPricesBySize[selectedSize];
  }
  // Fallback to base price
  return product.salePrice || product.price;
}

function updatePriceDisplay(product) {
  const priceEl = document.getElementById('pdp-current-price');
  const startFromEl = document.getElementById('pdp-start-from');
  if (!priceEl) return;

  const variantPrice = getCurrentVariantPrice(product);
  priceEl.textContent = formatRupiah(variantPrice);
  
  // Hide "Mulai dari" once user selects a size
  if (startFromEl) {
    startFromEl.style.display = 'none';
  }
}

function renderProduct(product) {
  const container = document.getElementById('pdp-container');

  // Update page title
  document.title = `${product.name} — REDLINE Truck Apparel`;

  // Breadcrumb
  const breadcrumb = document.getElementById('pdp-breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <a href="/">Home</a>
      <span class="separator">/</span>
      <a href="/katalog.html?cat=${product.category}">${product.categoryName}</a>
      <span class="separator">/</span>
      <span class="current">${product.name}</span>
    `;
  }

  // Price display logic
  const displayPrice = product.hasVariantPricing ? product.minPrice : (product.salePrice || product.price);
  const showStartFrom = product.hasVariantPricing;
  
  const discountPercent = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  const stockBadge = product.stock > 10
    ? `<span class="badge badge--stock">✓ Tersedia</span>`
    : product.stock > 0
    ? `<span class="badge badge--low-stock">⚠ Stok Terbatas (${product.stock} pcs)</span>`
    : `<span class="badge badge--out">✕ Habis</span>`;

  container.innerHTML = `
    <div class="pdp-layout">
      <!-- Gallery -->
      <div class="pdp-gallery">
        <div class="pdp-gallery__main" id="pdp-main-image">
          <img src="${product.images[0] || product.frontImage}" alt="${product.name}" id="pdp-main-img" />
        </div>
        <div class="pdp-gallery__thumbs" id="pdp-thumbs">
          ${product.images.map((url, i) => `
            <button class="pdp-gallery__thumb ${i === 0 ? 'active' : ''}" data-image="${url}">
              <img src="${url}" alt="${product.name} ${i+1}" loading="lazy" />
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Info -->
      <div class="pdp-info">
        ${product.badge ? `<div class="pdp-info__badges"><span class="badge badge--${product.badge === 'hot' ? 'hot' : product.badge === 'new' ? 'new' : product.badge === 'sale' ? 'sale' : 'limited'}">${product.badgeText}</span></div>` : ''}
        
        <h1 class="pdp-info__name">${product.name}</h1>

        <div class="pdp-info__rating">
          <div class="stars">${generateStars(product.rating)}</div>
          <span class="pdp-info__rating-text">${product.rating} (${product.reviewCount} ulasan)</span>
        </div>

        <div class="pdp-info__price">
          ${showStartFrom ? `<span class="pdp-info__start-from" id="pdp-start-from" style="font-size: 0.85rem; color: var(--color-text-secondary); margin-right: 4px;">Mulai dari</span>` : ''}
          <span class="pdp-info__price-current ${product.salePrice && !product.hasVariantPricing ? 'price--sale' : ''}" id="pdp-current-price">${formatRupiah(displayPrice)}</span>
          ${product.salePrice && !product.hasVariantPricing ? `
            <span class="pdp-info__price-original">${formatRupiah(product.price)}</span>
            <span class="pdp-info__price-discount">-${discountPercent}%</span>
          ` : ''}
        </div>

        <div class="pdp-info__stock">${stockBadge}</div>

        <!-- Size Option -->
        <div class="pdp-option">
          <div class="pdp-option__header">
            <span class="pdp-option__label">Ukuran: <span class="pdp-option__selected" id="selected-size">${selectedSize}</span></span>
            <button class="pdp-option__size-guide" id="size-guide-btn">Panduan Ukuran</button>
          </div>
          <div class="size-options" id="pdp-sizes">
            ${product.sizes.map((size, i) => {
              // Show price per size if variant pricing exists
              const sizePrice = product.variantPricesBySize?.[size];
              const priceLabel = product.hasVariantPricing && sizePrice ? ` — ${formatRupiah(sizePrice)}` : '';
              return `<button class="size-option ${i === 0 ? 'active' : ''}" data-size="${size}" title="${size}${priceLabel}">${size}</button>`;
            }).join('')}
          </div>
        </div>

        <!-- Color Option -->
        <div class="pdp-option">
          <div class="pdp-option__header">
            <span class="pdp-option__label">Warna: <span class="pdp-option__selected" id="selected-color">${selectedColor}</span></span>
          </div>
          <div class="color-swatches" id="pdp-colors">
            ${product.colors.map((color, i) => `
              <button class="color-swatch ${i === 0 ? 'active' : ''}" data-color="${color.name}" style="background-color: ${color.hex};" title="${color.name}" ${color.hex === '#FFFFFF' ? 'style="background-color: #FFFFFF; box-shadow: inset 0 0 0 1px var(--color-border);"' : ''}></button>
            `).join('')}
          </div>
        </div>

        <!-- Qty + Add to Cart -->
        <div class="pdp-actions">
          <div class="pdp-actions__row">
            <div class="pdp-actions__qty">
              <div class="qty-selector">
                <button class="qty-selector__btn" id="qty-decrease">−</button>
                <input type="number" class="qty-selector__value" id="qty-value" value="1" min="1" max="${product.stock}" />
                <button class="qty-selector__btn" id="qty-increase">+</button>
              </div>
            </div>
            <button class="btn btn--primary pdp-actions__add" id="add-to-cart" ${product.stock === 0 ? 'disabled' : ''}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              ${product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
            </button>
          </div>
          <a href="/checkout.html" class="btn btn--outline btn--full" id="buy-now" ${product.stock === 0 ? 'style="pointer-events:none;opacity:0.5;"' : ''}>Beli Langsung</a>
        </div>

        <!-- Share -->
        <div class="pdp-share">
          <span class="pdp-share__label">Bagikan:</span>
          <button class="pdp-share__btn" title="WhatsApp" onclick="window.open('https://wa.me/?text=${encodeURIComponent(product.name + ' - ' + window.location.href)}', '_blank')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </button>
          <button class="pdp-share__btn" title="Copy link" onclick="navigator.clipboard.writeText(window.location.href); alert('Link disalin!');">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </button>
        </div>

        <!-- Description Tabs -->
        <div class="pdp-tabs">
          <div class="tabs">
            <button class="tab active" data-tab="description">Deskripsi</button>
            <button class="tab" data-tab="reviews">Ulasan (${product.reviewCount})</button>
            <button class="tab" data-tab="shipping">Pengiriman</button>
          </div>

          <div class="tab-content active" id="tab-description">
            <div class="pdp-tab-content">
              <p>${product.description}</p>
              <h4>Material</h4>
              <p>${product.material}</p>
              <h4>Perawatan</h4>
              <p>${product.careInstructions}</p>
              <h4>Berat</h4>
              <p>${product.weight}g</p>
            </div>
          </div>

          <div class="tab-content" id="tab-reviews">
            <div class="pdp-tab-content">
              ${product.reviews.length > 0 ? product.reviews.map(r => `
                <div class="review-item">
                  <div class="review-item__header">
                    <span class="review-item__author">${r.name} — ${r.city}</span>
                    <span class="review-item__date">${new Date(r.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div class="review-item__stars">${generateStars(r.rating, 14)}</div>
                  <p class="review-item__text">${r.text}</p>
                </div>
              `).join('') : '<p>Belum ada ulasan untuk produk ini.</p>'}
            </div>
          </div>

          <div class="tab-content" id="tab-shipping">
            <div class="pdp-tab-content">
              <h4>Estimasi Pengiriman</h4>
              <p>Pengiriman ke seluruh Indonesia melalui JNE, J&T, Sicepat, dan Anteraja.</p>
              <p><strong>Pulau Jawa:</strong> 2-3 hari kerja</p>
              <p><strong>Luar Jawa:</strong> 3-7 hari kerja</p>
              <p><strong>Indonesia Timur:</strong> 5-10 hari kerja</p>
              <h4>Free Ongkir</h4>
              <p>Gratis ongkos kirim untuk pembelian di atas Rp 300.000 ke seluruh Indonesia!</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div class="related-products">
      <h2 class="section-title" style="margin-bottom: var(--space-8);">Produk Terkait</h2>
      <div class="grid grid--products" id="related-grid"></div>
    </div>
  `;
}

function initGallery(product) {
  const mainImg = document.getElementById('pdp-main-img');
  const mainWrap = document.getElementById('pdp-main-image');
  const thumbs = document.querySelectorAll('.pdp-gallery__thumb');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainImg.src = thumb.dataset.image;
    });
  });

  // Zoom on hover
  mainWrap?.addEventListener('mousemove', (e) => {
    const rect = mainWrap.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mainImg.style.transformOrigin = `${x}% ${y}%`;
  });
}

function initSizeOptions(product) {
  const sizeButtons = document.querySelectorAll('#pdp-sizes .size-option');
  const sizeLabel = document.getElementById('selected-size');

  sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
      if (sizeLabel) sizeLabel.textContent = selectedSize;
      
      // Update price display when size changes
      updatePriceDisplay(product);
    });
  });
}

function initColorOptions(product) {
  const colorSwatches = document.querySelectorAll('#pdp-colors .color-swatch');
  const colorLabel = document.getElementById('selected-color');

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      selectedColor = swatch.dataset.color;
      if (colorLabel) colorLabel.textContent = selectedColor;

      // Update price display when color changes
      updatePriceDisplay(product);
    });
  });
}

function initQtySelector(product) {
  const decreaseBtn = document.getElementById('qty-decrease');
  const increaseBtn = document.getElementById('qty-increase');
  const qtyInput = document.getElementById('qty-value');

  decreaseBtn?.addEventListener('click', () => {
    if (qty > 1) {
      qty--;
      qtyInput.value = qty;
    }
  });

  increaseBtn?.addEventListener('click', () => {
    if (qty < product.stock) {
      qty++;
      qtyInput.value = qty;
    }
  });

  qtyInput?.addEventListener('change', (e) => {
    let val = parseInt(e.target.value) || 1;
    val = Math.max(1, Math.min(product.stock, val));
    qty = val;
    qtyInput.value = qty;
  });
}

function initAddToCart(product) {
  const addBtn = document.getElementById('add-to-cart');
  const buyNowBtn = document.getElementById('buy-now');

  addBtn?.addEventListener('click', () => {
    const variantPrice = getCurrentVariantPrice(product);
    addToCart(product, selectedSize, selectedColor, qty, variantPrice);
    showToast(`${product.name} (${selectedSize}, ${selectedColor}) ditambahkan ke keranjang!`);
    window.dispatchEvent(new CustomEvent('cart:toggle'));
  });

  buyNowBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const variantPrice = getCurrentVariantPrice(product);
    addToCart(product, selectedSize, selectedColor, qty, variantPrice);
    window.location.href = '/checkout.html';
  });
}

function initTabs() {
  const tabs = document.querySelectorAll('.pdp-tabs .tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('active');
    });
  });
}

function initSizeGuide(product) {
  const btn = document.getElementById('size-guide-btn');
  btn?.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal__header">
          <h3 class="modal__title">Panduan Ukuran</h3>
          <button class="modal__close" aria-label="Tutup">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal__body">
          <p style="margin-bottom: var(--space-4); color: var(--color-text-secondary); font-size: var(--font-size-sm);">Semua ukuran dalam centimeter (CM). Ukur dari seam ke seam.</p>
          <table class="size-chart-table">
            <thead>
              <tr><th>Ukuran</th><th>Lebar Dada</th><th>Panjang</th><th>Lebar Bahu</th></tr>
            </thead>
            <tbody>
              <tr><td>S</td><td>48</td><td>68</td><td>42</td></tr>
              <tr><td>M</td><td>50</td><td>70</td><td>44</td></tr>
              <tr><td>L</td><td>53</td><td>72</td><td>46</td></tr>
              <tr><td>XL</td><td>56</td><td>74</td><td>48</td></tr>
              <tr><td>2XL</td><td>59</td><td>76</td><td>50</td></tr>
              <tr><td>3XL</td><td>62</td><td>78</td><td>52</td></tr>
              <tr><td>4XL</td><td>65</td><td>80</td><td>54</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // Force reflow to enable smooth CSS transition
    overlay.offsetHeight;
    overlay.classList.add('active');

    const close = () => { 
      overlay.classList.remove('active');
      document.body.classList.remove('no-scroll'); 
      setTimeout(() => overlay.remove(), 300);
    };
    overlay.querySelector('.modal__close').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.body.classList.add('no-scroll');
  });
}

async function renderRelated(product) {
  const grid = document.getElementById('related-grid');
  if (!grid) return;

  const allProducts = await getProducts();
  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  if (related.length === 0) {
    // Fallback: show random products
    const fallback = allProducts.filter(p => p.id !== product.id).slice(0, 4);
    fallback.forEach(p => grid.appendChild(createProductCard(p)));
  } else {
    related.forEach(p => grid.appendChild(createProductCard(p)));
  }
}
