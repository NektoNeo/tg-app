import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronDown, 
  HelpCircle,
  Package,
  Truck,
  Shield,
  CreditCard,
  Wrench,
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
}

const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Все вопросы', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'order', name: 'Заказ', icon: <Package className="w-4 h-4" /> },
    { id: 'delivery', name: 'Доставка', icon: <Truck className="w-4 h-4" /> },
    { id: 'warranty', name: 'Гарантия', icon: <Shield className="w-4 h-4" /> },
    { id: 'payment', name: 'Оплата', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'service', name: 'Сервис', icon: <Wrench className="w-4 h-4" /> }
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      category: 'order',
      question: 'Как оформить заказ?',
      answer: 'Выберите нужный товар в каталоге, настройте конфигурацию (если необходимо), добавьте в корзину и перейдите к оформлению. Заполните контактные данные и адрес доставки. После отправки заказа с вами свяжется менеджер для подтверждения.',
      icon: <Package className="w-5 h-5" />
    },
    {
      id: '2',
      category: 'order',
      question: 'Можно ли изменить или отменить заказ?',
      answer: 'Да, вы можете изменить или отменить заказ до момента отправки. Свяжитесь с нашим менеджером по телефону или в Telegram как можно скорее после оформления заказа.',
      icon: <Package className="w-5 h-5" />
    },
    {
      id: '3',
      category: 'delivery',
      question: 'Какие способы доставки доступны?',
      answer: 'Мы предлагаем: экспресс-доставку в день заказа по Москве (при заказе до 14:00), стандартную доставку курьером (1-2 дня), доставку транспортными компаниями по России (2-7 дней). Также возможен самовывоз из нашего офиса.',
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: '4',
      category: 'delivery',
      question: 'Сколько стоит доставка?',
      answer: 'Стоимость доставки зависит от вашего местоположения: в пределах МКАД - от 500₽, до 30 км от МКАД - от 700₽, другие регионы - от 400₽. При заказе от 50 000₽ доставка в пределах МКАД бесплатная.',
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: '5',
      category: 'payment',
      question: 'Какие способы оплаты принимаете?',
      answer: 'Вы можете оплатить заказ: наличными курьеру при получении, банковской картой онлайн или курьеру, безналичным расчетом для юридических лиц, в рассрочку от 3 до 12 месяцев.',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: '6',
      category: 'payment',
      question: 'Есть ли рассрочка или кредит?',
      answer: 'Да, мы предоставляем рассрочку от наших партнеров-банков на срок от 3 до 12 месяцев. Оформление занимает 15 минут, решение приходит мгновенно. Первоначальный взнос не требуется.',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: '7',
      category: 'warranty',
      question: 'Какая гарантия на товары?',
      answer: 'На все товары предоставляется официальная гарантия производителя от 1 до 3 лет. На собранные компьютеры дополнительно предоставляется наша гарантия на сборку - 1 год. Гарантийное обслуживание осуществляется в авторизованных сервисных центрах.',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: '8',
      category: 'warranty',
      question: 'Что делать при гарантийном случае?',
      answer: 'Свяжитесь с нами любым удобным способом. Мы поможем диагностировать проблему удаленно или организуем доставку товара в сервисный центр. Весь процесс гарантийного обслуживания мы берем на себя.',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: '9',
      category: 'service',
      question: 'Предоставляете ли услуги по сборке ПК?',
      answer: 'Да, мы профессионально собираем компьютеры любой конфигурации. Сборка включает: установку всех компонентов, прокладку кабелей, установку системы охлаждения, тестирование под нагрузкой, установку операционной системы.',
      icon: <Wrench className="w-5 h-5" />
    },
    {
      id: '10',
      category: 'service',
      question: 'Можно ли заказать установку ПО?',
      answer: 'Да, мы устанавливаем операционную систему, драйверы, антивирус и необходимое программное обеспечение. Также настраиваем систему для оптимальной производительности под ваши задачи.',
      icon: <Wrench className="w-5 h-5" />
    },
    {
      id: '11',
      category: 'order',
      question: 'Как отслеживать статус заказа?',
      answer: 'После оформления заказа вы получите номер для отслеживания. Также наш менеджер будет информировать вас о всех этапах выполнения заказа через Telegram или SMS.',
      icon: <Package className="w-5 h-5" />
    },
    {
      id: '12',
      category: 'delivery',
      question: 'Можно ли проверить товар при получении?',
      answer: 'Да, вы можете проверить комплектность и внешний вид товара при курьере. Для полной проверки работоспособности мы предоставляем 14 дней с момента покупки.',
      icon: <Truck className="w-5 h-5" />
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  const toggleItem = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

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
          <h1 className="text-xl font-bold text-white">Частые вопросы</h1>
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
              <h2 className="text-2xl font-bold mb-2">Ответы на ваши вопросы</h2>
              <p className="text-purple-100">Найдите ответы на популярные вопросы о наших услугах</p>
            </div>
            <HelpCircle className="w-16 h-16 text-purple-200" />
          </div>
        </Card>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                icon={category.icon}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20 overflow-hidden">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-purple-400">{item.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.question}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedItems.includes(item.id) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedItems.includes(item.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-4 border-t border-purple-500/10 pt-4">
                        <p className="text-gray-300 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-lg border-purple-500/30 p-8 text-center">
            <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Не нашли ответ на свой вопрос?
            </h3>
            <p className="text-gray-300 mb-6">
              Свяжитесь с нами в Telegram или позвоните — мы всегда готовы помочь!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                onClick={() => window.open('https://t.me/your_support', '_blank')}
                icon={<MessageCircle className="w-5 h-5" />}
              >
                Написать в Telegram
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/catalog')}
              >
                Перейти в каталог
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;