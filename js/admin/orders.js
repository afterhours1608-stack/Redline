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
        newOrdersList.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 24px;">Belum ada pesanan baru</td></tr>';
      } else {
        newOrdersList.innerHTML = newOrders.map(o => `
          <tr>
            <td><strong>${o.orderNumber}</strong></td>
            <td>${o.customerName}<br><small>${o.customerPhone}</small></td>
            <td>
              ${o.items.map(i => `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                ${i.image ? `<img src="${i.image}" style="width: 36px; height: 36px; object-fit: cover; border-radius: 4px; flex-shrink: 0;" />` : ''}
                <div style="font-size: 0.85rem; color: #4B5563;">${i.name}<br><span style="color:#9CA3AF; font-size: 0.75rem;">(${i.color}, ${i.size}) x ${i.quantity}</span></div>
              </div>`).join('')}
            </td>
            <td>${new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
            <td>
              Rp ${new Intl.NumberFormat('id-ID').format(o.total)}<br>
              <small style="color: ${o.paymentMethod.toLowerCase().includes('cod') ? '#059669' : (o.paymentProof ? '#059669' : '#D97706')}">${o.paymentMethod.toLowerCase().includes('cod') ? 'COD' : (o.paymentProof ? 'Bukti Ada' : 'Belum Bayar')}</small>
            </td>
            <td>
              <div style="display: flex; gap: 8px;">
                <button class="btn-view" style="background: ${(!o.paymentMethod.toLowerCase().includes('cod') && !o.paymentProof) ? '#E5E7EB' : '#D1FAE5'}; color: ${(!o.paymentMethod.toLowerCase().includes('cod') && !o.paymentProof) ? '#9CA3AF' : '#059669'};" onclick="${(!o.paymentMethod.toLowerCase().includes('cod') && !o.paymentProof) ? `alert('Tunggu customer upload bukti transfer dulu!');` : `updateStatus('${o.id}', 'processing')`}">${(!o.paymentMethod.toLowerCase().includes('cod') && !o.paymentProof) ? 'Tunggu Bukti' : 'Terima'}</button>
                <button class="btn-view" style="background: #FEE2E2; color: #EF4444;" onclick="openRejectModal('${o.id}')">Tolak</button>
                <button class="btn-view" onclick="openDetailModal('${o.id}')">Detail</button>
              </div>
            </td>
          </tr>
        `).join('');
      }

      if (otherOrders.length === 0) {
        ordersList.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 24px;">Belum ada pesanan</td></tr>';
      } else {
        ordersList.innerHTML = otherOrders.map(o => `
          <tr>
            <td><input type="checkbox" class="order-checkbox" data-order-id="${o.id}" style="width: 16px; height: 16px; cursor: pointer;" /></td>
            <td><strong style="color: var(--color-primary); cursor: pointer; text-decoration: underline;" onclick="openDetailModal('${o.id}')" title="Lihat Detail">${o.orderNumber}</strong></td>
            <td>${o.customerName}<br><small>${o.customerPhone}</small></td>
            <td>
              ${o.items.map(i => `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                ${i.image ? `<img src="${i.image}" style="width: 36px; height: 36px; object-fit: cover; border-radius: 4px; flex-shrink: 0;" />` : ''}
                <div style="font-size: 0.85rem; color: #4B5563;">${i.name}<br><span style="color:#9CA3AF; font-size: 0.75rem;">(${i.color}, ${i.size}) x ${i.quantity}</span></div>
              </div>`).join('')}
            </td>
            <td>${new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
            <td>Rp ${new Intl.NumberFormat('id-ID').format(o.total)}</td>
            <td>
              <select style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 4px 8px; font-size: 0.8rem; outline: none; background: #F9FAFB;" onchange="if(this.value === 'rejected') { openRejectModal('${o.id}'); this.value = '${o.status}'; } else { updateStatus('${o.id}', this.value); }">
                <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Diproses</option>
                <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Dikirim</option>
                <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>Selesai</option>
                <option value="rejected" ${o.status === 'rejected' ? 'selected' : ''}>Ditolak</option>
                <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''} disabled>Dibatalkan</option>
              </select>
            </td>
            <td>
              <div style="font-weight: 600; font-size: 0.85rem; color: ${o.paymentMethod.toLowerCase().includes('cod') ? '#059669' : '#4F46E5'};">
                ${o.paymentMethod.toUpperCase()}
              </div>
            </td>
          </tr>
        `).join('');
      }
    } catch (err) {
      console.error(err);
      newOrdersList.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Gagal memuat</td></tr>';
      ordersList.innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">Gagal memuat</td></tr>';
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
    document.getElementById('reject-modal').style.display = 'flex';
  };

  document.getElementById('reject-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('reject-order-id').value;
    const reason = document.getElementById('reject-reason').value;
    window.updateStatus(id, 'rejected', reason);
    document.getElementById('reject-modal').style.display = 'none';
  });

  window.openDetailModal = (id) => {
    const o = allOrdersData.find(order => order.id === id);
    if (!o) return;

    const statusLabels = {
      pending: { text: 'Menunggu', bg: '#FEF3C7', color: '#D97706' },
      processing: { text: 'Diproses', bg: '#DBEAFE', color: '#2563EB' },
      shipped: { text: 'Dikirim', bg: '#E0E7FF', color: '#4F46E5' },
      completed: { text: 'Selesai', bg: '#D1FAE5', color: '#059669' },
      rejected: { text: 'Ditolak', bg: '#FEE2E2', color: '#DC2626' },
      cancelled: { text: 'Dibatalkan', bg: '#F3F4F6', color: '#6B7280' }
    };
    const status = statusLabels[o.status] || statusLabels.pending;

    const content = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
        <span style="font-size: 1.1rem; font-weight: 700;">Order ${o.orderNumber}</span>
        <span style="padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; background: ${status.bg}; color: ${status.color};">${status.text}</span>
        <span style="margin-left: auto; font-size: 0.85rem; color: #9CA3AF;">${new Date(o.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
        <div style="background: var(--admin-bg, #F4F7FE); padding: 16px; border-radius: 12px;">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; margin-bottom: 8px; font-weight: 700;">Informasi Pelanggan</div>
          <div style="font-weight: 600; font-size: 0.95rem;">${o.customerName}</div>
          <div style="font-size: 0.85rem; color: #6B7280; margin-top: 4px;">${o.customerEmail}</div>
          <div style="font-size: 0.85rem; color: #6B7280;">${o.customerPhone}</div>
        </div>
        <div style="background: var(--admin-bg, #F4F7FE); padding: 16px; border-radius: 12px;">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; margin-bottom: 8px; font-weight: 700;">Pengiriman</div>
          <div style="font-size: 0.85rem;">${o.shippingAddress}</div>
          <div style="font-size: 0.85rem;">${o.shippingCity}, ${o.shippingProvince} ${o.shippingZip}</div>
          <div style="font-size: 0.85rem; margin-top: 4px;">Kurir: <strong>${o.courier.toUpperCase()}</strong></div>
          <div style="font-size: 0.85rem;">Pembayaran: <strong>${o.paymentMethod ? o.paymentMethod.toUpperCase() : '-'}</strong></div>
        </div>
      </div>

      <div>
        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; margin-bottom: 12px; font-weight: 700;">Item Pesanan</div>
        <table class="admin-table" style="margin-top: 0;">
          <thead>
            <tr>
              <th style="width: 80px;">Foto</th>
              <th>Produk</th>
              <th style="width: 100px;">Harga</th>
              <th style="width: 50px;">Qty</th>
              <th style="width: 110px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${o.items.map(i => `
              <tr>
                <td>
                  ${i.image ? `<img src="${i.image}" alt="${i.name}" style="width: 70px; height: 85px; object-fit: cover; border-radius: 8px; background: #f3f4f6; display: block;" />` : `<div style="width: 70px; height: 85px; background: #e5e7eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #9ca3af;">No Img</div>`}
                </td>
                <td>
                  <div style="font-weight: 600; margin-bottom: 2px;">${i.name}</div>
                  <div style="font-size: 0.8rem; color: #6b7280;">Warna: ${i.color} | Ukuran: ${i.size}</div>
                </td>
                <td>Rp ${new Intl.NumberFormat('id-ID').format(i.price)}</td>
                <td style="text-align: center; font-weight: 600;">${i.quantity}</td>
                <td style="font-weight: 600;">Rp ${new Intl.NumberFormat('id-ID').format(i.price * i.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 16px; background: var(--admin-bg, #F4F7FE); padding: 16px; border-radius: 12px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 6px;">
          <span style="color: #6B7280;">Subtotal</span>
          <span>Rp ${new Intl.NumberFormat('id-ID').format(o.subtotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 6px;">
          <span style="color: #6B7280;">Ongkir</span>
          <span>${o.shippingCost === 0 ? '<span style="color: #059669;">GRATIS</span>' : 'Rp ' + new Intl.NumberFormat('id-ID').format(o.shippingCost)}</span>
        </div>
        ${o.discount > 0 ? `<div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 6px;">
          <span style="color: #6B7280;">Diskon</span>
          <span style="color: #DC2626;">- Rp ${new Intl.NumberFormat('id-ID').format(o.discount)}</span>
        </div>` : ''}
        <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 800; padding-top: 10px; border-top: 2px solid var(--admin-border, #E5E7EB);">
          <span>Total Bayar</span>
          <span>Rp ${new Intl.NumberFormat('id-ID').format(o.total)}</span>
        </div>
      </div>

      <div style="margin-top: 16px; display: flex; gap: 12px;">
        <button class="btn-view" style="background: #E0E7FF; color: #4F46E5; padding: 8px 20px; display: flex; align-items: center; gap: 8px;" onclick="printReceipt('${o.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          Cetak Resi
        </button>
      </div>

      ${o.status === 'rejected' ? `<div style="margin-top: 16px; color: #EF4444; background: #FEE2E2; padding: 12px; border-radius: 8px;"><strong>Alasan Ditolak:</strong> ${o.rejectReason || '-'}</div>` : ''}

      ${o.paymentProof ? `
        <div style="margin-top: 24px; border-top: 1px solid var(--admin-border, #E5E7EB); padding-top: 16px;">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; margin-bottom: 12px; font-weight: 700;">Bukti Pembayaran</div>
          <a href="${o.paymentProof}" target="_blank">
            <img src="${o.paymentProof}" alt="Bukti TF" style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 1px solid #E5E7EB; cursor: zoom-in;" />
          </a>
        </div>
      ` : (!o.paymentMethod.toLowerCase().includes('cod') ? `
        <div style="margin-top: 24px; border-top: 1px solid var(--admin-border, #E5E7EB); padding-top: 16px;">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; margin-bottom: 12px; font-weight: 700;">Bukti Pembayaran</div>
          <div style="padding: 12px; background: #FEF3C7; color: #D97706; border-radius: 8px; font-size: 0.9rem;">Customer belum mengunggah bukti pembayaran.</div>
        </div>
      ` : '')}
    `;

    document.getElementById('detail-content').innerHTML = content;
    detailModal.style.display = 'flex';
  };

  // ========== PRINT FUNCTIONS ==========

  function generateReceiptHTML(o) {
    return `
      <div class="receipt" style="page-break-after: always; padding: 20px; max-width: 700px; margin: 0 auto;">
        <div class="header" style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 1.5rem;">REDLINE TRUCK APPAREL</h1>
          <p style="margin: 5px 0 0 0;">RESI PENGIRIMAN (PACKING SLIP)</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <strong>Order ID:</strong> ${o.orderNumber}<br>
            <strong>Tanggal:</strong> ${new Date(o.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
            <strong>Kurir:</strong> ${o.courier.toUpperCase()}
          </div>
          <div style="text-align: right;">
            <strong>Status:</strong> ${o.status.toUpperCase()}<br>
            <strong>Pembayaran:</strong> ${o.paymentMethod ? o.paymentMethod.toUpperCase() : '-'}
          </div>
        </div>
        
        <div style="border: 1px solid #000; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h3 style="margin: 0 0 8px 0;">Penerima:</h3>
          <div style="font-size: 1.2rem; font-weight: bold;">${o.customerName}</div>
          <div>${o.customerPhone}</div>
          <div style="margin-top: 10px;">
            ${o.shippingAddress}<br>
            ${o.shippingCity}, ${o.shippingProvince}<br>
            Kode Pos: ${o.shippingZip}
          </div>
        </div>
        
        <h3>Daftar Barang (Untuk Packing):</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 8px; text-align: left; background: #f0f0f0;">Produk</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left; background: #f0f0f0;">Varian</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; background: #f0f0f0;">Qty</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: right; background: #f0f0f0;">Harga</th>
            </tr>
          </thead>
          <tbody>
            ${o.items.map(i => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px;"><strong>${i.name}</strong></td>
                <td style="border: 1px solid #000; padding: 8px;">Warna: ${i.color} | Ukuran: ${i.size}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold; font-size: 1.2rem;">${i.quantity}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: right;">Rp ${new Intl.NumberFormat('id-ID').format(i.price * i.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: right; font-weight: bold;">Total:</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: right; font-weight: bold; font-size: 1.1rem;">Rp ${new Intl.NumberFormat('id-ID').format(o.total)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="margin-top: 40px; text-align: center; font-size: 0.9rem;">
          Terima kasih telah berbelanja di Redline Truck Apparel.<br>
          <em>The best or nothing</em>
        </div>
      </div>
    `;
  }

  function openPrintWindow(receiptsHTML, title) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: sans-serif; line-height: 1.5; color: #000; margin: 0; }
            .print-btn { display: block; width: calc(100% - 40px); max-width: 700px; margin: 20px auto; padding: 12px; background: #111; color: #fff; text-align: center; font-weight: bold; cursor: pointer; border: none; border-radius: 8px; font-size: 1rem; }
            @media print { .print-btn { display: none; } body { padding: 0; } .receipt { page-break-after: always; } .receipt:last-child { page-break-after: auto; } }
          </style>
        </head>
        <body>
          <button class="print-btn" onclick="window.print()">🖨️ CETAK SEKARANG</button>
          ${receiptsHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  window.printReceipt = (id) => {
    const o = allOrdersData.find(order => order.id === id);
    if (!o) return;
    openPrintWindow(generateReceiptHTML(o), `Resi - ${o.orderNumber}`);
  };

  // Print selected receipts (checkbox)
  window.printSelectedReceipts = () => {
    const checkboxes = document.querySelectorAll('.order-checkbox:checked');
    if (checkboxes.length === 0) {
      alert('Pilih minimal 1 pesanan untuk dicetak.');
      return;
    }
    const selectedIds = Array.from(checkboxes).map(cb => cb.dataset.orderId);
    const selectedOrders = allOrdersData.filter(o => selectedIds.includes(o.id));
    const receipts = selectedOrders.map(o => generateReceiptHTML(o)).join('');
    openPrintWindow(receipts, `Resi Terpilih (${selectedOrders.length})`);
  };

  // Print all confirmed receipts
  window.printAllReceipts = () => {
    const confirmedOrders = allOrdersData.filter(o => ['processing', 'shipped', 'completed'].includes(o.status));
    if (confirmedOrders.length === 0) {
      alert('Tidak ada pesanan terkonfirmasi untuk dicetak.');
      return;
    }
    const receipts = confirmedOrders.map(o => generateReceiptHTML(o)).join('');
    openPrintWindow(receipts, `Semua Resi (${confirmedOrders.length})`);
  };

  // Select all checkbox
  window.toggleSelectAll = (checked) => {
    document.querySelectorAll('.order-checkbox').forEach(cb => cb.checked = checked);
  };

  // ========== EXPORT EXCEL ==========

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
          'Total Pesanan': o.total,
          'Metode Pembayaran': o.paymentMethod ? o.paymentMethod.toUpperCase() : '-'
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
