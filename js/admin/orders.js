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
      const res = await fetchWithAuth('/api/orders');
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
      const res = await fetchWithAuth(`/api/orders/${id}`, {
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
          Kurir: <strong>${o.courier.toUpperCase()}</strong>
        </div>
      </div>
      <div>
        <strong>Item Pesanan</strong>
        <table class="admin-table" style="margin-top: 8px;">
          <thead>
            <tr><th style="width: 60px;">Foto</th><th>Produk</th><th>Harga</th><th>Qty</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            ${o.items.map(i => `
              <tr>
                <td>
                  ${i.image ? `<img src="${i.image}" alt="${i.name}" style="width: 48px; height: 60px; object-fit: cover; border-radius: 4px; background: #f3f4f6;" />` : `<div style="width: 48px; height: 60px; background: #e5e7eb; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #9ca3af;">No Img</div>`}
                </td>
                <td>
                  <div style="font-weight: 500;">${i.name}</div>
                  <div style="font-size: 0.8rem; color: #6b7280;">Warna: ${i.color} | Ukuran: ${i.size}</div>
                </td>
                <td>Rp ${new Intl.NumberFormat('id-ID').format(i.price)}</td>
                <td>${i.quantity}</td>
                <td>Rp ${new Intl.NumberFormat('id-ID').format(i.price * i.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div style="margin-top: 16px; display: flex; justify-content: space-between; align-items: center;">
        <button class="btn btn--primary" style="background: #4F46E5; display: flex; align-items: center; gap: 8px;" onclick="printReceipt('${o.id}')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          Cetak Resi Packing
        </button>
        <div style="text-align: right;">
          <strong>Total Bayar: Rp ${new Intl.NumberFormat('id-ID').format(o.total)}</strong>
        </div>
      </div>
      ${o.status === 'rejected' ? `<div style="margin-top: 16px; color: #EF4444; background: #FEE2E2; padding: 12px; border-radius: 8px;"><strong>Alasan Ditolak:</strong> ${o.rejectReason || '-'}</div>` : ''}
    `;

    document.getElementById('detail-content').innerHTML = content;
    detailModal.style.display = 'flex';
  };

  window.printReceipt = (id) => {
    const o = allOrdersData.find(order => order.id === id);
    if (!o) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Resi Pengiriman - ${o.orderNumber}</title>
          <style>
            body { font-family: sans-serif; line-height: 1.5; padding: 20px; color: #000; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .flex { display: flex; justify-content: space-between; }
            .box { border: 1px solid #000; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
            .print-btn { display: block; width: 100%; padding: 10px; background: #000; color: #fff; text-align: center; text-decoration: none; font-weight: bold; margin-bottom: 20px; cursor: pointer; border: none; }
            @media print { .print-btn { display: none; } body { padding: 0; } }
          </style>
        </head>
        <body>
          <button class="print-btn" onclick="window.print()">CETAK SEKARANG</button>
          <div class="header">
            <h1 style="margin: 0;">REDLINE TRUCK APPAREL</h1>
            <p style="margin: 5px 0 0 0;">RESI PENGIRIMAN (PACKING SLIP)</p>
          </div>
          
          <div class="flex">
            <div style="flex: 1;">
              <strong>Order ID:</strong> ${o.orderNumber}<br>
              <strong>Tanggal:</strong> ${new Date(o.createdAt).toLocaleDateString('id-ID')}<br>
              <strong>Kurir:</strong> ${o.courier.toUpperCase()}
            </div>
          </div>
          
          <div class="box" style="margin-top: 20px;">
            <h3>Penerima:</h3>
            <div style="font-size: 1.2rem; font-weight: bold;">${o.customerName}</div>
            <div>${o.customerPhone}</div>
            <div style="margin-top: 10px;">
              ${o.shippingAddress}<br>
              ${o.shippingCity}, ${o.shippingProvince}<br>
              Kode Pos: ${o.shippingZip}
            </div>
          </div>
          
          <h3>Daftar Barang (Untuk Packing):</h3>
          <table>
            <thead>
              <tr><th>Produk</th><th>Varian</th><th>Qty</th></tr>
            </thead>
            <tbody>
              ${o.items.map(i => `
                <tr>
                  <td><strong>${i.name}</strong></td>
                  <td>Warna: ${i.color} | Ukuran: ${i.size}</td>
                  <td style="text-align: center; font-weight: bold; font-size: 1.2rem;">${i.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 40px; text-align: center; font-size: 0.9rem;">
            Terima kasih telah berbelanja di Redline Truck Apparel.<br>
            <em>The best or nothing</em>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
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
