import { checkAdminAuth, setupLogout, fetchWithAuth } from './auth-check.js';

let allLeads = [];

async function init() {
  if (!checkAdminAuth()) return;
  setupLogout();

  await fetchLeads();
  setupSearch();
}

async function fetchLeads() {
  const tbody = document.getElementById('leads-table-body');
  try {
    const res = await fetchWithAuth('/api/users/customers');
    if (!res) return; // fetchWithAuth handles redirect on 401/403
    
    const data = await res.json();
    
    // Check if response is actually an array
    if (Array.isArray(data)) {
      allLeads = data;
    } else {
      console.error('API Error:', data);
      allLeads = []; // Default to empty array to prevent map() crash
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--color-danger);">Gagal memuat data: ${data.error || 'Server error'}</td></tr>`;
      return;
    }
    
    renderLeads(allLeads);
  } catch (err) {
    console.error('Failed to fetch leads', err);
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--color-danger);">Terjadi kesalahan koneksi saat memuat data pelanggan.</td></tr>';
  }
}

function renderLeads(leads) {
  const tbody = document.getElementById('leads-table-body');
  
  if (leads.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Belum ada pelanggan yang mendaftar.</td></tr>';
    return;
  }

  tbody.innerHTML = leads.map(lead => `
    <tr>
      <td><div style="font-weight: 500; color: #111827;">${lead.name}</div></td>
      <td>${lead.email}</td>
      <td>${lead.phone || '<span style="color:#9CA3AF;">Belum diisi</span>'}</td>
      <td>${new Date(lead.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
      <td>
        <a href="mailto:${lead.email}" class="btn-view" style="text-decoration: none; display: inline-block;">Email</a>
        ${lead.phone ? `<a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}" target="_blank" class="btn-view" style="text-decoration: none; display: inline-block; background: #10B981; color: white;">WA</a>` : ''}
      </td>
    </tr>
  `).join('');
}

function setupSearch() {
  const searchInput = document.getElementById('search-leads');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = allLeads.filter(lead => 
        lead.name.toLowerCase().includes(q) || 
        lead.email.toLowerCase().includes(q) ||
        (lead.phone && lead.phone.includes(q))
      );
      renderLeads(filtered);
    });
  }
}

init();
