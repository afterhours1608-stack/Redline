// ===========================
// REDLINE — Footer Component
// ===========================

export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer__grid">
        <!-- Brand Column -->
        <div class="footer__col footer__col--brand">
          <a href="/" class="footer__logo">
            <span class="footer__logo-text">REDLINE</span>
            <span class="footer__logo-sub">TRUCK APPAREL</span>
          </a>
          <p class="footer__desc">
            Apparel premium untuk komunitas pengemudi truk, mekanik, dan penggemar otomotif berat Mercedes-Benz di Indonesia.
          </p>
          <div class="footer__social">
            <a href="#" class="footer__social-link" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" class="footer__social-link" aria-label="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.4a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.08a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.51z"/></svg>
            </a>
            <a href="#" class="footer__social-link" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" class="footer__social-link" aria-label="YouTube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        <!-- Products Column -->
        <div class="footer__col">
          <h4 class="footer__heading">Produk</h4>
          <ul class="footer__links">
            <li><a href="/katalog.html?cat=kaos-pria">Kaos Pria</a></li>
            <li><a href="/katalog.html?cat=kaos-wanita">Kaos Wanita</a></li>
            <li><a href="/katalog.html?cat=kaos-anak">Kaos Anak</a></li>
            <li><a href="/katalog.html?cat=hoodie">Hoodie</a></li>
            <li><a href="/katalog.html?cat=topi">Topi</a></li>
            <li><a href="/katalog.html?cat=aksesori">Aksesori</a></li>
            <li><a href="/katalog.html?sale=true">Sale</a></li>
          </ul>
        </div>

        <!-- Information Column -->
        <div class="footer__col">
          <h4 class="footer__heading">Informasi</h4>
          <ul class="footer__links">
            <li><a href="/tentang.html">Tentang Kami</a></li>
            <li><a href="/faq.html">FAQ</a></li>
            <li><a href="/kontak.html">Hubungi Kami</a></li>
            <li><a href="#">Kebijakan Pengembalian</a></li>
            <li><a href="#">Syarat & Ketentuan</a></li>
            <li><a href="#">Kebijakan Privasi</a></li>
          </ul>
        </div>

        <!-- Contact Column -->
        <div class="footer__col">
          <h4 class="footer__heading">Hubungi Kami</h4>
          <ul class="footer__links footer__contact">
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <a href="mailto:info@redline.co.id">info@redline.co.id</a>
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <a href="https://wa.me/6281234567890">+62 812-3456-7890</a>
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Jakarta, Indonesia</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Payment & Shipping -->
      <div class="footer__bottom-info">
        <div class="footer__payment">
          <span class="footer__payment-label">Pembayaran:</span>
          <div class="footer__payment-icons">
            <span class="payment-icon">QRIS</span>
            <span class="payment-icon">BCA</span>
            <span class="payment-icon">Mandiri</span>
            <span class="payment-icon">BNI</span>
            <span class="payment-icon">GoPay</span>
            <span class="payment-icon">OVO</span>
            <span class="payment-icon">Dana</span>
          </div>
        </div>
        <div class="footer__shipping">
          <span class="footer__payment-label">Pengiriman:</span>
          <div class="footer__payment-icons">
            <span class="payment-icon">JNE</span>
            <span class="payment-icon">J&T</span>
            <span class="payment-icon">SiCepat</span>
            <span class="payment-icon">AnterAja</span>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="footer__copyright">
        <p>&copy; 2026 REDLINE Truck Apparel. All rights reserved.</p>
      </div>
    </div>
  `;

  document.body.appendChild(footer);
}
