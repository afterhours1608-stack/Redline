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

  // Setup theme toggle
  setupThemeToggle();
}

function setupThemeToggle() {
  // Apply saved theme on load
  const savedTheme = localStorage.getItem('adminTheme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  // Find theme toggle buttons
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;

  const buttons = themeToggle.querySelectorAll('button');
  if (buttons.length < 2) return;

  const [lightBtn, darkBtn] = buttons;

  // Set initial active state
  if (savedTheme === 'dark') {
    lightBtn.classList.remove('active');
    darkBtn.classList.add('active');
  } else {
    lightBtn.classList.add('active');
    darkBtn.classList.remove('active');
  }

  lightBtn.addEventListener('click', () => {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('adminTheme', 'light');
    lightBtn.classList.add('active');
    darkBtn.classList.remove('active');
  });

  darkBtn.addEventListener('click', () => {
    document.body.classList.add('dark-mode');
    localStorage.setItem('adminTheme', 'dark');
    darkBtn.classList.add('active');
    lightBtn.classList.remove('active');
  });
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
