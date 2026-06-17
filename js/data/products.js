// ===========================
// REDLINE — API Products Data
// ===========================

const API_URL = '/api/products';

let cachedProducts = null;

export async function fetchAllProducts() {
  if (cachedProducts) return cachedProducts;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Network response was not ok');
    cachedProducts = await res.json();
    
    // Normalize format from backend to match frontend expectations
    cachedProducts = cachedProducts.map(p => {
      let badgeType = '';
      if (p.badge) {
        if (p.badge.toLowerCase() === 'sale') badgeType = 'sale';
        else if (p.badge.toLowerCase() === 'terlaris') badgeType = 'hot';
        else if (p.badge.toLowerCase() === 'baru') badgeType = 'new';
        else if (p.badge.toLowerCase() === 'limited') badgeType = 'limited';
        else badgeType = 'new';
      }

      // Calculate variant prices map: { "size-color": price }
      const variantPrices = {};
      const variantPricesBySize = {};
      p.variants.forEach(v => {
        const key = `${v.size}-${v.color}`;
        variantPrices[key] = v.price != null ? v.price : p.price;
        // Track price per size (for display)
        if (!variantPricesBySize[v.size]) {
          variantPricesBySize[v.size] = v.price != null ? v.price : p.price;
        }
      });

      // Calculate min/max price from all variants
      const allPrices = p.variants.map(v => v.price != null ? v.price : p.price);
      const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : p.price;
      const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : p.price;
      const hasVariantPricing = minPrice !== maxPrice;

      return {
        ...p,
        badge: badgeType,
        badgeText: p.badge,
        categoryName: p.category ? p.category.name : p.categoryId,
        category: p.category ? p.category.slug : p.categoryId,
        sizes: [...new Set(p.variants.map(v => v.size))],
        colors: [...new Set(p.variants.map(v => v.color))].map(c => ({ name: c, hex: c === 'Hitam' ? '#111' : (c === 'Abu-abu' ? '#666' : '#fff') })),
        stock: p.variants.reduce((acc, v) => acc + v.stock, 0),
        images: Array.isArray(p.images) ? p.images.filter(img => img).map(img => img.startsWith('http') ? img : `${img}`) : [],
        frontImage: Array.isArray(p.images) && p.images[0] ? (p.images[0].startsWith('http') ? p.images[0] : '' + p.images[0]) : '',
        backImage: Array.isArray(p.images) && p.images[1] ? (p.images[1].startsWith('http') ? p.images[1] : '' + p.images[1]) : (Array.isArray(p.images) && p.images[0] ? (p.images[0].startsWith('http') ? p.images[0] : '' + p.images[0]) : ''),
        reviews: [],
        // Pricing
        minPrice,
        maxPrice,
        hasVariantPricing,
        variantPrices,        // { "S-Hitam": 150000, "M-Hitam": 175000, ... }
        variantPricesBySize,  // { "S": 150000, "M": 175000, ... }
        displayPrice: minPrice, // Show lowest price by default
      };
    });
    return cachedProducts;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProducts() {
  return await fetchAllProducts();
}

export async function getProductBySlug(slug) {
  const products = await fetchAllProducts();
  return products.find(p => p.slug === slug);
}

export async function getProductById(id) {
  const products = await fetchAllProducts();
  return products.find(p => p.id === id);
}

export async function getProductsByCategory(category) {
  const products = await fetchAllProducts();
  return products.filter(p => p.category === category);
}

export async function getFeaturedProducts() {
  const products = await fetchAllProducts();
  // Filter by badge to only show featured items, then sort by newest
  const featured = products.filter(p => p.badge === 'hot' || p.badge === 'new' || p.badge === 'limited');
  return featured.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
}

export async function getSaleProducts() {
  const products = await fetchAllProducts();
  return products.filter(p => p.salePrice !== null && p.salePrice > 0);
}

export async function searchProducts(query) {
  const products = await fetchAllProducts();
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.description && p.description.toLowerCase().includes(q)) ||
    (p.categoryName && p.categoryName.toLowerCase().includes(q))
  );
}
