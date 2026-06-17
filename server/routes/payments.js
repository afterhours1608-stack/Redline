import express from 'express';
import prisma from '../prismaClient.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all payment methods (Public for checkout, Admin for settings)
router.get('/', async (req, res) => {
  try {
    const methods = await prisma.paymentMethod.findMany();
    res.json(methods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE payment method (Admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, accountNumber, accountName } = req.body;
    
    const updated = await prisma.paymentMethod.update({
      where: { id },
      data: {
        isActive,
        accountNumber: accountNumber || null,
        accountName: accountName || null
      }
    });
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
