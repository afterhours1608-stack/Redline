import { checkAdminAuth, setupLogout, fetchWithAuth } from './auth-check.js';

async function init() {
  if (!checkAdminAuth()) return;
  setupLogout();

  const ids = ['announcement', 'hero_tagline', 'hero_title', 'logo_url', 'banner_url'];
  
  // Load data
  try {
    const res = await fetchWithAuth('/api/settings');
    if (!res) return;
    const data = await res.json();
    
    ids.forEach(id => {
      if (data[id]) {
        document.getElementById(id).value = data[id];
      }
    });
    
    if (data.logo_url) document.getElementById('logo_preview').src = data.logo_url.startsWith('http') ? data.logo_url : `${data.logo_url}`;
    if (data.banner_url) document.getElementById('banner_preview').src = data.banner_url.startsWith('http') ? data.banner_url : `${data.banner_url}`;

    if (data.flashSale) {
      document.getElementById('fs_active').checked = data.flashSale.isActive;
      document.getElementById('fs_title').value = data.flashSale.title;
      if (data.flashSale.endTime) {
        // format to datetime-local
        const date = new Date(data.flashSale.endTime);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        document.getElementById('fs_end').value = date.toISOString().slice(0, 16);
      }
    }
  } catch (err) {
    console.error(err);
  }

  // Upload handler helper
  async function handleUpload(inputId, hiddenId, previewId) {
    const fileInput = document.getElementById(inputId);
    if (!fileInput.files.length) return;

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    const res = await fetchWithAuth('/api/settings/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.url) {
      document.getElementById(hiddenId).value = data.url;
      document.getElementById(previewId).src = `${data.url}`;
    }
  }

  document.getElementById('logo_upload').addEventListener('change', () => handleUpload('logo_upload', 'logo_url', 'logo_preview'));
  document.getElementById('banner_upload').addEventListener('change', () => handleUpload('banner_upload', 'banner_url', 'banner_preview'));

  // Save changes
  document.getElementById('content-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('save-btn');
    saveBtn.textContent = 'Menyimpan...';
    saveBtn.disabled = true;

    const settings = {};
    ids.forEach(id => {
      settings[id] = document.getElementById(id).value;
    });

    const flashSale = {
      isActive: document.getElementById('fs_active').checked,
      title: document.getElementById('fs_title').value,
      endTime: document.getElementById('fs_end').value ? new Date(document.getElementById('fs_end').value).toISOString() : null
    };

    try {
      const res = await fetchWithAuth('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, flashSale })
      });
      if (res && res.ok) {
        const toast = document.getElementById('toast');
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      saveBtn.textContent = 'Simpan Perubahan';
      saveBtn.disabled = false;
    }
  });
}

init();
