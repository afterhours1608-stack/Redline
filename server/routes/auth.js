import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JWT_SECRET, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name, avatar: user.avatar },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

router.put('/profile', requireAdmin, async (req, res) => {
  try {
    const { name, password, avatar } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (name) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name, avatar: user.avatar },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (err) {
    res.status(500).json({ error: 'Gagal update profil: ' + err.message });
  }
});

export default router;
