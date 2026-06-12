import { checkAdminAuth, setupLogout, fetchWithAuth } from './auth-check.js';

let allOrdersData = [];

async function init() {
  if (!checkAdminAuth()) return;
  setupLogout();

  const newOrdersList = document.getElementById('new-orders-list');
  const ordersList = document.getElementById('orders-list');
  const rejectModal = document.getElementById('reject-modal');
  const detailModal = document.getElementById('detail-modal');

  document.getElementById('close-reject-btn').onclick = () => rejectModal.style.display = 'none';
  document.getElementById('close-detail-btn').onclick = () => detailModal.style.display = 'none';

  async function loadOrders() {
    try {
      const res = await fetchWithAuth('http://localhost:5000/api/orders');
      if (!res) return;
      allOrdersData = await res.json();
      
      const newOrders = allOrdersData.filter(o => o.status === 'pending');
      const otherOrders = allOrdersData.filter(o => o.status !== 'pending');

      if (newOrders.length === 0) {
        newOrdersList.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 24px;">Belum ada pesanan baru</td></tr>';
      } else {
        newOrdersList.innerHTML = newOrders.map(o => `
          <tr>
            <td><strong>${o.orderNumber}</strong></td>
            <td>${o.customerName}<br><small>${o.customerPhone}</small></td>
            <td>
              ${o.items.map(i => `<div style="font-size: 0.85rem; margin-bottom: 2px; color: #4B5563;">&bull; ${i.name} <br><span style="color:#9CA3AF; font-size: 0.75rem;">(${i.color}, ${i.size}) x ${i.quantity}</span></div>`).join('')}
            </td>
            <td>${new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
            <td>Rp ${new Intl.NumberFormat('id-ID').format(o.total)}</td>
            <td>
              <div style="display: flex; gap: 8px;">
                <button class="btn-view" style="background: #D1FAE5; color: #059669;" onclick="updateStatus('${o.id}', 'processing')">Terima</button>
                <button class="btn-view" style="background: #FEE2E2; color: #EF4444;" onclick="openRejectModal('${o.id}')">Tolak</button>
                <button class="btn-view" onclick="openDetailModal('${o.id}')">Detail</button>
              </div>
            </td>
          </tr>
        `).join('');
      }

      if (otherOrders.length === 0) {
        ordersList.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 24px;">Belum ada pesanan</td></tr>';
      } else {
        ordersList.innerHTML = otherOrders.map(o => `
          <tr>
            <td><strong>${o.orderNumber}</strong></td>
            <td>${o.customerName}<br><small>${o.customerPhone}</small></td>
            <td>
              ${o.items.map(i => `<div style="font-size: 0.85rem; margin-bottom: 2px; color: #4B5563;">&bull; ${i.name} <br><span style="color:#9CA3AF; font-size: 0.75rem;">(${i.color}, ${i.size}) x ${i.quantity}</span></div>`).join('')}
            </td>
            <td>${new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
            <td>Rp ${new Intl.NumberFormat('id-ID').format(o.total)}</td>
            <td>
              <select style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 4px 8px; font-size: 0.8rem; outline: none; background: #F9FAFB;" onchange="updateStatus('${o.id}', this.value)">
                <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Diproses</option>
                <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Dikirim</option>
                <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>Selesai</option>
                <option value="rejected" ${o.status === 'rejected' ? 'selected' : ''} disabled>Ditolak</option>
                <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''} disabled>Dibatalkan</option>
              </select>
            </td>
            <td>
              <button class="btn-view" onclick="openDetailModal('${o.id}')">Detail</button>
            </td>
          </tr>
        `).join('');
      }
    } catch (err) {
      console.error(err);
      newOrdersList.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Gagal memuat</td></tr>';
      ordersList.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Gagal memuat</td></tr>';
    }
  }

  window.updateStatus = async (id, status, reason = null) => {
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectReason: reason })
      });
      if (res && res.ok) {
        loadOrders();
      }
    } catch (err) {
      alert('Gagal update status');
      loadOrders();
    }
  };

  window.openRejectModal = (id) => {
    document.getElementById('reject-order-id').value = id;
    document.getElementById('reject-reason').value = '';
    rejectModal.style.display = 'flex';
  };

  document.getElementById('reject-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('reject-order-id').value;
    const reason = document.getElementById('reject-reason').value;
    updateStatus(id, 'rejected', reason);
    rejectModal.style.display = 'none';
  });

  window.openDetailModal = (id) => {
    const o = allOrdersData.find(order => order.id === id);
    if (!o) return;

    const content = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
        <div>
          <strong>Informasi Pelanggan</strong><br>
          ${o.customerName}<br>
          ${o.customerEmail}<br>
          ${o.customerPhone}
        </div>
        <div>
          <strong>Pengiriman</strong><br>
          ${o.shippingAddress}, ${o.shippingCity}<br>
          ${o.shippingProvince}, ${o.shippingZip}<br>
          Kurir: ${o.courier}
        </div>
      </div>
      <div>
        <strong>Item Pesanan</strong>
        <table class="admin-table" style="margin-top: 8px;">
          <thead>
            <tr><th>Produk</th><th>Harga</th><th>Qty</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            ${o.items.map(i => `
              <tr>
                <td>${i.name} (${i.color}, ${i.size})</td>
                <td>Rp ${new Intl.NumberFormat('id-ID').format(i.price)}</td>
                <td>${i.quantity}</td>
                <td>Rp ${new Intl.NumberFormat('id-ID').format(i.price * i.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div style="margin-top: 16px; text-align: right;">
        <strong>Total Bayar: Rp ${new Intl.NumberFormat('id-ID').format(o.total)}</strong>
      </div>
      ${o.status === 'rejected' ? `<div style="margin-top: 16px; color: #EF4444; background: #FEE2E2; padding: 12px; border-radius: 8px;"><strong>Alasan Ditolak:</strong> ${o.rejectReason || '-'}</div>` : ''}
    `;

    document.getElementById('detail-content').innerHTML = content;
    detailModal.style.display = 'flex';
  };

  document.getElementById('btn-export-excel')?.addEventListener('click', () => {
    if (typeof XLSX === 'undefined') {
      alert('Library Excel belum siap, silakan tunggu sebentar atau muat ulang halaman.');
      return;
    }

    const acceptedOrders = allOrdersData.filter(o => ['processing', 'shipped', 'completed'].includes(o.status));
    if (acceptedOrders.length === 0) {
      alert('Tidak ada pesanan yang sudah diterima untuk diexport.');
      return;
    }

    const exportData = [];
    acceptedOrders.forEach(o => {
      o.items.forEach(i => {
        exportData.push({
          'Order ID': o.orderNumber,
          'Tanggal': new Date(o.createdAt).toLocaleDateString('id-ID'),
          'Nama Pelanggan': o.customerName,
          'Email Pelanggan': o.customerEmail,
          'Nomor WA': o.customerPhone,
          'Alamat Pengiriman': `${o.shippingAddress}, ${o.shippingCity}, ${o.shippingProvince} ${o.shippingZip}`,
          'Kurir': o.courier,
          'Nama Produk': i.name,
          'Warna': i.color,
          'Ukuran': i.size,
          'Jumlah Pembelian': i.quantity,
          'Harga Satuan': i.price,
          'Subtotal Produk': i.price * i.quantity,
          'Status Pesanan': o.status,
          'Total Pesanan': o.total
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pesanan Diterima");
    XLSX.writeFile(wb, `Data_Pesanan_Diterima_${new Date().toISOString().split('T')[0]}.xlsx`);
  });

  loadOrders();
}

init();
