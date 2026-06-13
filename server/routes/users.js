import express from 'express';
import prisma from '../prismaClient.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all customers (Leads) - Admin Only
router.get('/customers', requireAdmin, async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'customer' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
