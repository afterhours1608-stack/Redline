const fs = require('fs');

const files = [
  'admin/index.html', 
  'admin/products.html', 
  'admin/orders.html', 
  'admin/profile.html', 
  'admin/leads.html', 
  'admin/content.html'
];

const link = `<a href="/admin/payments.html" class="admin-nav__link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        Pembayaran
      </a>
      `;

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    // Remove if already added
    c = c.replace(/<a href="\/admin\/payments\.html".*?<\/a>\s+/gs, '');
    
    // Add before Profile
    c = c.replace(/(<a href="\/admin\/profile\.html" class="admin-nav__link(?: active)?">)/, link + '$1');
    fs.writeFileSync(f, c);
  }
});
console.log('Sidebar updated');
