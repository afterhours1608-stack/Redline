import express from 'express';
import prisma from '../prismaClient.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET dashboard metrics (Admin)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({ where: { status: 'pending' } });
    
    const validOrders = await prisma.order.findMany({ 
      where: { status: { in: ['processing', 'shipped', 'completed'] } },
      select: { total: true, createdAt: true } 
    });
    const revenue = validOrders.reduce((acc, order) => acc + order.total, 0);
    
    const totalProducts = await prisma.product.count();

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, orderNumber: true, customerName: true, total: true, status: true, createdAt: true }
    });

    // Chart Data Generation
    // 1. Sales Chart (Last 6 Months)
    const salesData = { labels: [], current: [], previous: [] };
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      salesData.labels.push(d.toLocaleString('default', { month: 'short' }));
      salesData.current.push(0);
      salesData.previous.push(0); // Keeping empty structure for the second bar
    }
    
    validOrders.forEach(o => {
      const orderDate = new Date(o.createdAt);
      const monthsAgo = (now.getFullYear() - orderDate.getFullYear()) * 12 + now.getMonth() - orderDate.getMonth();
      if (monthsAgo >= 0 && monthsAgo <= 5) {
        salesData.current[5 - monthsAgo] += o.total;
      }
    });

    // 2. Order Trend Chart (Last 10 Days)
    const trendData = { labels: [], completed: [], pending: [], rejected: [] };
    const allRecentForTrend = await prisma.order.findMany({
      where: {
        createdAt: { gte: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) }
      },
      select: { status: true, createdAt: true }
    });

    for (let i = 9; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      trendData.labels.push(d.getDate().toString());
      trendData.completed.push(0);
      trendData.pending.push(0);
      trendData.rejected.push(0);
    }

    allRecentForTrend.forEach(o => {
      const orderDate = new Date(o.createdAt);
      const daysAgo = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24));
      if (daysAgo >= 0 && daysAgo <= 9) {
        const idx = 9 - daysAgo;
        if (o.status === 'completed' || o.status === 'shipped' || o.status === 'processing') trendData.completed[idx]++;
        else if (o.status === 'pending') trendData.pending[idx]++;
        else if (o.status === 'rejected' || o.status === 'cancelled') trendData.rejected[idx]++;
      }
    });

    res.json({
      metrics: {
        totalOrders,
        pendingOrders,
        revenue,
        totalProducts
      },
      recentOrders,
      charts: { salesData, trendData }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
