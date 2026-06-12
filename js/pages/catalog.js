// ===========================
// REDLINE — Catalog Page Logic
// ===========================

import { getProducts } from '../data/products.js';
import { categories } from '../data/categories.js';
import { createProductCard } from '../components/product-card.js';
import { getUrlParam, setUrlParams } from '../utils/helpers.js';

let allProducts = [];
let filteredProducts = [];
let currentSort = 'newest';
let currentCategory = '';
let currentSizes = [];
let currentColors = [];
let currentPrices = [];
let isSaleOnly = false;

export async function initCatalogPage() {
  renderSkeleton();

  allProducts = await getProducts();
  filteredProducts = [...allProducts];

  // Read URL params
  currentCategory = getUrlParam('cat') || '';
  isSaleOnly = getUrlParam('sale') === 'true';
  currentSort = getUrlParam('sort') || 'newest';

  renderFilters();
  applyFilters();
  initSortDropdown();
  initMobileFilterToggle();
  updatePageTitle();
}

function updatePageTitle() {
  const titleEl = document.getElementById('catalog-title');
  if (!titleEl) return;

  if (isSaleOnly) {
    titleEl.textContent = 'Sale';
  } else if (currentCategory) {
    const cat = categories.find(c => c.id === currentCategory);
    titleEl.textContent = cat ? cat.name : 'Semua Produk';
  } else {
    titleEl.textContent = 'Semua Produk';
  }
}

function renderSkeleton() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;
  
  grid.innerHTML = Array(6).fill(0).map(() => `
    <div class="product-card skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-text skeleton-text--title"></div>
      <div class="skeleton-text skeleton-text--price"></div>
    </div>
  `).join('');
}

function renderFilters() {
  const sidebar = document.getElementById('catalog-filters');
  if (!sidebar) return;

  sidebar.innerHTML = `
    <div class="filter-group">
      <h4 class="filter-group__title">Kategori</h4>
      <div class="filter-group__options">
        <label class="filter-option">
          <input type="checkbox" name="cat" value="" ${!currentCategory ? 'checked' : ''} />
          <span>Semua</span>
        </label>
        ${categories.map(cat => `
          <label class="filter-option">
            <input type="checkbox" name="cat" value="${cat.id}" ${currentCategory === cat.id ? 'checked' : ''} />
            <span>${cat.name}</span>
            <span class="filter-option__count">${cat.count}</span>
          </label>
        `).join('')}
      </div>
    </div>

    <div class="filter-group">
      <h4 class="filter-group__title">Ukuran</h4>
      <div class="filter-sizes" id="filter-sizes">
        ${['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'].map(size => `
          <button class="filter-size-btn ${currentSizes.includes(size) ? 'active' : ''}" data-size="${size}">${size}</button>
        `).join('')}
      </div>
    </div>

    <div class="filter-group">
      <h4 class="filter-group__title">Warna</h4>
      <div class="filter-colors" id="filter-colors" style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
        ${[
          {name: 'Hitam', hex: '#111'}, 
          {name: 'Putih', hex: '#fff'}, 
          {name: 'Abu-abu', hex: '#666'}, 
          {name: 'Silver', hex: '#C0C0C0'}, 
          {name: 'Multi', hex: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'}
        ].map(c => `
          <button class="filter-color-btn ${currentColors.includes(c.name) ? 'active' : ''}" data-color="${c.name}" title="${c.name}" style="background: ${c.hex}; width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--color-border); cursor: pointer; transition: transform 0.2s;"></button>
        `).join('')}
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-option">
        <input type="checkbox" name="sale" ${isSaleOnly ? 'checked' : ''} />
        <span style="color: var(--color-danger); font-weight: 600;">Sale Only</span>
      </label>
    </div>
  `;

  // Category filter events
  sidebar.querySelectorAll('input[name="cat"]').forEach(input => {
    input.addEventListener('change', (e) => {
      sidebar.querySelectorAll('input[name="cat"]').forEach(i => { if (i !== e.target) i.checked = false; });
      currentCategory = e.target.value;
      setUrlParams({ cat: currentCategory || null });
      updatePageTitle();
      applyFilters();
    });
  });

  // Size filter events
  sidebar.querySelectorAll('.filter-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const size = btn.dataset.size;
      if (currentSizes.includes(size)) {
        currentSizes = currentSizes.filter(s => s !== size);
      } else {
        currentSizes.push(size);
      }
      applyFilters();
    });
  });

  // Color filter events
  sidebar.querySelectorAll('.filter-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const color = btn.dataset.color;
      if (currentColors.includes(color)) {
        currentColors = currentColors.filter(c => c !== color);
      } else {
        currentColors.push(color);
      }
      applyFilters();
    });
  });

  // Price filter events
  sidebar.querySelectorAll('input[name="price"]').forEach(input => {
    input.addEventListener('change', (e) => {
      const val = e.target.value;
      if (e.target.checked) {
        currentPrices.push(val);
      } else {
        currentPrices = currentPrices.filter(p => p !== val);
      }
      applyFilters();
    });
  });

  // Sale toggle
  sidebar.querySelector('input[name="sale"]')?.addEventListener('change', (e) => {
    isSaleOnly = e.target.checked;
    setUrlParams({ sale: isSaleOnly ? 'true' : null });
    applyFilters();
  });
}

function renderActiveFilters() {
  const container = document.getElementById('active-filters');
  if (!container) return;

  const activeTags = [];

  if (currentCategory) {
    const cat = categories.find(c => c.id === currentCategory);
    if (cat) {
      activeTags.push({ type: 'cat', value: currentCategory, label: cat.name });
    }
  }

  currentSizes.forEach(size => {
    activeTags.push({ type: 'size', value: size, label: `Ukuran: ${size}` });
  });

  currentColors.forEach(color => {
    activeTags.push({ type: 'color', value: color, label: `Warna: ${color}` });
  });

  currentPrices.forEach(price => {
    const [min, max] = price.split('-');
    let label = '';
    if (min === '0') label = `Di bawah Rp ${parseInt(max).toLocaleString('id-ID')}`;
    else if (max === '9999999') label = `Di atas Rp ${parseInt(min).toLocaleString('id-ID')}`;
    else label = `Rp ${parseInt(min).toLocaleString('id-ID')} - ${parseInt(max).toLocaleString('id-ID')}`;
    activeTags.push({ type: 'price', value: price, label });
  });

  if (isSaleOnly) {
    activeTags.push({ type: 'sale', value: 'true', label: 'Sale Only' });
  }

  if (activeTags.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';
  container.innerHTML = activeTags.map(tag => `
    <span class="active-filter-tag">
      ${tag.label}
      <button class="active-filter-remove" data-type="${tag.type}" data-value="${tag.value}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </span>
  `).join('') + `<button class="active-filter-clear">Hapus Semua</button>`;

  // Events for remove buttons
  container.querySelectorAll('.active-filter-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = btn.dataset.type;
      const value = btn.dataset.value;
      removeFilter(type, value);
    });
  });

  container.querySelector('.active-filter-clear')?.addEventListener('click', () => {
    currentCategory = '';
    currentSizes = [];
    currentColors = [];
    currentPrices = [];
    isSaleOnly = false;
    setUrlParams({ cat: null, sale: null });
    updatePageTitle();
    renderFilters(); // Update sidebar UI
    applyFilters();
  });
}

function removeFilter(type, value) {
  if (type === 'cat') {
    currentCategory = '';
    setUrlParams({ cat: null });
    updatePageTitle();
  } else if (type === 'size') {
    currentSizes = currentSizes.filter(s => s !== value);
  } else if (type === 'color') {
    currentColors = currentColors.filter(c => c !== value);
  } else if (type === 'price') {
    currentPrices = currentPrices.filter(p => p !== value);
  } else if (type === 'sale') {
    isSaleOnly = false;
    setUrlParams({ sale: null });
  }
  
  renderFilters(); // Sync sidebar checkboxes/buttons
  applyFilters();
}

function applyFilters() {
  filteredProducts = [...allProducts];

  // Category filter
  if (currentCategory) {
    filteredProducts = filteredProducts.filter(p => p.category === currentCategory || p.categoryId === currentCategory);
  }

  // Size filter
  if (currentSizes.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      currentSizes.some(size => p.sizes.includes(size))
    );
  }

  // Color filter
  if (currentColors.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      currentColors.some(color => p.colors.some(c => c.name === color))
    );
  }

  // Price filter
  if (currentPrices.length > 0) {
    filteredProducts = filteredProducts.filter(p => {
      const price = p.salePrice || p.price;
      return currentPrices.some(range => {
        const [min, max] = range.split('-');
        return price >= parseInt(min) && price <= parseInt(max);
      });
    });
  }

  // Sale filter
  if (isSaleOnly) {
    filteredProducts = filteredProducts.filter(p => p.salePrice !== null);
  }

  // Sort
  sortProducts();

  // Render
  renderProducts();
  renderActiveFilters();
  updateCount();
}

function sortProducts() {
  switch (currentSort) {
    case 'price-asc':
      filteredProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      break;
    case 'popular':
      filteredProducts.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      break;
    case 'newest':
    default:
      filteredProducts.sort((a, b) => {
        if(a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return b.id.localeCompare(a.id);
      });
      break;
  }
}

function renderProducts() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  if (filteredProducts.length === 0) {
    grid.innerHTML = `
      <div class="catalog-empty" style="grid-column: 1 / -1;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>Tidak ada produk yang ditemukan.</p>
        <button class="btn btn--outline btn--sm" onclick="document.querySelector('.active-filter-clear').click()" style="margin-top: var(--space-4);">Reset Filter</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = '';
  filteredProducts.forEach(product => {
    grid.appendChild(createProductCard(product));
  });
}

function updateCount() {
  const countEl = document.getElementById('catalog-count');
  if (countEl) {
    countEl.textContent = `Menampilkan ${filteredProducts.length} produk`;
  }
}

function initSortDropdown() {
  const sortSelect = document.getElementById('catalog-sort');
  if (!sortSelect) return;

  sortSelect.value = currentSort;
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    setUrlParams({ sort: currentSort });
    applyFilters();
  });
}

function initMobileFilterToggle() {
  const filterBtn = document.getElementById('mobile-filter-toggle');
  const sidebar = document.getElementById('catalog-filters');
  
  filterBtn?.addEventListener('click', () => {
    sidebar?.classList.toggle('mobile-open');
    document.body.classList.toggle('no-scroll');
  });
}
