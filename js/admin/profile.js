import { checkAdminAuth, setupLogout, fetchWithAuth } from './auth-check.js';

let currentAvatarUrl = null;

async function init() {
  const token = checkAdminAuth();
  if (!token) return;
  setupLogout();

  // Load current profile data from token
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const avatarPreview = document.getElementById('avatar-preview');
    
    if (nameInput) nameInput.value = payload.name || '';
    if (emailInput) emailInput.value = payload.email || '';
    
    if (payload.avatar && avatarPreview) {
      currentAvatarUrl = payload.avatar;
      avatarPreview.src = payload.avatar;
    }
  } catch(e) {
    console.error('Failed to parse token payload:', e);
  }

  setupAvatarUpload();
  setupFormSubmit();
}

function setupAvatarUpload() {
  const input = document.getElementById('avatar-upload');
  if (!input) return;

  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showMessage('Ukuran file maksimal 2MB.', '#EF4444');
      return;
    }

    showMessage('Mengunggah gambar...', '#3B82F6');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetchWithAuth('/api/settings/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!res) {
        showMessage('Sesi habis, silakan login ulang.', '#EF4444');
        return;
      }

      const data = await res.json();
      
      if (data.url) {
        currentAvatarUrl = '' + data.url;
        const avatarPreview = document.getElementById('avatar-preview');
        if (avatarPreview) avatarPreview.src = currentAvatarUrl;
        showMessage('Gambar berhasil diunggah! Jangan lupa klik Simpan Perubahan.', '#10B981');
      } else {
        throw new Error('No URL returned');
      }
    } catch(err) {
      showMessage('Gagal mengunggah gambar: ' + (err.message || 'Unknown error'), '#EF4444');
      console.error(err);
    }
  });
}

function setupFormSubmit() {
  const form = document.getElementById('profile-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-save-profile');
    
    const name = document.getElementById('profile-name').value.trim();
    const password = document.getElementById('profile-password').value;

    // Validate name
    if (!name) {
      showMessage('Nama tidak boleh kosong.', '#EF4444');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Menyimpan...';

    const payload = {
      name,
      avatar: currentAvatarUrl
    };
    if (password) payload.password = password;

    try {
      const res = await fetchWithAuth('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res) {
        showMessage('Sesi habis, silakan login ulang.', '#EF4444');
        btn.disabled = false;
        btn.textContent = 'Simpan Perubahan';
        return;
      }

      const data = await res.json();
      if (res.ok && data.token) {
        // Update token in localStorage
        localStorage.setItem('adminToken', data.token);
        showMessage('Profil berhasil disimpan!', '#10B981');
        
        // Clear password field
        document.getElementById('profile-password').value = '';
        
        // Update header avatar
        const headerAvatar = document.getElementById('header-avatar');
        if (headerAvatar && currentAvatarUrl) {
          headerAvatar.src = currentAvatarUrl;
        }
      } else {
        throw new Error(data.error || 'Failed to update');
      }
    } catch(err) {
      showMessage('Gagal menyimpan: ' + (err.message || 'Terjadi kesalahan'), '#EF4444');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Simpan Perubahan';
    }
  });
}

function showMessage(text, color) {
  const msg = document.getElementById('profile-message');
  if (msg) {
    msg.textContent = text;
    msg.style.color = color;
  }
}

init();
