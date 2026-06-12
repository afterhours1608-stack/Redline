export function checkAdminAuth() {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = '/admin/login.html';
    return null;
  }
  return token;
}

export function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login.html';
    });
  }

  // Mobile menu toggle
  const menuToggle = document.getElementById('admin-menu-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('admin-menu-overlay');

  if (menuToggle && sidebar && overlay) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.add('active');
      overlay.classList.add('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  // Load avatar and name to header
  const token = checkAdminAuth();
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const headerAvatar = document.getElementById('header-avatar');
      const adminUserName = document.getElementById('admin-user-name');
      
      if (headerAvatar && payload.avatar) {
        headerAvatar.src = payload.avatar;
      }
      if (adminUserName && payload.name) {
        adminUserName.textContent = payload.name;
      }
    } catch(e) {}
  }
}

export async function fetchWithAuth(url, options = {}) {
  const token = checkAdminAuth();
  if (!token) return null;

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login.html';
    return null;
  }

  return response;
}
