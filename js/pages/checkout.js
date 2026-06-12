// ===========================
// REDLINE — Checkout Page Logic
// ===========================

import { getCartItems, getCartTotal, clearCart } from '../utils/cart-store.js';
import { formatRupiah } from '../utils/helpers.js';

let currentStep = 1;
let selectedCourier = 'jne-reg';
let selectedPayment = 'qris';
let shippingCost = 15000;
let orderForm = {
  name: '', phone: '', email: '', address: '', province: '', city: '', district: '', zip: ''
};

export function initCheckoutPage() {
  const items = getCartItems();
  if (items.length === 0) {
    document.getElementById('checkout-container').innerHTML = `
      <div class="checkout-success">
        <h2 style="margin-bottom: var(--space-4);">Keranjang Kosong</h2>
        <p class="text-secondary" style="margin-bottom: var(--space-6);">Tambahkan produk ke keranjang sebelum checkout.</p>
        <a href="/katalog.html" class="btn btn--primary">Mulai Belanja</a>
      </div>
    `;
    return;
  }

  renderStep1();
  renderOrderSummary();
}

function renderSteps() {
  return `
    <div class="checkout-steps">
      <div class="checkout-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}">
        <span class="checkout-step__num">${currentStep > 1 ? '✓' : '1'}</span>
        <span class="hide-mobile">Pengiriman</span>
      </div>
      <div class="checkout-step__separator ${currentStep > 1 ? 'completed' : ''}"></div>
      <div class="checkout-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}">
        <span class="checkout-step__num">${currentStep > 2 ? '✓' : '2'}</span>
        <span class="hide-mobile">Pembayaran</span>
      </div>
      <div class="checkout-step__separator ${currentStep > 2 ? 'completed' : ''}"></div>
      <div class="checkout-step ${currentStep >= 3 ? 'active' : ''}">
        <span class="checkout-step__num">3</span>
        <span class="hide-mobile">Konfirmasi</span>
      </div>
    </div>
  `;
}

function renderStep1() {
  const main = document.getElementById('checkout-main');
  currentStep = 1;

  main.innerHTML = `
    ${renderSteps()}
    <div class="checkout-section">
      <h3 class="checkout-section__title">Informasi Pengiriman</h3>
      <div class="checkout-form-grid">
        <div class="input-group">
          <label>Nama Lengkap *</label>
          <input type="text" class="input" id="ship-name" placeholder="Nama lengkap" value="${orderForm.name}" required />
        </div>
        <div class="input-group">
          <label>Nomor HP *</label>
          <input type="tel" class="input" id="ship-phone" placeholder="08xxxxxxxxxx" value="${orderForm.phone}" required />
        </div>
        <div class="input-group full-width">
          <label>Email *</label>
          <input type="email" class="input" id="ship-email" placeholder="email@contoh.com" value="${orderForm.email}" required />
        </div>
        <div class="input-group full-width">
          <label>Alamat Lengkap *</label>
          <textarea class="input" id="ship-address" placeholder="Jalan, nomor rumah, RT/RW" rows="3" required>${orderForm.address}</textarea>
        </div>
        <div class="input-group">
          <label>Provinsi *</label>
          <select class="input" id="ship-province">
            <option value="">Pilih Provinsi</option>
            <option ${orderForm.province === 'DKI Jakarta' ? 'selected' : ''}>DKI Jakarta</option>
            <option ${orderForm.province === 'Jawa Barat' ? 'selected' : ''}>Jawa Barat</option>
            <option ${orderForm.province === 'Jawa Tengah' ? 'selected' : ''}>Jawa Tengah</option>
            <option ${orderForm.province === 'Jawa Timur' ? 'selected' : ''}>Jawa Timur</option>
            <option ${orderForm.province === 'DI Yogyakarta' ? 'selected' : ''}>DI Yogyakarta</option>
            <option ${orderForm.province === 'Banten' ? 'selected' : ''}>Banten</option>
            <option ${orderForm.province === 'Sumatera Utara' ? 'selected' : ''}>Sumatera Utara</option>
            <option ${orderForm.province === 'Sumatera Barat' ? 'selected' : ''}>Sumatera Barat</option>
            <option ${orderForm.province === 'Sumatera Selatan' ? 'selected' : ''}>Sumatera Selatan</option>
            <option ${orderForm.province === 'Bali' ? 'selected' : ''}>Bali</option>
            <option ${orderForm.province === 'Kalimantan Timur' ? 'selected' : ''}>Kalimantan Timur</option>
            <option ${orderForm.province === 'Sulawesi Selatan' ? 'selected' : ''}>Sulawesi Selatan</option>
          </select>
        </div>
        <div class="input-group">
          <label>Kota/Kabupaten *</label>
          <input type="text" class="input" id="ship-city" placeholder="Kota/Kabupaten" value="${orderForm.city}" required />
        </div>
        <div class="input-group">
          <label>Kecamatan</label>
          <input type="text" class="input" id="ship-district" placeholder="Kecamatan" value="${orderForm.district}" />
        </div>
        <div class="input-group">
          <label>Kode Pos *</label>
          <input type="text" class="input" id="ship-zip" placeholder="Kode pos" value="${orderForm.zip}" required />
        </div>
      </div>
    </div>

    <div class="checkout-section">
      <h3 class="checkout-section__title">Pilih Kurir</h3>
      <div class="courier-options">
        <label class="courier-option selected" data-courier="jne-reg">
          <div class="courier-option__left">
            <input type="radio" name="courier" class="courier-option__radio" value="jne-reg" checked />
            <div>
              <div class="courier-option__name">JNE REG</div>
              <div class="courier-option__time">Estimasi 2-3 hari</div>
            </div>
          </div>
          <div class="courier-option__price">${formatRupiah(15000)}</div>
        </label>
        <label class="courier-option" data-courier="jne-yes">
          <div class="courier-option__left">
            <input type="radio" name="courier" class="courier-option__radio" value="jne-yes" />
            <div>
              <div class="courier-option__name">JNE YES</div>
              <div class="courier-option__time">Estimasi 1-2 hari</div>
            </div>
          </div>
          <div class="courier-option__price">${formatRupiah(25000)}</div>
        </label>
        <label class="courier-option" data-courier="jnt">
          <div class="courier-option__left">
            <input type="radio" name="courier" class="courier-option__radio" value="jnt" />
            <div>
              <div class="courier-option__name">J&T Express</div>
              <div class="courier-option__time">Estimasi 2-4 hari</div>
            </div>
          </div>
          <div class="courier-option__price">${formatRupiah(13000)}</div>
        </label>
        <label class="courier-option" data-courier="sicepat">
          <div class="courier-option__left">
            <input type="radio" name="courier" class="courier-option__radio" value="sicepat" />
            <div>
              <div class="courier-option__name">SiCepat BEST</div>
              <div class="courier-option__time">Estimasi 1-3 hari</div>
            </div>
          </div>
          <div class="courier-option__price">${formatRupiah(12000)}</div>
        </label>
        <label class="courier-option" data-courier="tanpa-kurir">
          <div class="courier-option__left">
            <input type="radio" name="courier" class="courier-option__radio" value="tanpa-kurir" />
            <div>
              <div class="courier-option__name">Tanpa Kurir</div>
              <div class="courier-option__time">Ambil Sendiri / Diatur Terpisah</div>
            </div>
          </div>
          <div class="courier-option__price">${formatRupiah(0)}</div>
        </label>
      </div>
    </div>

    <button class="btn btn--primary btn--lg btn--full" id="step1-next">Lanjut ke Pembayaran</button>
  `;

  // Courier selection
  const courierOptions = main.querySelectorAll('.courier-option');
  courierOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      courierOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedCourier = opt.dataset.courier;
      const prices = { 'jne-reg': 15000, 'jne-yes': 25000, 'jnt': 13000, 'sicepat': 12000, 'tanpa-kurir': 0 };
      shippingCost = prices[selectedCourier] !== undefined ? prices[selectedCourier] : 15000;

      const subtotal = getCartTotal();
      if (subtotal >= 300000) shippingCost = 0;

      renderOrderSummary();
    });
  });

  // Next step
  main.querySelector('#step1-next')?.addEventListener('click', () => {
    orderForm.name = document.getElementById('ship-name').value;
    orderForm.phone = document.getElementById('ship-phone').value;
    orderForm.email = document.getElementById('ship-email').value;
    orderForm.address = document.getElementById('ship-address').value;
    orderForm.province = document.getElementById('ship-province').value;
    orderForm.city = document.getElementById('ship-city').value;
    orderForm.district = document.getElementById('ship-district').value;
    orderForm.zip = document.getElementById('ship-zip').value;

    if (!orderForm.name || !orderForm.phone || !orderForm.email || !orderForm.address || !orderForm.province || !orderForm.city || !orderForm.zip) {
      alert('Mohon lengkapi semua field yang wajib diisi (*)');
      return;
    }
    
    renderStep2();
  });
}

function renderStep2() {
  const main = document.getElementById('checkout-main');
  currentStep = 2;

  main.innerHTML = `
    ${renderSteps()}
    <div class="checkout-section">
      <h3 class="checkout-section__title">Metode Pembayaran</h3>

      <div class="payment-group">
        <div class="payment-group__title">QRIS (Scan QR)</div>
        <div class="payment-options">
          <label class="payment-option selected">
            <input type="radio" name="payment" value="qris" checked /> QRIS
          </label>
        </div>
      </div>

      <div class="payment-group">
        <div class="payment-group__title">Virtual Account</div>
        <div class="payment-options">
          <label class="payment-option"><input type="radio" name="payment" value="bca" /> BCA VA</label>
          <label class="payment-option"><input type="radio" name="payment" value="mandiri" /> Mandiri VA</label>
          <label class="payment-option"><input type="radio" name="payment" value="bni" /> BNI VA</label>
          <label class="payment-option"><input type="radio" name="payment" value="bri" /> BRI VA</label>
        </div>
      </div>

      <div class="payment-group">
        <div class="payment-group__title">E-Wallet</div>
        <div class="payment-options">
          <label class="payment-option"><input type="radio" name="payment" value="gopay" /> GoPay</label>
          <label class="payment-option"><input type="radio" name="payment" value="ovo" /> OVO</label>
          <label class="payment-option"><input type="radio" name="payment" value="dana" /> Dana</label>
          <label class="payment-option"><input type="radio" name="payment" value="shopeepay" /> ShopeePay</label>
        </div>
      </div>

      <div class="payment-group">
        <div class="payment-group__title">Transfer Manual</div>
        <div class="payment-options">
          <label class="payment-option"><input type="radio" name="payment" value="tf-bca" /> Transfer BCA</label>
          <label class="payment-option"><input type="radio" name="payment" value="tf-mandiri" /> Transfer Mandiri</label>
        </div>
      </div>

      <div class="payment-group">
        <div class="payment-group__title">Bayar di Tempat</div>
        <div class="payment-options">
          <label class="payment-option"><input type="radio" name="payment" value="cod" /> Cash on Delivery (COD)</label>
        </div>
      </div>
    </div>

    <div style="display: flex; gap: var(--space-3);">
      <button class="btn btn--outline btn--lg" id="step2-back" style="flex: 0 0 auto;">← Kembali</button>
      <button class="btn btn--primary btn--lg" id="step2-next" style="flex: 1;">Review Pesanan</button>
    </div>
  `;

  // Payment selection
  const paymentOptions = main.querySelectorAll('.payment-option');
  paymentOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedPayment = opt.querySelector('input').value;
    });
  });

  main.querySelector('#step2-back')?.addEventListener('click', () => renderStep1());
  main.querySelector('#step2-next')?.addEventListener('click', () => renderStep3());
}

function renderStep3() {
  const main = document.getElementById('checkout-main');
  currentStep = 3;
  const items = getCartItems();
  const subtotal = getCartTotal();
  const freeShip = subtotal >= 300000;
  const finalShipping = freeShip ? 0 : shippingCost;
  const total = subtotal + finalShipping;

  main.innerHTML = `
    ${renderSteps()}
    <div class="checkout-section">
      <h3 class="checkout-section__title">Review Pesanan</h3>
      
      <div style="border: 1px solid var(--color-border); padding: var(--space-4); margin-bottom: var(--space-4);">
        <h4 style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-3);">PRODUK</h4>
        ${items.map(item => `
          <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border-light);">
            <img src="${item.image}" alt="${item.name}" style="width: 48px; height: 60px; object-fit: cover;" />
            <div style="flex: 1;">
              <div style="font-size: var(--font-size-sm); font-weight: 500;">${item.name}</div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">${item.size} / ${item.color} × ${item.qty}</div>
            </div>
            <div style="font-weight: 600; font-size: var(--font-size-sm);">${formatRupiah((item.salePrice || item.price) * item.qty)}</div>
          </div>
        `).join('')}
      </div>

      <div style="border: 1px solid var(--color-border); padding: var(--space-4); margin-bottom: var(--space-4);">
        <h4 style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-3);">PEMBAYARAN</h4>
        <div style="font-size: var(--font-size-sm);">${selectedPayment.toUpperCase()}</div>
      </div>

      <div style="background: var(--color-surface); padding: var(--space-5); margin-bottom: var(--space-6);">
        <div class="order-summary__row"><span>Subtotal</span><span>${formatRupiah(subtotal)}</span></div>
        <div class="order-summary__row"><span>Ongkir</span><span>${finalShipping === 0 ? 'GRATIS' : formatRupiah(finalShipping)}</span></div>
        <div class="order-summary__row order-summary__row--total"><span>Total Bayar</span><span>${formatRupiah(total)}</span></div>
      </div>
    </div>

    <div style="display: flex; gap: var(--space-3);">
      <button class="btn btn--outline btn--lg" id="step3-back" style="flex: 0 0 auto;">← Kembali</button>
      <button class="btn btn--primary btn--lg" id="place-order" style="flex: 1;">Bayar Sekarang — ${formatRupiah(total)}</button>
    </div>
  `;

  main.querySelector('#step3-back')?.addEventListener('click', () => renderStep2());
  main.querySelector('#place-order')?.addEventListener('click', () => placeOrder());
}

async function placeOrder() {
  const placeOrderBtn = document.getElementById('place-order');
  placeOrderBtn.textContent = 'Memproses...';
  placeOrderBtn.disabled = true;

  const items = getCartItems();
  const subtotal = getCartTotal();
  const freeShip = subtotal >= 300000;
  const finalShipping = freeShip ? 0 : shippingCost;
  const total = subtotal + finalShipping;

  const orderData = {
    customerName: orderForm.name || 'Guest',
    customerEmail: orderForm.email || 'guest@example.com',
    customerPhone: orderForm.phone || '-',
    shippingAddress: orderForm.address || '-',
    shippingCity: orderForm.city || '-',
    shippingProvince: orderForm.province || '-',
    shippingZip: orderForm.zip || '-',
    courier: selectedCourier,
    paymentMethod: selectedPayment,
    subtotal,
    shippingCost: finalShipping,
    total,
    items
  };

  try {
    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    
    if (data.success) {
      clearCart();
      const container = document.getElementById('checkout-container');
      container.innerHTML = `
        <div class="checkout-success">
          <div class="checkout-success__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 style="margin-bottom: var(--space-2);">Pesanan Berhasil!</h2>
          <p class="text-secondary" style="margin-bottom: var(--space-4);">Terima kasih atas pesanan Anda. Email konfirmasi telah dikirim.</p>
          <div class="checkout-success__order-id">${data.orderNumber}</div>
          <p class="text-secondary text-sm" style="margin-bottom: var(--space-8);">Silakan selesaikan pembayaran dalam 24 jam untuk memproses pesanan Anda.</p>
          <div style="display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap;">
            <a href="/katalog.html" class="btn btn--primary">Lanjut Belanja</a>
            <a href="/" class="btn btn--outline">Kembali ke Home</a>
          </div>
        </div>
      `;
    } else {
      alert('Gagal memproses pesanan: ' + data.error);
      placeOrderBtn.textContent = `Bayar Sekarang — ${formatRupiah(total)}`;
      placeOrderBtn.disabled = false;
    }
  } catch (err) {
    alert('Terjadi kesalahan koneksi.');
    placeOrderBtn.textContent = `Bayar Sekarang — ${formatRupiah(total)}`;
    placeOrderBtn.disabled = false;
  }
}

function renderOrderSummary() {
  const sidebar = document.getElementById('checkout-summary');
  if (!sidebar) return;

  const items = getCartItems();
  const subtotal = getCartTotal();
  const freeShip = subtotal >= 300000;
  const finalShipping = freeShip ? 0 : shippingCost;
  const total = subtotal + finalShipping;

  sidebar.innerHTML = `
    <div class="order-summary">
      <h3 class="order-summary__title">Pesanan Kamu</h3>
      ${items.map(item => `
        <div style="display: flex; gap: var(--space-3); margin-bottom: var(--space-3); align-items: center;">
          <div style="position: relative;">
            <img src="${item.image}" alt="${item.name}" style="width: 56px; height: 70px; object-fit: cover; background: var(--color-surface);" />
            <span style="position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; background: var(--color-text-primary); color: white; font-size: 10px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">${item.qty}</span>
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: var(--font-size-sm); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">${item.size} / ${item.color}</div>
          </div>
          <div style="font-size: var(--font-size-sm); font-weight: 600;">${formatRupiah((item.salePrice || item.price) * item.qty)}</div>
        </div>
      `).join('')}
      <hr style="border: none; border-top: 1px solid var(--color-border); margin: var(--space-4) 0;">
      <div class="order-summary__row"><span>Subtotal</span><span>${formatRupiah(subtotal)}</span></div>
      <div class="order-summary__row"><span>Ongkir</span><span>${finalShipping === 0 ? '<span style="color: var(--color-success);">GRATIS</span>' : formatRupiah(finalShipping)}</span></div>
      <div class="order-summary__row order-summary__row--total"><span>Total</span><span>${formatRupiah(total)}</span></div>
    </div>
  `;
}
