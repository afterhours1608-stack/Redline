import fs from 'fs';

const files = [
  'akun.html', 'checkout.html', 'faq.html', 'index.html',
  'katalog.html', 'keranjang.html', 'kontak.html', 'produk.html', 'tentang.html'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if already added
    if (!content.includes('<meta name="view-transition"')) {
      const insertion = `  <meta name="view-transition" content="same-origin">\n  <style>\n    @view-transition { navigation: auto; }\n    body { animation: fadeIn 0.4s ease forwards; }\n    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n    .page-exit { animation: fadeOut 0.3s ease forwards; }\n    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }\n  </style>\n</head>`;
      content = content.replace('</head>', insertion);
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  }
}
