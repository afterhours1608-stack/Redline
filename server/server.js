import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import productsRoutes from './routes/products.js';
import categoriesRoutes from './routes/categories.js';
import ordersRoutes from './routes/orders.js';
import dashboardRoutes from './routes/dashboard.js';
import usersRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payments.js';

import prisma from './prismaClient.js';
const app = express();

app.use(cors());
app.use(express.json());

// Routes placeholder
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'REDLINE Backend API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Global error handler for Vercel
app.use((err, req, res, next) => {
  console.error("Express Error:", err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message, 
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
  });
});

export default app;
