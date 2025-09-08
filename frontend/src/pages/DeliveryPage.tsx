import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Truck, 
  Package, 
  Clock, 
  MapPin, 
  CreditCard,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const DeliveryPage: React.FC = () => {
  const navigate = useNavigate();

  const deliveryMethods = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Экспресс-доставка',
      time: 'В день заказа',
      price: 'от 500 ₽',
      description: 'Доставка в пределах МКАД в день заказа при оформлении до 14:00',
      areas: ['В пределах МКАД'],
      badge: 'Популярно'
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Стандартная доставка',
      time: '1-2 дня',
      price: 'от 300 ₽',
      description: 'Доставка курьером по Москве и Московской области',
      areas: ['Москва', 'Московская область']
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: 'Доставка по России',
      time: '2-7 дней',
      price: 'от 400 ₽',
      description: 'Доставка транспортными компаниями по всей России',
      areas: ['СДЭК', 'DPD', 'Boxberry', 'Почта России']
    }
  ];

  const paymentMethods = [
    {
      title: 'Наличными курьеру',
      description: 'Оплата при получении заказа',
      icon: '💵'
    },
    {
      title: 'Банковской картой',
      description: 'Онлайн оплата или при получении',
      icon: '💳'
    },
    {
      title: 'Безналичный расчет',
      description: 'Для юридических лиц',
      icon: '🏢'
    },
    {
      title: 'Рассрочка',
      description: 'От 3 до 12 месяцев без переплат',
      icon: '📅'
    }
  ];

  const deliveryZones = [
    { zone: 'В пределах МКАД', price: '500 ₽', time: 'В день заказа' },
    { zone: 'До 10 км от МКАД', price: '700 ₽', time: '1-2 дня' },
    { zone: 'До 30 км от МКАД', price: '900 ₽', time: '1-2 дня' },
    { zone: 'До 50 км от МКАД', price: '1200 ₽', time: '2-3 дня' },
    { zone: 'Другие регионы', price: 'от 400 ₽', time: '2-7 дней' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/50 backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Назад
          </Button>
          <h1 className="text-xl font-bold text-white">Доставка и оплата</h1>
        </div>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Быстрая и надежная доставка</h2>
              <p className="text-purple-100">Доставляем по всей России от 1 дня</p>
            </div>
            <Truck className="w-16 h-16 text-purple-200" />
          </div>
        </Card>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Delivery Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white mb-6">Способы доставки</h3>
          <div className="space-y-4">
            {deliveryMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-purple-400">{method.icon}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-white text-lg">{method.title}</h4>
                        {method.badge && (
                          <Badge variant="primary">{method.badge}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{method.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{method.price}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 mb-3">{method.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {method.areas.map((area, idx) => (
                          <Badge key={idx} variant="secondary">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Delivery Zones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20 p-6">
            <h3 className="text-xl font-bold text-white mb-6">Стоимость доставки по зонам</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Зона доставки
                    </th>
                    <th className="text-center py-3 px-2 text-gray-400 font-medium">
                      Стоимость
                    </th>
                    <th className="text-center py-3 px-2 text-gray-400 font-medium">
                      Срок
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryZones.map((zone, index) => (
                    <tr key={index} className="border-b border-purple-500/10">
                      <td className="py-3 px-2 text-gray-300">{zone.zone}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant="secondary">{zone.price}</Badge>
                      </td>
                      <td className="py-3 px-2 text-center text-gray-400">{zone.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-xl font-bold text-white mb-6">Способы оплаты</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20 p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{method.icon}</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{method.title}</h4>
                      <p className="text-gray-400 text-sm">{method.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Important Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="bg-orange-500/10 backdrop-blur-lg border-orange-500/20 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-3">Важная информация</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Бесплатная доставка при заказе от 50 000 ₽ в пределах МКАД</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Возможность проверки товара при получении</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Страхование груза при доставке</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>SMS-уведомления о статусе заказа</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-lg border-purple-500/30 p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Остались вопросы?
            </h3>
            <p className="text-gray-300 mb-6">
              Наши менеджеры помогут рассчитать точную стоимость и срок доставки
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/catalog')}
            >
              Оформить заказ
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DeliveryPage;