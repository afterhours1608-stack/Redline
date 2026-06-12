import { checkAdminAuth, setupLogout, fetchWithAuth } from './auth-check.js';

let currentAvatarUrl = null;

async function init() {
  const token = checkAdminAuth();
  if (!token) return;
  setupLogout();

  // Load current profile data from token
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    document.getElementById('profile-name').value = payload.name || '';
    document.getElementById('profile-email').value = payload.email || '';
    
    if (payload.avatar) {
      currentAvatarUrl = payload.avatar;
      document.getElementById('avatar-preview').src = payload.avatar;
    }
  } catch(e) {
    console.error('Failed to parse token payload');
  }

  setupAvatarUpload();
  setupFormSubmit();
}

function setupAvatarUpload() {
  const input = document.getElementById('avatar-upload');
  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show loading
    const msg = document.getElementById('profile-message');
    msg.textContent = 'Mengunggah gambar...';
    msg.style.color = '#3B82F6';

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetchWithAuth('http://localhost:5000/api/settings/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.url) {
        currentAvatarUrl = 'http://localhost:5000' + data.url;
        document.getElementById('avatar-preview').src = currentAvatarUrl;
        msg.textContent = 'Gambar berhasil diunggah! Jangan lupa klik Simpan Perubahan.';
        msg.style.color = '#10B981';
      } else {
        throw new Error('No URL returned');
      }
    } catch(err) {
      msg.textContent = 'Gagal mengunggah gambar.';
      msg.style.color = '#EF4444';
      console.error(err);
    }
  });
}

function setupFormSubmit() {
  const form = document.getElementById('profile-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-save-profile');
    const msg = document.getElementById('profile-message');
    
    btn.disabled = true;
    btn.textContent = 'Menyimpan...';
    
    const name = document.getElementById('profile-name').value;
    const password = document.getElementById('profile-password').value;

    const payload = {
      name,
      avatar: currentAvatarUrl
    };
    if (password) payload.password = password;

    try {
      const res = await fetchWithAuth('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok && data.token) {
        // Update token in localStorage
        localStorage.setItem('adminToken', data.token);
        msg.textContent = 'Profil berhasil disimpan!';
        msg.style.color = '#10B981';
        
        // Clear password field
        document.getElementById('profile-password').value = '';
        
        // Update header avatar manually
        const headerAvatar = document.getElementById('header-avatar');
        if (headerAvatar && currentAvatarUrl) {
          headerAvatar.src = currentAvatarUrl;
        }
      } else {
        throw new Error(data.error || 'Failed to update');
      }
    } catch(err) {
      msg.textContent = err.message;
      msg.style.color = '#EF4444';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Simpan Perubahan';
    }
  });
}

init();
