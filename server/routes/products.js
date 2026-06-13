import express from 'express';
import prisma from '../prismaClient.js';
import { requireAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const prisma = new PrismaClient();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { variants: true, category: true }
    });
    // Parse JSON images array
    const parsedProducts = products.map(p => ({
      ...p,
      images: JSON.parse(p.images)
    }));
    res.json(parsedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product by slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { variants: true, category: true }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    product.images = JSON.parse(product.images);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE product
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, slug, description, price, salePrice, badge, images, categoryId, variants } = req.body;
    const product = await prisma.product.create({
      data: {
        name, slug, description, 
        price: Number(price), 
        salePrice: salePrice ? Number(salePrice) : null,
        badge, categoryId,
        images: JSON.stringify(images || []),
        variants: {
          create: variants || [] // { size, color, stock, sku }
        }
      },
      include: { variants: true }
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE product
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, slug, description, price, salePrice, badge, images, categoryId, variants } = req.body;
    
    // Simplest way to update variants is delete all and recreate
    if (variants) {
      await prisma.productVariant.deleteMany({ where: { productId: req.params.id } });
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name, slug, description, 
        price: Number(price), 
        salePrice: salePrice ? Number(salePrice) : null,
        badge, categoryId,
        images: JSON.stringify(images || []),
        variants: variants ? { create: variants } : undefined
      },
      include: { variants: true }
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload product image
router.post('/upload', requireAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = 'product-' + uniqueSuffix + path.extname(req.file.originalname);
    
    const { data, error } = await supabase.storage
      .from('redline-storage')
      .upload('uploads/' + fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('redline-storage')
      .getPublicUrl('uploads/' + fileName);
      
    res.json({ url: publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload to Supabase' });
  }
});

export default router;
