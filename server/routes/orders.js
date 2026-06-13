import express from 'express';
import prisma from '../prismaClient.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

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

export default router;
