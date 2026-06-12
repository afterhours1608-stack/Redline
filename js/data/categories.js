// ===========================
// REDLINE — Categories Data
// ===========================

export const categories = [
  {
    id: 'kaos-pria',
    name: 'Kaos Pria',
    description: 'Koleksi kaos pria bertema truk Mercedes-Benz',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=400&fit=crop',
    count: 4,
  },
  {
    id: 'kaos-wanita',
    name: 'Kaos Wanita',
    description: 'Kaos wanita dengan cutting feminine',
    image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&h=400&fit=crop',
    count: 3,
  },
  {
    id: 'kaos-anak',
    name: 'Kaos Anak',
    description: 'Kaos anak dengan desain truk yang keren',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=400&fit=crop',
    count: 2,
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    description: 'Hoodie premium untuk perjalanan malam',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop',
    count: 3,
  },
  {
    id: 'topi',
    name: 'Topi',
    description: 'Topi trucker klasik & snapback',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&h=400&fit=crop',
    count: 3,
  },
  {
    id: 'aksesori',
    name: 'Aksesori',
    description: 'Keychain, stiker, dan merchandise lainnya',
    image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&h=400&fit=crop',
    count: 3,
  },
];

export function getCategoryById(id) {
  return categories.find(c => c.id === id);
}
