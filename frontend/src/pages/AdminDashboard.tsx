import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  RefreshCw,
  LogOut,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Check,
  X,
  Eye
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { productsAPI, ordersAPI } from '../services/api';
import type { Order } from '../services/api';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  todayOrders: number;
  productsInCache: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    productsInCache: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load mock orders (в реальном приложении загружать с сервера)
      const mockOrders: Order[] = [
        {
          orderId: 'VA-1704067200-A1B2',
          user: {
            telegram_id: 123456789,
            username: 'user123',
            name: 'Иван Иванов',
            phone: '+7 (999) 123-45-67',
            city: 'Москва',
            address: 'ул. Пушкина, д. 10',
            comment: 'Позвонить за час до доставки'
          },
          items: [
            {
              productId: '1',
              name: 'Gaming PC Ultra',
              price: 89990,
              quantity: 1,
              configuration: { ram: '32GB', ssd: '1TB' }
            }
          ],
          totalPrice: 89990,
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          orderId: 'VA-1704067300-B2C3',
          user: {
            telegram_id: 987654321,
            username: 'gamer2024',
            name: 'Петр Петров',
            phone: '+7 (999) 765-43-21',
            city: 'Санкт-Петербург',
            address: 'пр. Невский, д. 100',
            comment: ''
          },
          items: [
            {
              productId: '2',
              name: 'Office PC Pro',
              price: 45990,
              quantity: 2,
              configuration: {}
            }
          ],
          totalPrice: 91980,
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      setOrders(mockOrders);

      // Calculate stats
      const today = new Date().setHours(0, 0, 0, 0);
      const todayOrders = mockOrders.filter(o => 
        new Date(o.createdAt).setHours(0, 0, 0, 0) === today
      );

      setStats({
        totalOrders: mockOrders.length,
        pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
        completedOrders: mockOrders.filter(o => o.status === 'completed').length,
        totalRevenue: mockOrders.reduce((sum, o) => sum + o.totalPrice, 0),
        todayOrders: todayOrders.length,
        productsInCache: 0
      });

      // Load cache stats
      const cacheStats = await productsAPI.getCacheStats();
      setStats(prev => ({ ...prev, productsInCache: cacheStats.data?.keys || 0 }));
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncProducts = async () => {
    try {
      toast.loading('Синхронизация товаров...', { id: 'sync' });
      const result = await productsAPI.sync();
      toast.success(`Синхронизировано ${result.total} товаров`, { id: 'sync' });
      loadDashboardData();
    } catch (error) {
      toast.error('Ошибка синхронизации', { id: 'sync' });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      toast.success('Статус заказа обновлен');
      loadDashboardData();
    } catch (error) {
      toast.error('Ошибка обновления статуса');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'orders', label: 'Заказы', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'products', label: 'Товары', icon: <Package className="w-4 h-4" /> },
    { id: 'stats', label: 'Статистика', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">VA-PC Admin</h1>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              icon={<LogOut className="w-4 h-4" />}
            >
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Всего заказов</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Общая выручка</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalRevenue.toLocaleString()} ₽
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Заказов сегодня</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">В ожидании</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
                <Users className="w-8 h-8 text-orange-500" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.orderId} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          Заказ #{order.orderId}
                        </h3>
                        <Badge
                          variant={order.status === 'completed' ? 'success' : 
                                 order.status === 'pending' ? 'warning' : 'default'}
                        >
                          {order.status === 'completed' ? 'Выполнен' :
                           order.status === 'pending' ? 'В ожидании' : order.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Покупатель</p>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-gray-600">@{order.user.username}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Контакты</p>
                          <p className="font-medium">{order.user.phone}</p>
                          <p className="text-gray-600">{order.user.city}, {order.user.address}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-gray-500 text-sm mb-2">Товары:</p>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 border-t">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              {item.configuration && Object.keys(item.configuration).length > 0 && (
                                <p className="text-sm text-gray-500">
                                  {Object.entries(item.configuration).map(([key, value]) => 
                                    `${key}: ${value}`
                                  ).join(', ')}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{item.price.toLocaleString()} ₽</p>
                              <p className="text-sm text-gray-500">x{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Итого</p>
                          <p className="text-xl font-bold text-gray-900">
                            {order.totalPrice.toLocaleString()} ₽
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedOrder(order)}
                        icon={<Eye className="w-4 h-4" />}
                      >
                        Детали
                      </Button>
                      {order.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleUpdateOrderStatus(order.orderId, 'completed')}
                            icon={<Check className="w-4 h-4" />}
                          >
                            Выполнен
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUpdateOrderStatus(order.orderId, 'cancelled')}
                            icon={<X className="w-4 h-4" />}
                          >
                            Отменить
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {orders.length === 0 && (
                <Card className="p-12 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Нет заказов</p>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Управление товарами</h2>
                <Button
                  variant="primary"
                  onClick={handleSyncProducts}
                  icon={<RefreshCw className="w-4 h-4" />}
                >
                  Синхронизировать с VK
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Товары в кэше:</strong> {stats.productsInCache}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Кэш обновляется автоматически каждые 5 минут
                  </p>
                </div>

                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Товары автоматически синхронизируются с VK Market API.
                    Используйте кнопку "Синхронизировать" для принудительного обновления.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Статистика заказов</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Выполнено</span>
                    <span className="font-medium">{stats.completedOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">В ожидании</span>
                    <span className="font-medium">{stats.pendingOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Средний чек</span>
                    <span className="font-medium">
                      {stats.totalOrders > 0 
                        ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString()
                        : 0} ₽
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Популярные товары</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gaming PC Ultra</span>
                    <span className="font-medium">5 продаж</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Office PC Pro</span>
                    <span className="font-medium">3 продажи</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Designer Workstation</span>
                    <span className="font-medium">2 продажи</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Детали заказа #{selectedOrder.orderId}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Информация о покупателе</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <p><strong>Имя:</strong> {selectedOrder.user.name}</p>
                  <p><strong>Telegram:</strong> @{selectedOrder.user.username} (ID: {selectedOrder.user.telegram_id})</p>
                  <p><strong>Телефон:</strong> {selectedOrder.user.phone}</p>
                  <p><strong>Город:</strong> {selectedOrder.user.city}</p>
                  <p><strong>Адрес:</strong> {selectedOrder.user.address}</p>
                  {selectedOrder.user.comment && (
                    <p><strong>Комментарий:</strong> {selectedOrder.user.comment}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Товары в заказе</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.configuration && Object.keys(item.configuration).length > 0 && (
                          <p className="text-sm text-gray-500">
                            {Object.entries(item.configuration).map(([key, value]) => 
                              `${key}: ${value}`
                            ).join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.price.toLocaleString()} ₽</p>
                        <p className="text-sm text-gray-500">Кол-во: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Дата заказа</p>
                  <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Итого к оплате</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedOrder.totalPrice.toLocaleString()} ₽
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}