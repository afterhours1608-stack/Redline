import { checkAdminAuth, setupLogout, fetchWithAuth } from './auth-check.js';

let allProductsData = [];
let currentEditId = null;

async function init() {
  if (!checkAdminAuth()) return;
  setupLogout();

  const list = document.getElementById('products-list');
  const modal = document.getElementById('product-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const form = document.getElementById('product-form');
  const addBtn = document.getElementById('add-product-btn');

  async function loadProducts() {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      allProductsData = await res.json();
      
      if (allProductsData.length === 0) {
        list.innerHTML = '<tr><td colspan="5" style="text-align: center;">Belum ada produk</td></tr>';
        return;
      }

      list.innerHTML = allProductsData.map(p => `
        <tr>
          <td><img src="${p.images[0] ? (p.images[0].startsWith('http') ? p.images[0] : 'http://localhost:5000'+p.images[0]) : ''}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" /></td>
          <td><strong>${p.name}</strong></td>
          <td>Rp ${new Intl.NumberFormat('id-ID').format(p.price)}</td>
          <td>
            <span class="status-pill published" style="background: #EFF6FF; color: #3B82F6;">${p.category ? p.category.name : '-'}</span>
            <div style="font-size: 0.8rem; margin-top: 4px; color: #6B7280;">${p.variants.reduce((acc, v) => acc + v.stock, 0)} in stock</div>
          </td>
          <td>
            <div style="display: flex; gap: 8px;">
              <button class="btn-view" onclick="editProduct('${p.id}')">Edit</button>
              <button class="btn-view" style="background: #FEE2E2; color: #EF4444;" onclick="deleteProduct('${p.id}')">Hapus</button>
            </div>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      list.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Gagal memuat produk</td></tr>';
    }
  }

  window.deleteProduct = async (id) => {
    if (!confirm('Hapus produk ini?')) return;
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      if (res && res.ok) loadProducts();
    } catch (err) {
      alert('Gagal menghapus');
    }
  };

  window.editProduct = (id) => {
    const p = allProductsData.find(prod => prod.id === id);
    if (!p) return;

    currentEditId = id;
    document.querySelector('#product-modal h2').textContent = 'Edit Produk';
    
    document.getElementById('prod-name').value = p.name || '';
    document.getElementById('prod-slug').value = p.slug || '';
    document.getElementById('prod-price').value = p.price || '';
    document.getElementById('prod-sale').value = p.salePrice || '';
    document.getElementById('prod-category').value = p.categoryId || '';
    document.getElementById('prod-desc').value = p.description || '';
    document.getElementById('prod-badge').value = p.badge || '';

    // Images
    const imgIds = ['main', 'front', 'back', 'detail', 'opt1', 'opt2', 'opt3'];
    imgIds.forEach((suffix, idx) => {
      const url = p.images[idx] || '';
      document.getElementById(`prod-img-${suffix}`).value = url;
      const preview = document.getElementById(`preview-img-${suffix}`);
      if (url) {
        preview.src = url.startsWith('http') ? url : `http://localhost:5000${url}`;
        preview.style.display = 'block';
      } else {
        preview.style.display = 'none';
        preview.src = '';
      }
    });

    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
  };

  async function loadCategories() {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      const categories = await res.json();
      const select = document.getElementById('prod-category');
      
      if (categories.length === 0) {
        select.innerHTML = '<option value="">Belum ada kategori</option>';
        return;
      }
      
      select.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } catch (err) {
      document.getElementById('prod-category').innerHTML = '<option value="">Gagal memuat kategori</option>';
    }
  }

  loadProducts();
  loadCategories();

  addBtn.addEventListener('click', () => {
    currentEditId = null;
    document.querySelector('#product-modal h2').textContent = 'Tambah Produk Baru';
    form.reset();
    ['preview-img-main', 'preview-img-front', 'preview-img-back', 'preview-img-detail', 'preview-img-opt1', 'preview-img-opt2', 'preview-img-opt3'].forEach(id => {
      document.getElementById(id).style.display = 'none';
      document.getElementById(id).src = '';
    });
    ['prod-img-main', 'prod-img-front', 'prod-img-back', 'prod-img-detail', 'prod-img-opt1', 'prod-img-opt2', 'prod-img-opt3'].forEach(id => {
      document.getElementById(id).value = '';
    });
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
  });

  document.getElementById('prod-name').addEventListener('input', (e) => {
    if (!currentEditId) { // only auto slug on create
      document.getElementById('prod-slug').value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
  });

  async function handleImageUpload(inputId, hiddenId, previewId) {
    const fileInput = document.getElementById(inputId);
    const hiddenInput = document.getElementById(hiddenId);
    const previewImg = document.getElementById(previewId);

    if (!fileInput.files.length) return;

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    try {
      const res = await fetchWithAuth('http://localhost:5000/api/products/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        hiddenInput.value = data.url;
        previewImg.src = `http://localhost:5000${data.url}`;
        previewImg.style.display = 'block';
      }
    } catch (err) {
      alert('Gagal mengunggah gambar');
    }
  }

  document.getElementById('upload-img-main').addEventListener('change', () => handleImageUpload('upload-img-main', 'prod-img-main', 'preview-img-main'));
  document.getElementById('upload-img-front').addEventListener('change', () => handleImageUpload('upload-img-front', 'prod-img-front', 'preview-img-front'));
  document.getElementById('upload-img-back').addEventListener('change', () => handleImageUpload('upload-img-back', 'prod-img-back', 'preview-img-back'));
  document.getElementById('upload-img-detail').addEventListener('change', () => handleImageUpload('upload-img-detail', 'prod-img-detail', 'preview-img-detail'));
  document.getElementById('upload-img-opt1').addEventListener('change', () => handleImageUpload('upload-img-opt1', 'prod-img-opt1', 'preview-img-opt1'));
  document.getElementById('upload-img-opt2').addEventListener('change', () => handleImageUpload('upload-img-opt2', 'prod-img-opt2', 'preview-img-opt2'));
  document.getElementById('upload-img-opt3').addEventListener('change', () => handleImageUpload('upload-img-opt3', 'prod-img-opt3', 'preview-img-opt3'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = form.querySelector('button[type="submit"]');
    saveBtn.disabled = true;
    saveBtn.innerText = 'Menyimpan...';

    const payload = {
      name: document.getElementById('prod-name').value,
      slug: document.getElementById('prod-slug').value,
      categoryId: document.getElementById('prod-category').value,
      price: parseInt(document.getElementById('prod-price').value),
      salePrice: document.getElementById('prod-sale').value ? parseInt(document.getElementById('prod-sale').value) : null,
      description: document.getElementById('prod-desc').value,
      badge: document.getElementById('prod-badge').value || null,
      images: [
        document.getElementById('prod-img-main').value,
        document.getElementById('prod-img-front').value,
        document.getElementById('prod-img-back').value,
        document.getElementById('prod-img-detail').value,
        document.getElementById('prod-img-opt1').value,
        document.getElementById('prod-img-opt2').value,
        document.getElementById('prod-img-opt3').value
      ].filter(url => url !== ""),
    };

    if (!currentEditId) {
      payload.variants = [
        { size: 'All Size', color: 'Hitam', stock: 10 }
      ];
    }

    if (payload.images.length === 0) {
      alert('Mohon unggah Gambar Utama terlebih dahulu.');
      saveBtn.disabled = false;
      saveBtn.innerText = 'Simpan Produk';
      return;
    }

    const url = currentEditId ? `http://localhost:5000/api/products/${currentEditId}` : 'http://localhost:5000/api/products';
    const method = currentEditId ? 'PUT' : 'POST';

    try {
      const res = await fetchWithAuth(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res && res.ok) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
        loadProducts();
      } else {
        const err = await res.json();
        alert('Gagal: ' + (err.error || 'Terjadi kesalahan'));
      }
    } catch (err) {
      alert('Gagal menyimpan produk');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerText = 'Simpan Produk';
    }
  });
}

init();
