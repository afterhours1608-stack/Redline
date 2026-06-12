import fs from 'fs';

const files = [
  'akun.html', 'checkout.html', 'faq.html', 'index.html',
  'katalog.html', 'keranjang.html', 'kontak.html', 'produk.html', 'tentang.html'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove previous transition code
    content = content.replace(/<style>[\s\S]*?<\/style>/g, '');
    content = content.replace(/<div class="slide-overlay"><\/div>/g, '');
    
    // Add the smooth fade transition
    const newStyle = `  <style>
    /* Smooth Fade Transition */
    html { background-color: #ffffff; }
    body { opacity: 0; transition: opacity 0.6s ease-in-out; }
    body.is-ready { opacity: 1; }
    body.is-animating-out { opacity: 0; }
  </style>`;
    
    content = content.replace('</head>', newStyle + '\n</head>');
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
