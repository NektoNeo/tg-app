import { Router, Request, Response } from 'express';
import { vkMarketService } from '../services/vkMarketService';
import jwt from 'jsonwebtoken';

const router = Router();

// Simple admin credentials (в продакшене использовать базу данных)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vapc2024';
const JWT_SECRET = process.env.JWT_SECRET || 'va-pc-admin-secret-2024';

// Admin login
router.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate JWT token
      const token = jwt.sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Middleware to verify admin token
const verifyAdmin = (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Get admin dashboard stats
router.get('/admin/stats', verifyAdmin, async (req: Request, res: Response) => {
  try {
    // Get cache stats
    const cacheStats = vkMarketService.getCacheStats();
    
    // Get orders from database (mock for now)
    const orders = []; // В продакшене загружать из БД
    
    res.json({
      success: true,
      data: {
        cache: cacheStats,
        ordersCount: orders.length,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
});

// Get all orders (admin only)
router.get('/admin/orders', verifyAdmin, async (req: Request, res: Response) => {
  try {
    // В продакшене загружать из базы данных
    const orders = [
      // Mock data
    ];

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Update order status (admin only)
router.patch('/admin/orders/:orderId/status', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // В продакшене обновлять в базе данных
    console.log(`Updating order ${orderId} status to ${status}`);

    res.json({
      success: true,
      message: 'Order status updated'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// Force sync products from VK (admin only)
router.post('/admin/products/sync', verifyAdmin, async (req: Request, res: Response) => {
  try {
    // Clear cache to force fresh data
    vkMarketService.clearCache();
    
    // Fetch fresh products
    const products = await vkMarketService.getProducts(200, 0);
    const transformedProducts = products.map(p => vkMarketService.transformProduct(p));
    
    res.json({
      success: true,
      message: 'Products synchronized successfully',
      data: {
        count: transformedProducts.length,
        products: transformedProducts.slice(0, 10) // Return first 10 for preview
      }
    });
  } catch (error) {
    console.error('Error syncing products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync products'
    });
  }
});

export default router;