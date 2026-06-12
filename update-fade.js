import fs from 'fs';

const files = [
  'akun.html', 'checkout.html', 'faq.html', 'index.html',
  'katalog.html', 'keranjang.html', 'kontak.html', 'produk.html', 'tentang.html'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the previous smooth fade CSS with the new one
    content = content.replace(/<style>\s*\/\* Smooth Fade Transition \*\/[\s\S]*?<\/style>/g, '');
    
    const newStyle = `  <style>
    /* Smooth Fade Transition */
    html { background-color: #f5f5f5; }
    body { opacity: 0.3; transition: opacity 0.5s ease-in-out; }
    body.is-ready { opacity: 1; }
    body.is-animating-out { opacity: 0.3; }
  </style>`;
    
    content = content.replace('</head>', newStyle + '\n</head>');
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
