import { verifyAdmin } from '../middlewares/adminAuth';
import { Router, Request, Response } from 'express';
import { vkMarketService } from '../services/vkMarketService';

const router = Router();

// Get all products
router.get('/products', async (req: Request, res: Response) => {
  try {
    const { limit = 50, offset = 0, category } = req.query;
    
    let products;
    if (category) {
      products = await vkMarketService.getProductsByCategory(
        parseInt(category as string),
        parseInt(limit as string)
      );
    } else {
      products = await vkMarketService.getProducts(
        parseInt(limit as string),
        parseInt(offset as string)
      );
    }
    
    // Transform products to our format
    const transformedProducts = products.map(p => vkMarketService.transformProduct(p));
    
    res.json({
      success: true,
      data: transformedProducts,
      total: transformedProducts.length,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
});

// Get single product
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await vkMarketService.getProductById(parseInt(id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    
    const transformedProduct = vkMarketService.transformProduct(product);
    
    res.json({
      success: true,
      data: transformedProduct,
    });
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
    });
  }
});

// Search products
router.get('/products/search', async (req: Request, res: Response) => {
  try {
    const { q, limit = 30 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }
    
    const products = await vkMarketService.searchProducts(
      q as string,
      parseInt(limit as string)
    );
    
    const transformedProducts = products.map(p => vkMarketService.transformProduct(p));
    
    res.json({
      success: true,
      data: transformedProducts,
      query: q,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
    });
  }
});

// Sync products (force refresh cache)
router.post('/products/sync', verifyAdmin, async (req: Request, res: Response) => {
  try {
    // Clear cache to force fresh data
    vkMarketService.clearCache();
    
    // Fetch fresh products
    const products = await vkMarketService.getProducts(200, 0);
    const transformedProducts = products.map(p => vkMarketService.transformProduct(p));
    
    res.json({
      success: true,
      message: 'Products synchronized successfully',
      data: transformedProducts,
      total: transformedProducts.length,
    });
  } catch (error) {
    console.error('Error syncing products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync products',
    });
  }
});

// Get cache statistics
router.get('/products/cache/stats', verifyAdmin, (req: Request, res: Response) => {
  const stats = vkMarketService.getCacheStats();
  
  res.json({
    success: true,
    data: stats,
  });
});

export default router;