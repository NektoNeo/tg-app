import axios from 'axios';
import NodeCache from 'node-cache';

// VK API Configuration
const VK_API_VERSION = '5.131';
const VK_API_BASE_URL = 'https://api.vk.com/method';

// Cache configuration (TTL: 5 minutes)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

interface VKProduct {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  price: {
    amount: string;
    currency: {
      id: number;
      name: string;
    };
    text: string;
    old_amount?: string;
  };
  category: {
    id: number;
    name: string;
    section: {
      id: number;
      name: string;
    };
  };
  date: number;
  photos?: Array<{
    id: number;
    album_id: number;
    owner_id: number;
    sizes: Array<{
      type: string;
      url: string;
      width: number;
      height: number;
    }>;
  }>;
  availability: number;
  sku?: string;
  dimensions?: {
    width: number;
    height: number;
    length: number;
  };
  weight?: number;
  is_main_variant?: boolean;
  variants?: Array<{
    id: number;
    title: string;
    price: string;
  }>;
}

interface VKMarketResponse {
  response: {
    count: number;
    items: VKProduct[];
  };
}

export class VKMarketService {
  private accessToken: string;
  private groupId: string;

  constructor() {
    this.accessToken = process.env.VK_MARKET_ACCESS_TOKEN || '';
    this.groupId = process.env.VK_MARKET_GROUP_ID || '';
    
    if (!this.accessToken || !this.groupId) {
      console.warn('VK Market API credentials not configured');
    }
  }

  /**
   * Get all products from VK Market
   */
  async getProducts(count: number = 200, offset: number = 0): Promise<VKProduct[]> {
    const cacheKey = `products_${count}_${offset}`;
    const cachedData = cache.get<VKProduct[]>(cacheKey);
    
    if (cachedData) {
      console.log('Returning cached VK products');
      return cachedData;
    }

    try {
      const response = await axios.get<VKMarketResponse>(`${VK_API_BASE_URL}/market.get`, {
        params: {
          owner_id: `-${this.groupId}`,
          count,
          offset,
          extended: 1,
          access_token: this.accessToken,
          v: VK_API_VERSION,
        },
      });

      const products = response.data.response.items;
      cache.set(cacheKey, products);
      
      return products;
    } catch (error) {
      console.error('Error fetching VK Market products:', error);
      throw new Error('Failed to fetch products from VK Market');
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(productId: number): Promise<VKProduct | null> {
    const cacheKey = `product_${productId}`;
    const cachedData = cache.get<VKProduct>(cacheKey);
    
    if (cachedData) {
      console.log(`Returning cached product ${productId}`);
      return cachedData;
    }

    try {
      const response = await axios.get<VKMarketResponse>(`${VK_API_BASE_URL}/market.getById`, {
        params: {
          item_ids: `-${this.groupId}_${productId}`,
          extended: 1,
          access_token: this.accessToken,
          v: VK_API_VERSION,
        },
      });

      const product = response.data.response.items[0] || null;
      if (product) {
        cache.set(cacheKey, product);
      }
      
      return product;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  }

  /**
   * Search products by query
   */
  async searchProducts(query: string, count: number = 30): Promise<VKProduct[]> {
    const cacheKey = `search_${query}_${count}`;
    const cachedData = cache.get<VKProduct[]>(cacheKey);
    
    if (cachedData) {
      console.log(`Returning cached search results for "${query}"`);
      return cachedData;
    }

    try {
      const response = await axios.get<VKMarketResponse>(`${VK_API_BASE_URL}/market.search`, {
        params: {
          owner_id: `-${this.groupId}`,
          q: query,
          count,
          extended: 1,
          access_token: this.accessToken,
          v: VK_API_VERSION,
        },
      });

      const products = response.data.response.items;
      cache.set(cacheKey, products);
      
      return products;
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      throw new Error('Failed to search products in VK Market');
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: number, count: number = 100): Promise<VKProduct[]> {
    const cacheKey = `category_${categoryId}_${count}`;
    const cachedData = cache.get<VKProduct[]>(cacheKey);
    
    if (cachedData) {
      console.log(`Returning cached products for category ${categoryId}`);
      return cachedData;
    }

    try {
      const response = await axios.get<VKMarketResponse>(`${VK_API_BASE_URL}/market.get`, {
        params: {
          owner_id: `-${this.groupId}`,
          album_id: categoryId,
          count,
          extended: 1,
          access_token: this.accessToken,
          v: VK_API_VERSION,
        },
      });

      const products = response.data.response.items;
      cache.set(cacheKey, products);
      
      return products;
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw new Error('Failed to fetch products by category');
    }
  }

  /**
   * Transform VK product to our app format
   */
  transformProduct(vkProduct: VKProduct): any {
    // Extract main photo
    const mainPhoto = vkProduct.photos?.[0]?.sizes?.find(
      size => size.type === 'x' || size.type === 'y' || size.type === 'z'
    )?.url || '';

    // Extract all photos
    const images = vkProduct.photos?.map(photo => {
      const largeSize = photo.sizes.find(
        size => size.type === 'x' || size.type === 'y' || size.type === 'z'
      );
      return largeSize?.url || '';
    }).filter(Boolean) || [];

    // Parse price
    const price = parseInt(vkProduct.price.amount) / 100; // VK stores price in kopecks
    const oldPrice = vkProduct.price.old_amount 
      ? parseInt(vkProduct.price.old_amount) / 100 
      : null;

    // Parse description to extract specs
    const specs = this.extractSpecsFromDescription(vkProduct.description);

    return {
      id: vkProduct.id.toString(),
      vkId: vkProduct.id,
      name: vkProduct.title,
      description: vkProduct.description,
      price,
      oldPrice,
      image: mainPhoto,
      images,
      specs,
      category: vkProduct.category?.name || 'Компьютеры',
      sku: vkProduct.sku,
      availability: vkProduct.availability,
      inStock: vkProduct.availability === 0, // 0 = available in VK API
      variants: vkProduct.variants?.map(variant => ({
        id: variant.id.toString(),
        title: variant.title,
        price: parseInt(variant.price) / 100,
      })),
      createdAt: new Date(vkProduct.date * 1000).toISOString(),
    };
  }

  /**
   * Extract specifications from product description
   */
  private extractSpecsFromDescription(description: string): any {
    const specs: any = {};
    
    // Common patterns for PC specs
    const patterns = {
      cpu: /(?:процессор|cpu|проц)[:\s]*(.*?)(?:\n|$)/i,
      gpu: /(?:видеокарта|gpu|графика)[:\s]*(.*?)(?:\n|$)/i,
      ram: /(?:оперативная память|озу|ram|память)[:\s]*(.*?)(?:\n|$)/i,
      storage: /(?:накопитель|ssd|hdd|диск)[:\s]*(.*?)(?:\n|$)/i,
      motherboard: /(?:материнская плата|мать|motherboard)[:\s]*(.*?)(?:\n|$)/i,
      psu: /(?:блок питания|бп|psu)[:\s]*(.*?)(?:\n|$)/i,
      case: /(?:корпус|case)[:\s]*(.*?)(?:\n|$)/i,
      cooling: /(?:охлаждение|кулер|cooling)[:\s]*(.*?)(?:\n|$)/i,
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = description.match(pattern);
      if (match && match[1]) {
        specs[key] = match[1].trim();
      }
    }

    // Also try to parse structured format (if description uses bullet points)
    const lines = description.split('\n');
    for (const line of lines) {
      if (line.includes('•') || line.includes('-')) {
        const [possibleKey, ...valueParts] = line.replace(/[•\-]/g, '').split(':');
        if (valueParts.length > 0) {
          const key = this.normalizeSpecKey(possibleKey.trim());
          if (key) {
            specs[key] = valueParts.join(':').trim();
          }
        }
      }
    }

    return specs;
  }

  /**
   * Normalize specification key
   */
  private normalizeSpecKey(key: string): string | null {
    const keyMap: Record<string, string> = {
      'процессор': 'cpu',
      'видеокарта': 'gpu',
      'оперативная память': 'ram',
      'озу': 'ram',
      'накопитель': 'storage',
      'диск': 'storage',
      'материнская плата': 'motherboard',
      'блок питания': 'psu',
      'корпус': 'case',
      'охлаждение': 'cooling',
    };

    const lowerKey = key.toLowerCase();
    
    for (const [rusKey, engKey] of Object.entries(keyMap)) {
      if (lowerKey.includes(rusKey)) {
        return engKey;
      }
    }

    return null;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    cache.flushAll();
    console.log('VK Market cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): any {
    return cache.getStats();
  }
}

// Export singleton instance
export const vkMarketService = new VKMarketService();