import express from 'express';
import prisma from '../prismaClient.js';
import { requireAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE Order (Public - Checkout)
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, shippingCity, shippingProvince, shippingZip, courier, paymentMethod, subtotal, shippingCost, total, items } = req.body;
    
    // Generate order number
    const orderNumber = 'RL-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);

    const order = await prisma.order.create({
      data: {
        orderNumber, customerName, customerEmail, customerPhone, shippingAddress, shippingCity, shippingProvince, shippingZip, courier, paymentMethod, 
        subtotal: Number(subtotal), 
        shippingCost: Number(shippingCost), 
        total: Number(total),
        items: {
          create: items.map(item => ({
            productId: item.productId || item.id,
            name: item.name,
            size: item.size,
            color: item.color,
            price: Number(item.salePrice || item.price),
            quantity: Number(item.qty),
            image: item.image || ''
          }))
        }
      },
      include: { items: true }
    });
    
    res.json({ success: true, orderNumber: order.orderNumber, orderId: order.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all orders (Admin)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE order status (Admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { status, receiptNumber, rejectReason } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status, receiptNumber, rejectReason }
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single order by orderNumber (Public - for payment page)
router.get('/number/:orderNumber', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
      include: { items: true }
    });
    if (!order) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload payment proof (Public)
router.post('/:orderNumber/upload-proof', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  try {
    const orderNumber = req.params.orderNumber;
    const order = await prisma.order.findUnique({ where: { orderNumber } });
    if (!order) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = 'payment-' + orderNumber + '-' + uniqueSuffix + path.extname(req.file.originalname);
    
    const { data, error } = await supabase.storage
      .from('redline-storage')
      .upload('payments/' + fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('redline-storage')
      .getPublicUrl('payments/' + fileName);
      
    // Update order with payment proof
    const updatedOrder = await prisma.order.update({
      where: { orderNumber },
      data: { paymentProof: publicUrl }
    });

    res.json({ success: true, url: publicUrl, order: updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload to Supabase' });
  }
});

export default router;
