import { checkAdminAuth, setupLogout, fetchWithAuth } from './auth-check.js';

let paymentMethods = [];

async function init() {
  if (!checkAdminAuth()) return;
  setupLogout();

  await loadPayments();
}

async function loadPayments() {
  const container = document.getElementById('payments-container');
  try {
    const res = await fetchWithAuth('/api/payments');
    paymentMethods = await res.json();
    
    if (!paymentMethods || paymentMethods.length === 0) {
      container.innerHTML = '<p>Tidak ada metode pembayaran ditemukan.</p>';
      return;
    }

    // Sort: COD first, then bank, then ewallet, then qris
    paymentMethods.sort((a, b) => {
      const order = { cod: 1, bank: 2, ewallet: 3, qris: 4 };
      return (order[a.type] || 5) - (order[b.type] || 5);
    });

    container.innerHTML = paymentMethods.map(m => {
      return `
        <div class="payment-card">
          <div class="payment-card__header">
            <h3 class="payment-card__title">${m.name} <span style="font-size: 0.8rem; font-weight: normal; color: var(--color-text-secondary);">(${m.type.toUpperCase()})</span></h3>
            <label class="switch">
              <input type="checkbox" onchange="toggleActive('${m.id}', this.checked)" ${m.isActive ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>
          
          ${m.type !== 'cod' ? `
            <div style="margin-top: var(--space-2);">
              <div class="form-group" style="margin-bottom: var(--space-3);">
                <label>Nomor Rekening / No. HP / URL QRIS</label>
                <input type="text" class="input" id="acc-num-${m.id}" value="${m.accountNumber || ''}" placeholder="${m.type === 'qris' ? 'Link Gambar QRIS' : 'Misal: 123456789'}">
              </div>
              <div class="form-group" style="margin-bottom: var(--space-3); ${m.type === 'qris' ? 'display: none;' : ''}">
                <label>Atas Nama (A/N)</label>
                <input type="text" class="input" id="acc-name-${m.id}" value="${m.accountName || ''}" placeholder="Misal: PT Redline / Budi">
              </div>
              <button class="btn btn--outline" style="width: 100%;" onclick="saveDetails('${m.id}')">Simpan Detail</button>
            </div>
          ` : '<p class="text-secondary" style="font-size: 0.9rem; margin-top: var(--space-2);">Bayar tunai kepada kurir saat barang sampai.</p>'}
        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = '<p style="color: red;">Gagal memuat metode pembayaran.</p>';
  }
}

window.toggleActive = async (id, isActive) => {
  try {
    const method = paymentMethods.find(m => m.id === id);
    const payload = {
      isActive,
      accountNumber: document.getElementById(`acc-num-${id}`)?.value || method.accountNumber,
      accountName: document.getElementById(`acc-name-${id}`)?.value || method.accountName
    };
    
    const res = await fetchWithAuth(`/api/payments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) throw new Error('Gagal update status');
  } catch (err) {
    alert('Gagal mengubah status: ' + err.message);
    loadPayments(); // revert
  }
};

window.saveDetails = async (id) => {
  try {
    const method = paymentMethods.find(m => m.id === id);
    const checkbox = document.querySelector(`input[onchange="toggleActive('${id}', this.checked)"]`);
    
    const payload = {
      isActive: checkbox ? checkbox.checked : method.isActive,
      accountNumber: document.getElementById(`acc-num-${id}`).value,
      accountName: document.getElementById(`acc-name-${id}`)?.value || ''
    };
    
    const btn = event.target;
    btn.textContent = 'Menyimpan...';
    btn.disabled = true;

    const res = await fetchWithAuth(`/api/payments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) throw new Error('Gagal menyimpan detail');
    
    btn.textContent = 'Tersimpan!';
    setTimeout(() => {
      btn.textContent = 'Simpan Detail';
      btn.disabled = false;
    }, 2000);
  } catch (err) {
    alert('Gagal menyimpan detail: ' + err.message);
    event.target.textContent = 'Simpan Detail';
    event.target.disabled = false;
  }
};

init();
