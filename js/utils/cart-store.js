// ===========================
// REDLINE — Cart Store (localStorage)
// ===========================

const CART_KEY = 'redline_cart';

function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  dispatchCartUpdate(cart);
}

function dispatchCartUpdate(cart) {
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart, count: getCartCount(cart) } }));
}

export function getCartItems() {
  return getCart();
}

export function getCartCount(cart) {
  const items = cart || getCart();
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function getCartTotal() {
  const items = getCart();
  return items.reduce((sum, item) => {
    const price = item.salePrice || item.price;
    return sum + (price * item.qty);
  }, 0);
}

export function addToCart(product, size, color, qty = 1, variantPrice = null) {
  const cart = getCart();
  const key = `${product.id}-${size}-${color}`;

  const existing = cart.find(item => item.key === key);
  if (existing) {
    existing.qty += qty;
    // Update price if variant price changed
    if (variantPrice != null) {
      existing.price = variantPrice;
      existing.salePrice = null; // variant price takes priority
    }
  } else {
    cart.push({
      key,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: variantPrice != null ? variantPrice : product.price,
      salePrice: variantPrice != null ? null : product.salePrice,
      image: Array.isArray(product.images) ? product.images[0] : (product.images?.front || ''),
      size,
      color,
      qty,
    });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(key) {
  const cart = getCart().filter(item => item.key !== key);
  saveCart(cart);
  return cart;
}

export function updateCartQty(key, qty) {
  const cart = getCart();
  const item = cart.find(i => i.key === key);
  if (item) {
    item.qty = Math.max(1, qty);
  }
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function initCartListener(callback) {
  window.addEventListener('cart:updated', (e) => {
    callback(e.detail);
  });
  // Initial call
  const cart = getCart();
  callback({ cart, count: getCartCount(cart) });
}
