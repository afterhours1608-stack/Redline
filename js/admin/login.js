document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errDiv = document.getElementById('login-error');

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (res.ok && data.user.role === 'admin') {
      localStorage.setItem('adminToken', data.token);
      window.location.href = '/admin/index.html';
    } else {
      errDiv.textContent = data.error || 'Akses ditolak';
      errDiv.style.display = 'block';
    }
  } catch (err) {
    errDiv.textContent = 'Gagal terhubung ke server';
    errDiv.style.display = 'block';
  }
});
