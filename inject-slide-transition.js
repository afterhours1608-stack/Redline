import fs from 'fs';

const files = [
  'akun.html', 'checkout.html', 'faq.html', 'index.html',
  'katalog.html', 'keranjang.html', 'kontak.html', 'produk.html', 'tentang.html'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove previous transition code
    content = content.replace(/<meta name="view-transition"[^>]*>/g, '');
    content = content.replace(/<style>[\s\S]*?<\/style>/g, '');
    content = content.replace(/<div class="page-transition-overlay"><\/div>/g, '');
    content = content.replace(/<div class="slide-overlay"><\/div>/g, '');

    const newStyle = `  <style>
    /* Smooth Page Transitions */
    html { background-color: #111; }
    body { opacity: 0; transition: opacity 0.1s; overflow-x: hidden; }
    body.is-ready { opacity: 1; background-color: #fff; }
    
    .slide-overlay {
      position: fixed;
      inset: 0;
      background-color: #111;
      z-index: 999999;
      pointer-events: none;
      transform: translateY(100%);
      transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
    }
    body.is-animating-out .slide-overlay {
      transform: translateY(0);
    }
    body.is-ready .page-wrapper {
      animation: pageReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes pageReveal {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>`;
    
    content = content.replace('</head>', newStyle + '\n</head>');
    content = content.replace('<body>', '<body>\n  <div class="slide-overlay"></div>');
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
