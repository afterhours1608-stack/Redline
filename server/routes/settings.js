import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'server/uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET all settings (Public)
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findMany();
    const settingsMap = {};
    settings.forEach(s => settingsMap[s.key] = s.value);
    
    const flashSale = await prisma.flashSale.findFirst();
    
    res.json({ ...settingsMap, flashSale });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update settings (Admin)
router.put('/', requireAdmin, async (req, res) => {
  try {
    const { settings, flashSale } = req.body;
    
    // Update simple key-value settings
    if (settings) {
      for (const [key, value] of Object.entries(settings)) {
        await prisma.siteSettings.updateMany({
          where: { key },
          data: { value: String(value) }
        });
      }
    }
    
    // Update flash sale
    if (flashSale) {
      const existingFS = await prisma.flashSale.findFirst();
      if (existingFS) {
        await prisma.flashSale.update({
          where: { id: existingFS.id },
          data: { 
            isActive: flashSale.isActive, 
            endTime: flashSale.endTime ? new Date(flashSale.endTime) : null,
            title: flashSale.title 
          }
        });
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload image (logo/banner)
router.post('/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Construct URL accessible from frontend
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

export default router;
