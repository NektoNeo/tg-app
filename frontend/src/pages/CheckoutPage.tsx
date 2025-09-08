import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  MessageSquare,
  ShoppingCart,
  Check,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Button, Card, Input, Badge } from '../components/ui';
import { useTelegram } from '../hooks/useTelegram';
import toast from 'react-hot-toast';

interface CheckoutForm {
  name: string;
  phone: string;
  city: string;
  address: string;
  comment: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { telegram, user } = useTelegram();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    name: '',
    phone: '',
    city: '',
    address: '',
    comment: '',
  });
  
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  
  // Pre-fill form with Telegram user data
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: `${user.first_name} ${user.last_name || ''}`.trim(),
      }));
    }
  }, [user]);
  
  // Enable/disable MainButton based on form validity
  useEffect(() => {
    if (telegram?.MainButton) {
      const isValid = validateForm();
      
      if (isValid && items.length > 0) {
        telegram.MainButton.text = `Оформить заказ на ${totalPrice.toLocaleString('ru-RU')} ₽`;
        telegram.MainButton.show();
        telegram.MainButton.enable();
      } else {
        telegram.MainButton.disable();
      }
      
      // Set up MainButton click handler
      telegram.MainButton.onClick(handleSubmit);
      
      return () => {
        telegram.MainButton.hide();
        telegram.MainButton.offClick(handleSubmit);
      };
    }
  }, [form, items, totalPrice, telegram]);
  
  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Введите имя';
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = 'Введите телефон';
    } else if (!/^[+]?[0-9\s()-]+$/.test(form.phone)) {
      newErrors.phone = 'Неверный формат телефона';
    }
    
    if (!form.city.trim()) {
      newErrors.city = 'Введите город';
    }
    
    if (!form.address.trim()) {
      newErrors.address = 'Введите адрес доставки';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  const handleSubmit = async () => {
    if (!validateForm() || items.length === 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare order data
      const orderData = {
        user: {
          telegram_id: user?.id,
          username: user?.username,
          ...form,
        },
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          configuration: item.configuration,
        })),
        totalPrice,
        createdAt: new Date().toISOString(),
      };
      
      // Send order to backend
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Show success message
        toast.success('Заказ успешно оформлен!');
        
        // Clear cart
        clearCart();
        
        // Send data to Telegram
        if (telegram) {
          telegram.sendData(JSON.stringify({
            type: 'order_created',
            orderId: result.orderId,
            ...orderData,
          }));
        }
        
        // Navigate to success page
        navigate(`/order-success/${result.orderId}`);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Ошибка при оформлении заказа. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-va-dark text-white flex flex-col">
        <div className="px-4 py-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-20 h-20 bg-va-purple/20 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-10 h-10 text-va-purple" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Корзина пуста</h2>
          <p className="text-va-gray text-center mb-6">
            Добавьте товары в корзину для оформления заказа
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/catalog')}
          >
            Перейти в каталог
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-va-dark text-white">
      {/* Header */}
      <div className="px-4 py-4 bg-gradient-to-b from-va-dark-lighter to-va-dark">
        <div className="flex items-center gap-4 mb-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold flex-1">Оформление заказа</h1>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="px-4 py-4">
        <Card variant="gradient" padding="md">
          <h3 className="font-semibold mb-3">Ваш заказ</h3>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex-1">
                  <p className="text-white">{item.name}</p>
                  <p className="text-va-gray">
                    {item.quantity} шт. × {item.price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                <p className="text-white font-medium">
                  {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                </p>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-va-purple/30">
            <div className="flex justify-between items-center">
              <span className="text-lg">Итого:</span>
              <span className="text-2xl font-bold text-white">
                {totalPrice.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Checkout Form */}
      <div className="px-4 py-4">
        <h3 className="font-semibold mb-4">Данные для доставки</h3>
        
        <div className="space-y-4">
          <Input
            label="Имя"
            placeholder="Введите ваше имя"
            value={form.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            icon={<User className="w-5 h-5" />}
            fullWidth
          />
          
          <Input
            label="Телефон"
            placeholder="+7 (999) 123-45-67"
            value={form.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone}
            icon={<Phone className="w-5 h-5" />}
            type="tel"
            fullWidth
          />
          
          <Input
            label="Город"
            placeholder="Москва"
            value={form.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            error={errors.city}
            icon={<MapPin className="w-5 h-5" />}
            fullWidth
          />
          
          <Input
            label="Адрес доставки"
            placeholder="ул. Пушкина, д. 10, кв. 5"
            value={form.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            error={errors.address}
            icon={<MapPin className="w-5 h-5" />}
            fullWidth
          />
          
          <div>
            <label className="block text-sm font-medium text-va-gray mb-1">
              Комментарий к заказу
            </label>
            <textarea
              placeholder="Дополнительные пожелания..."
              value={form.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              className="w-full px-4 py-2.5 bg-va-dark-card border border-va-dark-border rounded-va text-white placeholder-va-gray focus:outline-none focus:ring-2 focus:ring-va-purple focus:border-transparent transition-all duration-200 min-h-[100px]"
            />
          </div>
        </div>
      </div>
      
      {/* Info Cards */}
      <div className="px-4 py-4">
        <div className="space-y-3">
          <Card variant="bordered" padding="sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-va-purple/20 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-va-purple" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Бесплатная сборка</p>
                <p className="text-xs text-va-gray">Соберем и протестируем за 1-2 дня</p>
              </div>
            </div>
          </Card>
          
          <Card variant="bordered" padding="sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-va-purple/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-va-purple" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Отправка транспортной компанией</p>
                <p className="text-xs text-va-gray">СДЭК или DPD, 2-7 дней</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Submit Button (for non-Telegram environments) */}
      {!telegram && (
        <div className="px-4 py-4">
          <Button
            fullWidth
            size="lg"
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Оформить заказ
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;