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
router.post('/upload', requireAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = req.file.fieldname + '-' + uniqueSuffix + path.extname(req.file.originalname);
    
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
