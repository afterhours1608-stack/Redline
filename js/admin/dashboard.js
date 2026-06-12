import { checkAdminAuth, setupLogout, fetchWithAuth } from './auth-check.js';

async function init() {
  if (!checkAdminAuth()) return;
  setupLogout();

  // Mobile Menu Toggle
  const toggleBtn = document.getElementById('admin-menu-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('admin-menu-overlay');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.add('active');
      overlay.classList.add('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  try {
    const res = await fetchWithAuth('/api/dashboard');
    if (!res) return;
    const data = await res.json();
    
    // Init Charts
    initCharts(data.charts);

    document.getElementById('metric-revenue').textContent = `Rp ${new Intl.NumberFormat('id-ID').format(data.metrics.revenue)}`;
    document.getElementById('metric-orders').textContent = data.metrics.totalOrders;
    document.getElementById('metric-pending').textContent = data.metrics.pendingOrders;
    document.getElementById('metric-products').textContent = data.metrics.totalProducts;

    const list = document.getElementById('recent-orders-list');
    if (data.recentOrders.length === 0) {
      list.innerHTML = '<tr><td colspan="5" style="text-align: center;">Belum ada pesanan</td></tr>';
    } else {
      list.innerHTML = data.recentOrders.map(o => `
        <tr>
          <td><a href="/admin/orders.html">${o.orderNumber}</a></td>
          <td>${o.customerName}</td>
          <td>${new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
          <td><span class="status-pill ${o.status.toLowerCase()}">${o.status}</span></td>
          <td><button class="btn-view" onclick="window.location.href='/admin/orders.html'">View</button></td>
        </tr>
      `).join('');
    }
  } catch (err) {
    console.error('Failed to load dashboard', err);
  }
}

function initCharts(chartsData) {
  if (!chartsData) return;
  const { salesData, trendData } = chartsData;

  const salesCtx = document.getElementById('salesChart');
  if (salesCtx) {
    new Chart(salesCtx, {
      type: 'bar',
      data: {
        labels: salesData.labels,
        datasets: [{
          label: 'Total Sales (Rp)',
          data: salesData.current,
          backgroundColor: '#3B82F6',
          borderRadius: 4
        }, {
          label: 'Previous',
          data: salesData.previous,
          backgroundColor: '#EFF6FF',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { borderDash: [5, 5] } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  const orderCtx = document.getElementById('orderTrendChart');
  if (orderCtx) {
    new Chart(orderCtx, {
      type: 'line',
      data: {
        labels: trendData.labels,
        datasets: [
          {
            label: 'Completed/Shipped',
            data: trendData.completed,
            borderColor: '#10B981',
            tension: 0.4,
            borderDash: [5, 5]
          },
          {
            label: 'Pending (New)',
            data: trendData.pending,
            borderColor: '#F59E0B',
            tension: 0.4,
            borderDash: [5, 5]
          },
          {
            label: 'Cancelled/Rejected',
            data: trendData.rejected,
            borderColor: '#EF4444',
            tension: 0.4,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { usePointStyle: true } }
        },
        scales: {
          y: { beginAtZero: true, grid: { borderDash: [5, 5] } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}

init();
