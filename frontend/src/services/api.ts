import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

export interface Product {
  id: string;
  vkId: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  specs: {
    cpu?: string;
    gpu?: string;
    ram?: string;
    storage?: string;
    motherboard?: string;
    psu?: string;
    case?: string;
    cooling?: string;
  };
  category: string;
  sku?: string;
  availability: number;
  inStock: boolean;
  variants?: Array<{
    id: string;
    title: string;
    price: number;
  }>;
  createdAt: string;
}

export interface Order {
  orderId: string;
  user: {
    telegram_id?: number;
    username?: string;
    name: string;
    phone: string;
    city: string;
    address: string;
    comment?: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    configuration: any;
  }>;
  totalPrice: number;
  status: string;
  createdAt: string;
}

// Products API
export const productsAPI = {
  // Get all products
  async getAll(params?: { limit?: number; offset?: number; category?: number }) {
    const response = await api.get<{
      success: boolean;
      data: Product[];
      total: number;
    }>('/products', { params });
    return response.data;
  },

  // Get single product
  async getById(id: string) {
    const response = await api.get<{
      success: boolean;
      data: Product;
    }>(`/products/${id}`);
    return response.data;
  },

  // Search products
  async search(query: string, limit: number = 30) {
    const response = await api.get<{
      success: boolean;
      data: Product[];
      query: string;
    }>('/products/search', { params: { q: query, limit } });
    return response.data;
  },

  // Sync products from VK
  async sync() {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: Product[];
      total: number;
    }>('/products/sync');
    return response.data;
  },

  // Get cache stats
  async getCacheStats() {
    const response = await api.get<{
      success: boolean;
      data: any;
    }>('/products/cache/stats');
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  // Create order
  async create(orderData: Omit<Order, 'orderId' | 'status' | 'createdAt'>) {
    const response = await api.post<{
      success: boolean;
      orderId: string;
      message: string;
    }>('/orders', orderData);
    return response.data;
  },

  // Get order by ID
  async getById(orderId: string) {
    const response = await api.get<{
      success: boolean;
      order: Order;
    }>(`/orders/${orderId}`);
    return response.data;
  },

  // Update order status
  async updateStatus(orderId: string, status: string) {
    const response = await api.patch<{
      success: boolean;
      message: string;
    }>(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};

export default api;