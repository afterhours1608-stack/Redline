import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@redline.com' },
    update: {},
    create: {
      email: 'admin@redline.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('Admin created:', admin.email)

  // Default Site Settings
  const defaultSettings = [
    { key: 'hero_title', value: 'BUILT FOR THE ROAD.\nWORN WITH PRIDE.', description: 'Teks utama di landing page' },
    { key: 'hero_tagline', value: 'Mercedes-Benz Truck Apparel Indonesia', description: 'Teks kecil di atas teks utama' },
    { key: 'logo_url', value: '/images/redline_logo_text.png', description: 'URL gambar logo' },
    { key: 'banner_url', value: 'https://imgcdn.oto.com/large/gallery/exterior/127/2172/mercedes-benz-actros-front-angle-low-view-133263.jpg', description: 'URL gambar background hero' },
    { key: 'announcement', value: '🚛 FREE ONGKIR untuk pembelian di atas Rp 300.000 — Gunakan kode TRUK25 diskon 25%', description: 'Teks promosi berjalan di header' }
  ]

  for (const setting of defaultSettings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  console.log('Site settings seeded.')

  // Flash Sale — Activate
  const existingFlashSale = await prisma.flashSale.findFirst()
  if (existingFlashSale) {
    await prisma.flashSale.update({
      where: { id: existingFlashSale.id },
      data: {
        isActive: true,
        title: '⚡ Flash Sale Spesial',
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    })
  } else {
    await prisma.flashSale.create({
      data: {
        isActive: true,
        title: '⚡ Flash Sale Spesial',
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })
  }
  console.log('Flash sale seeded & activated.')

  // Create Categories (with kaos-anak added)
  const categories = [
    { slug: 'kaos-pria', name: 'Kaos Pria' },
    { slug: 'kaos-wanita', name: 'Kaos Wanita' },
    { slug: 'kaos-anak', name: 'Kaos Anak' },
    { slug: 'hoodie', name: 'Hoodie' },
    { slug: 'topi', name: 'Topi' },
    { slug: 'aksesori', name: 'Aksesori' }
  ]

  const catMap = {}
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    catMap[cat.slug] = created.id
  }
  console.log('Categories seeded.')

  // ──────────────────────────────────────
  // Seed Products
  // ──────────────────────────────────────

  // Placeholder images (Unsplash URLs with relevant themes)
  const imgKaosPria = [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=700&fit=crop',
  ]
  const imgKaosPria2 = [
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=700&fit=crop',
  ]
  const imgKaosPria3 = [
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=700&fit=crop',
  ]
  const imgKaosPria4 = [
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=600&h=700&fit=crop',
  ]
  const imgKaosWanita = [
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&h=700&fit=crop',
  ]
  const imgKaosWanita2 = [
    'https://images.unsplash.com/photo-1503342250614-ca440786f637?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=700&fit=crop',
  ]
  const imgKaosWanita3 = [
    'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&h=700&fit=crop',
  ]
  const imgKaosAnak = [
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=700&fit=crop',
  ]
  const imgKaosAnak2 = [
    'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=700&fit=crop',
  ]
  const imgHoodie = [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1578768079470-0a4a4b43e3ee?w=600&h=700&fit=crop',
  ]
  const imgHoodie2 = [
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1614975059251-992f11792571?w=600&h=700&fit=crop',
  ]
  const imgHoodie3 = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=600&h=700&fit=crop',
  ]
  const imgTopi = [
    'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600&h=700&fit=crop',
  ]
  const imgTopi2 = [
    'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&h=700&fit=crop',
  ]
  const imgTopi3 = [
    'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=700&fit=crop',
  ]
  const imgAksesori = [
    'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1611937663641-5cef5189510f?w=600&h=700&fit=crop',
  ]
  const imgAksesori2 = [
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=700&fit=crop',
  ]
  const imgAksesori3 = [
    'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=700&fit=crop',
    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=700&fit=crop',
  ]

  const products = [
    // ──── KAOS PRIA ────
    {
      slug: 'actros-legend-tee',
      name: 'Actros Legend Tee',
      description: 'Kaos premium dengan desain Mercedes-Benz Actros legendaris. Bahan cotton combed 30s, sablon berkualitas tinggi yang tahan lama. Cocok untuk pengemudi profesional dan penggemar truk.',
      material: 'Cotton Combed 30s',
      price: 150000,
      salePrice: null,
      badge: 'Terlaris',
      images: JSON.stringify(imgKaosPria),
      categoryId: catMap['kaos-pria'],
      variants: [
        { size: 'S', color: 'Hitam', stock: 15 },
        { size: 'M', color: 'Hitam', stock: 25 },
        { size: 'L', color: 'Hitam', stock: 30 },
        { size: 'XL', color: 'Hitam', stock: 20 },
        { size: '2XL', color: 'Hitam', stock: 10 },
        { size: 'M', color: 'Putih', stock: 15 },
        { size: 'L', color: 'Putih', stock: 20 },
        { size: 'XL', color: 'Putih', stock: 10 },
      ]
    },
    {
      slug: 'axor-spirit-tee',
      name: 'Axor Spirit Tee',
      description: 'Desain eksklusif Mercedes-Benz Axor. Bahan adem, nyaman dipakai seharian di jalan. Sablon DTF premium anti crack.',
      material: 'Cotton Combed 24s',
      price: 125000,
      salePrice: 95000,
      badge: 'Sale',
      images: JSON.stringify(imgKaosPria2),
      categoryId: catMap['kaos-pria'],
      variants: [
        { size: 'M', color: 'Hitam', stock: 20 },
        { size: 'L', color: 'Hitam', stock: 25 },
        { size: 'XL', color: 'Hitam', stock: 15 },
        { size: '2XL', color: 'Hitam', stock: 8 },
        { size: 'M', color: 'Abu-abu', stock: 12 },
        { size: 'L', color: 'Abu-abu', stock: 15 },
      ]
    },
    {
      slug: 'king-of-the-road-tee',
      name: 'King of The Road Tee',
      description: 'Edisi spesial "King of The Road" — untuk para raja jalanan. Desain bold dengan tipografi industrial khas trucker. Bahan tebal dan premium.',
      material: 'Cotton Combed 20s',
      price: 175000,
      salePrice: null,
      badge: 'Baru',
      images: JSON.stringify(imgKaosPria3),
      categoryId: catMap['kaos-pria'],
      variants: [
        { size: 'S', color: 'Hitam', stock: 10 },
        { size: 'M', color: 'Hitam', stock: 20 },
        { size: 'L', color: 'Hitam', stock: 25 },
        { size: 'XL', color: 'Hitam', stock: 15 },
        { size: '2XL', color: 'Hitam', stock: 5 },
      ]
    },
    {
      slug: 'trucker-lifestyle-tee',
      name: 'Trucker Lifestyle Tee',
      description: 'Kaos kasual bertema kehidupan trucker Indonesia. Desain minimalis yang stylish. Cocok untuk sehari-hari.',
      material: 'Cotton Combed 30s',
      price: 99000,
      salePrice: 85000,
      badge: 'Sale',
      images: JSON.stringify(imgKaosPria4),
      categoryId: catMap['kaos-pria'],
      variants: [
        { size: 'M', color: 'Putih', stock: 18 },
        { size: 'L', color: 'Putih', stock: 22 },
        { size: 'XL', color: 'Putih', stock: 14 },
        { size: 'M', color: 'Hitam', stock: 16 },
        { size: 'L', color: 'Hitam', stock: 20 },
      ]
    },

    // ──── KAOS WANITA ────
    {
      slug: 'queen-trucker-tee',
      name: 'Queen Trucker Tee',
      description: 'Kaos wanita dengan cutting feminine dan desain elegan bertema truk Mercedes-Benz. Bahan lembut dan nyaman di kulit.',
      material: 'Cotton Combed 30s',
      price: 135000,
      salePrice: null,
      badge: 'Baru',
      images: JSON.stringify(imgKaosWanita),
      categoryId: catMap['kaos-wanita'],
      variants: [
        { size: 'S', color: 'Hitam', stock: 12 },
        { size: 'M', color: 'Hitam', stock: 18 },
        { size: 'L', color: 'Hitam', stock: 15 },
        { size: 'XL', color: 'Hitam', stock: 8 },
        { size: 'S', color: 'Putih', stock: 10 },
        { size: 'M', color: 'Putih', stock: 14 },
      ]
    },
    {
      slug: 'road-queen-crop-tee',
      name: 'Road Queen Crop Tee',
      description: 'Crop tee stylish dengan desain road queen. Perfect untuk trucker wanita yang ingin tampil keren di jalan.',
      material: 'Cotton Reactive',
      price: 120000,
      salePrice: 95000,
      badge: 'Sale',
      images: JSON.stringify(imgKaosWanita2),
      categoryId: catMap['kaos-wanita'],
      variants: [
        { size: 'S', color: 'Hitam', stock: 10 },
        { size: 'M', color: 'Hitam', stock: 15 },
        { size: 'L', color: 'Hitam', stock: 12 },
      ]
    },
    {
      slug: 'mb-elegance-tee-wanita',
      name: 'MB Elegance Tee',
      description: 'Kaos wanita premium dengan desain Mercedes-Benz yang elegan. Cutting slim fit yang pas di badan.',
      material: 'Cotton Combed 30s',
      price: 145000,
      salePrice: null,
      badge: 'Limited',
      images: JSON.stringify(imgKaosWanita3),
      categoryId: catMap['kaos-wanita'],
      variants: [
        { size: 'S', color: 'Abu-abu', stock: 5 },
        { size: 'M', color: 'Abu-abu', stock: 8 },
        { size: 'L', color: 'Abu-abu', stock: 6 },
        { size: 'S', color: 'Hitam', stock: 7 },
        { size: 'M', color: 'Hitam', stock: 10 },
      ]
    },

    // ──── KAOS ANAK ────
    {
      slug: 'little-trucker-tee',
      name: 'Little Trucker Tee',
      description: 'Kaos anak dengan desain truk Mercedes-Benz yang lucu dan keren. Bahan lembut dan aman untuk kulit anak.',
      material: 'Cotton Combed 30s',
      price: 85000,
      salePrice: 75000,
      badge: 'Sale',
      images: JSON.stringify(imgKaosAnak),
      categoryId: catMap['kaos-anak'],
      variants: [
        { size: '2-3 Tahun', color: 'Hitam', stock: 10 },
        { size: '4-5 Tahun', color: 'Hitam', stock: 12 },
        { size: '6-7 Tahun', color: 'Hitam', stock: 15 },
        { size: '8-9 Tahun', color: 'Hitam', stock: 10 },
        { size: '4-5 Tahun', color: 'Putih', stock: 8 },
        { size: '6-7 Tahun', color: 'Putih', stock: 10 },
      ]
    },
    {
      slug: 'junior-actros-tee',
      name: 'Junior Actros Tee',
      description: 'Kaos anak bertema Actros untuk calon pengemudi masa depan! Desain fun dan colorful.',
      material: 'Cotton Combed 30s',
      price: 95000,
      salePrice: null,
      badge: 'Baru',
      images: JSON.stringify(imgKaosAnak2),
      categoryId: catMap['kaos-anak'],
      variants: [
        { size: '4-5 Tahun', color: 'Hitam', stock: 8 },
        { size: '6-7 Tahun', color: 'Hitam', stock: 12 },
        { size: '8-9 Tahun', color: 'Hitam', stock: 10 },
        { size: '10-11 Tahun', color: 'Hitam', stock: 8 },
      ]
    },

    // ──── HOODIE ────
    {
      slug: 'midnight-trucker-hoodie',
      name: 'Midnight Trucker Hoodie',
      description: 'Hoodie premium untuk perjalanan malam. Bahan fleece tebal, hangat, dan nyaman. Desain eksklusif Midnight Trucker edition.',
      material: 'Cotton Fleece 280gsm',
      price: 325000,
      salePrice: null,
      badge: 'Terlaris',
      images: JSON.stringify(imgHoodie),
      categoryId: catMap['hoodie'],
      variants: [
        { size: 'M', color: 'Hitam', stock: 12 },
        { size: 'L', color: 'Hitam', stock: 18 },
        { size: 'XL', color: 'Hitam', stock: 15 },
        { size: '2XL', color: 'Hitam', stock: 8 },
      ]
    },
    {
      slug: 'highway-warrior-hoodie',
      name: 'Highway Warrior Hoodie',
      description: 'Hoodie tebal dengan desain Highway Warrior. Cocok untuk musim hujan dan perjalanan malam. Dilengkapi kantong kanguru.',
      material: 'Cotton Fleece 320gsm',
      price: 350000,
      salePrice: 275000,
      badge: 'Sale',
      images: JSON.stringify(imgHoodie2),
      categoryId: catMap['hoodie'],
      variants: [
        { size: 'M', color: 'Abu-abu', stock: 10 },
        { size: 'L', color: 'Abu-abu', stock: 14 },
        { size: 'XL', color: 'Abu-abu', stock: 10 },
        { size: 'L', color: 'Hitam', stock: 12 },
        { size: 'XL', color: 'Hitam', stock: 8 },
      ]
    },
    {
      slug: 'actros-zip-hoodie',
      name: 'Actros Zip Hoodie',
      description: 'Zip hoodie premium dengan bordir logo Actros. Material premium, resleting YKK, dan cutting modern.',
      material: 'Cotton Fleece 300gsm',
      price: 375000,
      salePrice: null,
      badge: 'Limited',
      images: JSON.stringify(imgHoodie3),
      categoryId: catMap['hoodie'],
      variants: [
        { size: 'M', color: 'Hitam', stock: 5 },
        { size: 'L', color: 'Hitam', stock: 8 },
        { size: 'XL', color: 'Hitam', stock: 5 },
      ]
    },

    // ──── TOPI ────
    {
      slug: 'redline-trucker-cap',
      name: 'REDLINE Trucker Cap',
      description: 'Topi trucker klasik dengan logo REDLINE bordir. Jaring belakang breathable, snapback adjustable. Cocok untuk di jalan.',
      material: 'Cotton Twill + Mesh',
      price: 95000,
      salePrice: null,
      badge: 'Terlaris',
      images: JSON.stringify(imgTopi),
      categoryId: catMap['topi'],
      variants: [
        { size: 'All Size', color: 'Hitam', stock: 25 },
        { size: 'All Size', color: 'Abu-abu', stock: 15 },
      ]
    },
    {
      slug: 'actros-snapback',
      name: 'Actros Snapback',
      description: 'Snapback premium dengan desain Actros. Bordir 3D berkualitas tinggi. Adjustable strap belakang.',
      material: 'Cotton Twill',
      price: 125000,
      salePrice: 99000,
      badge: 'Sale',
      images: JSON.stringify(imgTopi2),
      categoryId: catMap['topi'],
      variants: [
        { size: 'All Size', color: 'Hitam', stock: 18 },
        { size: 'All Size', color: 'Putih', stock: 10 },
      ]
    },
    {
      slug: 'mb-dad-cap',
      name: 'MB Dad Cap',
      description: 'Dad cap casual dengan logo Mercedes-Benz minimalis. Bahan adem, ringan, dan nyaman untuk seharian.',
      material: 'Cotton Twill Washed',
      price: 85000,
      salePrice: null,
      badge: 'Baru',
      images: JSON.stringify(imgTopi3),
      categoryId: catMap['topi'],
      variants: [
        { size: 'All Size', color: 'Hitam', stock: 20 },
        { size: 'All Size', color: 'Abu-abu', stock: 12 },
        { size: 'All Size', color: 'Putih', stock: 8 },
      ]
    },

    // ──── AKSESORI ────
    {
      slug: 'redline-sticker-pack',
      name: 'REDLINE Sticker Pack',
      description: 'Paket stiker premium berisi 10 lembar stiker bertema truk Mercedes-Benz. Waterproof dan anti UV. Cocok untuk dashboard, helm, dan laptop.',
      material: 'Vinyl Waterproof',
      price: 35000,
      salePrice: 25000,
      badge: 'Sale',
      images: JSON.stringify(imgAksesori),
      categoryId: catMap['aksesori'],
      variants: [
        { size: 'One Size', color: 'Multi', stock: 50 },
      ]
    },
    {
      slug: 'actros-keychain',
      name: 'Actros Metal Keychain',
      description: 'Gantungan kunci metal premium berbentuk truk Actros. Bahan stainless steel, finishing matte black. Hadiah sempurna untuk trucker.',
      material: 'Stainless Steel',
      price: 65000,
      salePrice: null,
      badge: 'Baru',
      images: JSON.stringify(imgAksesori2),
      categoryId: catMap['aksesori'],
      variants: [
        { size: 'One Size', color: 'Silver', stock: 30 },
        { size: 'One Size', color: 'Hitam', stock: 25 },
      ]
    },
    {
      slug: 'trucker-tumbler',
      name: 'Trucker Tumbler 600ml',
      description: 'Tumbler stainless steel 600ml dengan desain truk Mercedes-Benz. Tahan panas 12 jam, tahan dingin 24 jam. Teman setia di perjalanan panjang.',
      material: 'Stainless Steel 304',
      price: 75000,
      salePrice: null,
      badge: 'Terlaris',
      images: JSON.stringify(imgAksesori3),
      categoryId: catMap['aksesori'],
      variants: [
        { size: '600ml', color: 'Hitam', stock: 20 },
        { size: '600ml', color: 'Silver', stock: 15 },
      ]
    },
  ]

  // Delete existing products (except the ones already uploaded by admin)
  // Only seed if no seeded products exist yet
  for (const product of products) {
    const existing = await prisma.product.findUnique({ where: { slug: product.slug } })
    if (!existing) {
      const { variants, ...productData } = product
      await prisma.product.create({
        data: {
          ...productData,
          variants: {
            create: variants
          }
        }
      })
      console.log(`  ✓ Product seeded: ${product.name}`)
    } else {
      console.log(`  ⊘ Product exists: ${product.name}`)
    }
  }

  console.log(`\n✅ Seeding complete! ${products.length} products processed.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
