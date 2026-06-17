import { formatRupiah, getUrlParam } from '../utils/helpers.js';

let currentOrder = null;
let paymentMethodDetails = null;

async function init() {
  const orderNumber = getUrlParam('order');
  if (!orderNumber) {
    document.getElementById('payment-content').innerHTML = `
      <div style="text-align: center; padding: var(--space-8);">
        <h2>Pesanan Tidak Valid</h2>
        <a href="/" class="btn btn--primary" style="margin-top: var(--space-4);">Kembali ke Home</a>
      </div>
    `;
    return;
  }

  await loadOrder(orderNumber);
}

async function loadOrder(orderNumber) {
  try {
    const res = await fetch(`/api/orders/number/${orderNumber}`);
    if (!res.ok) throw new Error('Pesanan tidak ditemukan');
    currentOrder = await res.json();
    
    // Fetch payment methods to get the account number
    const pRes = await fetch('/api/payments');
    const payments = await pRes.json();
    paymentMethodDetails = payments.find(p => p.name === currentOrder.paymentMethod);

    render();
  } catch (err) {
    document.getElementById('payment-content').innerHTML = `
      <div style="text-align: center; padding: var(--space-8);">
        <h2>Gagal memuat pesanan</h2>
        <p>${err.message}</p>
      </div>
    `;
  }
}

function render() {
  const container = document.getElementById('payment-content');
  
  if (currentOrder.paymentProof) {
    // Already uploaded
    container.innerHTML = `
      <div class="payment-header">
        <h1 style="margin-bottom: var(--space-2);">Bukti Terunggah</h1>
        <div class="status-badge success">Menunggu Konfirmasi Admin</div>
      </div>
      <p style="text-align: center; margin-bottom: var(--space-6);">Terima kasih, pembayaran Anda untuk pesanan <strong>${currentOrder.orderNumber}</strong> sedang kami verifikasi.</p>
      <div style="text-align: center;">
        <img src="${currentOrder.paymentProof}" alt="Bukti Transfer" style="max-width: 100%; max-height: 400px; border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: var(--space-6);" />
        <br>
        <a href="/" class="btn btn--primary">Selesai</a>
      </div>
    `;
    return;
  }

  // Needs upload
  const instruction = paymentMethodDetails?.type === 'qris' 
    ? 'Silakan scan QRIS di bawah ini' 
    : 'Silakan transfer tepat sesuai nominal berikut';
    
  const accountInfo = paymentMethodDetails?.type === 'qris' 
    ? `<img src="${paymentMethodDetails.accountNumber}" alt="QRIS" style="max-width: 250px; margin: var(--space-4) auto; display: block; border-radius: var(--radius-sm);" />`
    : `
      <div style="font-size: 0.9rem; color: var(--color-text-secondary); text-transform: uppercase;">${currentOrder.paymentMethod}</div>
      <div class="payment-account">${paymentMethodDetails?.accountNumber || '-'}</div>
      <div style="font-size: 1.1rem; font-weight: 600;">a.n. ${paymentMethodDetails?.accountName || 'REDLINE'}</div>
    `;

  container.innerHTML = `
    <div class="payment-header">
      <h1 style="margin-bottom: var(--space-2);">Selesaikan Pembayaran</h1>
      <p class="text-secondary">Order ID: <strong>${currentOrder.orderNumber}</strong></p>
    </div>

    <div class="payment-instructions">
      <p style="margin-bottom: var(--space-2);">${instruction}</p>
      <div class="payment-amount">${formatRupiah(currentOrder.total)}</div>
      <hr style="border: none; border-top: 1px dashed var(--color-border); margin: var(--space-4) 0;">
      ${accountInfo}
    </div>

    <div>
      <h3 style="margin-bottom: var(--space-4);">Upload Bukti Transfer</h3>
      <p class="text-secondary text-sm" style="margin-bottom: var(--space-4);">Pesanan tidak akan diproses sebelum Anda mengunggah bukti pembayaran.</p>
      
      <label class="upload-box" id="upload-container">
        <input type="file" id="upload-file" accept="image/*" />
        <div id="upload-text">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-text-secondary); margin-bottom: var(--space-2);">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <div style="font-weight: 600;">Klik untuk pilih foto bukti transfer</div>
          <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 4px;">Format: JPG, PNG (Maks. 5MB)</div>
        </div>
        <img id="upload-preview" />
      </label>

      <button id="submit-btn" class="btn btn--primary btn--full" style="margin-top: var(--space-6);" disabled>Kirim Bukti Pembayaran</button>
    </div>
  `;

  // Bind events
  const fileInput = document.getElementById('upload-file');
  const preview = document.getElementById('upload-preview');
  const text = document.getElementById('upload-text');
  const submitBtn = document.getElementById('submit-btn');

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = 'inline-block';
        text.style.display = 'none';
        submitBtn.disabled = false;
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      preview.style.display = 'none';
      text.style.display = 'block';
      submitBtn.disabled = true;
    }
  });

  submitBtn.addEventListener('click', async () => {
    if (!fileInput.files[0]) return;
    
    submitBtn.textContent = 'Mengunggah...';
    submitBtn.disabled = true;

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    try {
      const res = await fetch(`/api/orders/${currentOrder.orderNumber}/upload-proof`, {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        currentOrder.paymentProof = data.url;
        render(); // Re-render to success state
      } else {
        alert('Gagal mengunggah: ' + data.error);
        submitBtn.textContent = 'Kirim Bukti Pembayaran';
        submitBtn.disabled = false;
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi');
      submitBtn.textContent = 'Kirim Bukti Pembayaran';
      submitBtn.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
