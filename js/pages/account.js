// ===========================
// REDLINE — Account Page Logic
// ===========================

export function initAccountPage() {
  if (checkAuth()) {
    initTabs();
    renderOrders();
    renderAddresses();
    initForms();
  }
}

function checkAuth() {
  const userJson = localStorage.getItem('redline_user');
  const guestView = document.getElementById('guest-view');
  const authView = document.getElementById('auth-view');
  
  if (!userJson) {
    // Show Guest View
    if (guestView) guestView.style.display = 'flex';
    if (authView) authView.style.display = 'none';
    initAuthModal();
    return false;
  } else {
    // Show Auth View
    if (guestView) guestView.style.display = 'none';
    if (authView) authView.style.display = 'grid';
    
    // Populate user data
    const user = JSON.parse(userJson);
    const displayNames = document.querySelectorAll('#display-user-name, #welcome-name');
    const displayEmails = document.querySelectorAll('#display-user-email');
    
    displayNames.forEach(el => el.textContent = user.name || 'Pengguna');
    displayEmails.forEach(el => el.textContent = user.email);
    
    // Pre-fill profile form
    const inputName = document.getElementById('input-profile-name');
    const inputEmail = document.getElementById('input-profile-email');
    if (inputName) inputName.value = user.name || '';
    if (inputEmail) inputEmail.value = user.email || '';
    
    return true;
  }
}

function initAuthModal() {
  const modal = document.getElementById('auth-modal');
  const btnRegister = document.getElementById('btn-show-register');
  const btnLogin = document.getElementById('btn-show-login');
  const btnClose = document.getElementById('auth-modal-close');
  const title = document.getElementById('auth-modal-title');
  const groupName = document.getElementById('group-name');
  const submitBtn = document.getElementById('auth-submit-btn');
  const form = document.getElementById('auth-form');
  
  let isLogin = false;

  const openModal = (mode) => {
    isLogin = mode === 'login';
    title.textContent = isLogin ? 'Login Akun' : 'Daftar Akun';
    submitBtn.textContent = isLogin ? 'Login' : 'Daftar';
    groupName.style.display = isLogin ? 'none' : 'block';
    
    // reset required
    document.getElementById('auth-name').required = !isLogin;
    
    modal.classList.add('active');
  };

  btnRegister?.addEventListener('click', () => openModal('register'));
  btnLogin?.addEventListener('click', () => openModal('login'));
  
  btnClose?.addEventListener('click', () => {
    modal.classList.remove('active');
  });
  
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const name = document.getElementById('auth-name').value || email.split('@')[0];
    
    // Simulate API call and save to localStorage
    const user = { name, email };
    localStorage.setItem('redline_user', JSON.stringify(user));
    
    // Reload to apply auth state
    window.location.reload();
  });
}

function initTabs() {
  const menuItems = document.querySelectorAll('.account-menu__item[data-target]');
  const sections = document.querySelectorAll('.account-section');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      // Update menu state
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Update section state
      const targetId = item.dataset.target;
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(targetId)?.classList.add('active');
      
      // Handle mobile scroll to top
      if (window.innerWidth <= 768) {
        window.scrollTo({ top: document.querySelector('.account-content').offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

  // Handle logout
  document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('redline_user');
      window.location.reload();
    }
  });
}

function renderOrders() {
  const container = document.getElementById('orders-container');
  if (!container) return;

  // Mock data
  const orders = [
    { id: 'RL-XK9Q2M', date: '2026-06-05', total: 465000, status: 'shipped', statusText: 'Sedang Dikirim', resi: 'JP1234567890' },
    { id: 'RL-A7B4C2', date: '2026-05-12', total: 215000, status: 'completed', statusText: 'Selesai', resi: 'JP0987654321' },
    { id: 'RL-F3D8E1', date: '2026-04-20', total: 680000, status: 'completed', statusText: 'Selesai', resi: 'JP5678123490' }
  ];

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="account-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
        <p>Anda belum pernah melakukan pemesanan.</p>
        <a href="/katalog.html" class="btn btn--outline btn--sm" style="margin-top: var(--space-4);">Mulai Belanja</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="overflow-x: auto;">
      <table class="orders-table">
        <thead>
          <tr>
            <th>No. Pesanan</th>
            <th>Tanggal</th>
            <th>Total</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(o => `
            <tr>
              <td style="font-weight: 500;">${o.id}</td>
              <td>${new Date(o.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
              <td>Rp ${new Intl.NumberFormat('id-ID').format(o.total)}</td>
              <td><span class="order-status order-status--${o.status}">${o.statusText}</span></td>
              <td>
                <button class="btn btn--outline" style="padding: var(--space-1) var(--space-3); font-size: var(--font-size-xs); min-height: 28px;" onclick="alert('Lacak pesanan: ${o.resi}')" ${o.status === 'processing' ? 'disabled' : ''}>Lacak</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderAddresses() {
  const container = document.getElementById('address-container');
  if (!container) return;

  const addresses = [
    { id: 1, label: 'Rumah', name: 'Budi Santoso', phone: '081234567890', address: 'Jl. Merdeka No. 123, RT 01/RW 02', region: 'Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12110', isDefault: true },
    { id: 2, label: 'Kantor', name: 'Budi Santoso', phone: '081234567890', address: 'Gedung Sudirman Tower Lt. 15', region: 'Setiabudi, Jakarta Selatan, DKI Jakarta 12910', isDefault: false }
  ];

  container.innerHTML = `
    <div class="address-grid">
      ${addresses.map(a => `
        <div class="address-card">
          ${a.isDefault ? '<span class="address-card__default-badge">Utama</span>' : ''}
          <div class="address-card__name">${a.label} — ${a.name}</div>
          <div class="address-card__text">
            ${a.phone}<br>
            ${a.address}<br>
            ${a.region}
          </div>
          <div class="address-card__actions">
            <button class="address-card__btn" onclick="alert('Edit alamat')">Edit</button>
            ${!a.isDefault ? `<button class="address-card__btn address-card__btn--danger" onclick="confirm('Hapus alamat ini?')">Hapus</button>` : ''}
          </div>
        </div>
      `).join('')}
      <div class="address-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; border-style: dashed; background: var(--color-surface);" onclick="alert('Tambah alamat baru')">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: var(--space-2); color: var(--color-text-secondary);">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span style="font-size: var(--font-size-sm); font-weight: 500; color: var(--color-text-secondary);">Tambah Alamat</span>
      </div>
    </div>
  `;
}

function initForms() {
  document.getElementById('profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    import('../utils/helpers.js').then(({ showToast }) => {
      showToast('Profil berhasil diperbarui!');
    });
  });

  document.getElementById('password-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-password').value;
    
    if (newPass !== confirmPass) {
      alert('Konfirmasi password tidak cocok!');
      return;
    }
    
    import('../utils/helpers.js').then(({ showToast }) => {
      showToast('Password berhasil diubah!');
      e.target.reset();
    });
  });
}
