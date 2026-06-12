// ===========================
// REDLINE — Homepage Logic
// ===========================

import { getFeaturedProducts, getSaleProducts } from '../data/products.js';
import { categories } from '../data/categories.js';
import { testimonials } from '../data/testimonials.js';
import { createProductCard } from '../components/product-card.js';
import { generateStars, setupScrollAnimations } from '../utils/helpers.js';

export async function initHomePage() {
  try { await renderSettings(); } catch(e) { console.error(e); }
  try { await renderFeaturedProducts(); } catch(e) { console.error(e); }
  try { await renderCategories(); } catch(e) { console.error(e); }
  try { renderTestimonials(); } catch(e) { console.error(e); }
  try { await renderSaleProducts(); } catch(e) { console.error(e); }
  
  setupScrollAnimations();
}

async function renderSettings() {
  try {
    const res = await fetch('http://localhost:5000/api/settings');
    const data = await res.json();
    
    // Update Hero
    const heroTitle = document.querySelector('.hero__title');
    const heroTagline = document.querySelector('.hero__subtitle');
    const heroSection = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero__bg');
    
    if (data.hero_title && heroTitle) heroTitle.innerText = data.hero_title;
    if (data.hero_tagline && heroTagline) heroTagline.innerText = data.hero_tagline;
    if (data.banner_url) {
      const bannerUrl = data.banner_url.startsWith('http') ? data.banner_url : `http://localhost:5000${data.banner_url}`;
      if (heroBg) heroBg.style.backgroundImage = `url('${bannerUrl}')`;
      else if (heroSection) heroSection.style.backgroundImage = `url('${bannerUrl}')`;
    }

    // Flash sale
    const flashSaleSection = document.getElementById('flash-sale-section');
    if (flashSaleSection) {
      if (data.flashSale && data.flashSale.isActive) {
        flashSaleSection.style.display = 'block';
        const fsTitle = document.querySelector('#flash-sale-section .section-title');
        if (data.flashSale.title && fsTitle) fsTitle.innerText = data.flashSale.title;
        renderFlashSaleCountdown(new Date(data.flashSale.endTime));
      } else {
        flashSaleSection.style.display = 'none';
      }
    }
  } catch (err) {
    console.error("Failed to load settings", err);
  }
}

async function renderFeaturedProducts() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;

  const featured = await getFeaturedProducts();
  featured.forEach(product => {
    grid.appendChild(createProductCard(product));
  });
}

async function renderSaleProducts() {
  const grid = document.getElementById('sale-grid');
  if (!grid) return;

  const sale = await getSaleProducts();
  sale.forEach(product => {
    grid.appendChild(createProductCard(product));
  });
}

import { getProducts } from '../data/products.js';

async function renderCategories() {
  const grid = document.getElementById('category-grid');
  if (!grid) return;

  const allProducts = await getProducts();

  grid.innerHTML = categories.map(cat => {
    const catProducts = allProducts.filter(p => p.category === cat.id);
    const count = catProducts.length;
    
    // Skip empty categories
    if (count === 0) return '';
    
    const imageToUse = catProducts[0].frontImage || cat.image;

    return `
      <a href="/katalog.html?cat=${cat.id}" class="category-card animate-on-scroll">
        <img src="${imageToUse}" alt="${cat.name}" class="category-card__image" loading="lazy" />
        <div class="category-card__overlay"></div>
        <div class="category-card__content">
          <div class="category-card__name">${cat.name}</div>
          <div class="category-card__count">${count} produk</div>
        </div>
      </a>
    `;
  }).filter(html => html !== '').join('');
}

function renderFlashSaleCountdown(endDate) {
  const container = document.getElementById('flash-countdown');
  if (!container) return;

  function updateCountdown() {
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      container.innerHTML = '<span class="countdown-item__label">Flash Sale Berakhir</span>';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    container.innerHTML = `
      <div class="countdown-item">
        <span class="countdown-item__value">${String(days).padStart(2, '0')}</span>
        <span class="countdown-item__label">Hari</span>
      </div>
      <span class="countdown-separator">:</span>
      <div class="countdown-item">
        <span class="countdown-item__value">${String(hours).padStart(2, '0')}</span>
        <span class="countdown-item__label">Jam</span>
      </div>
      <span class="countdown-separator">:</span>
      <div class="countdown-item">
        <span class="countdown-item__value">${String(minutes).padStart(2, '0')}</span>
        <span class="countdown-item__label">Menit</span>
      </div>
      <span class="countdown-separator">:</span>
      <div class="countdown-item">
        <span class="countdown-item__value">${String(seconds).padStart(2, '0')}</span>
        <span class="countdown-item__label">Detik</span>
      </div>
    `;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function renderTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  grid.innerHTML = testimonials.slice(0, 3).map(t => `
    <div class="testimonial-card animate-on-scroll">
      <div class="testimonial-card__stars">
        ${generateStars(t.rating)}
      </div>
      <p class="testimonial-card__text">"${t.text}"</p>
      <div class="testimonial-card__author">
        <img src="${t.avatar}" alt="${t.name}" class="testimonial-card__avatar" loading="lazy" />
        <div>
          <div class="testimonial-card__name">${t.name}</div>
          <div class="testimonial-card__city">${t.city}</div>
        </div>
      </div>
    </div>
  `).join('');
}
