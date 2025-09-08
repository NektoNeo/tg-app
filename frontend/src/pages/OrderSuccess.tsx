import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Home, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { postEvent } from '@tma.js/sdk';
import confetti from 'canvas-confetti';

export function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#A78BFA', '#C4B5FD']
    });

    // Send Telegram event
    try {
      postEvent('web_app_trigger_haptic_feedback', {
        type: 'notification',
        notification_type: 'success'
      });
    } catch (error) {
      console.log('Telegram haptic feedback not available');
    }

    // Clear cart after successful order
    const cartStore = localStorage.getItem('cart-storage');
    if (cartStore) {
      const cart = JSON.parse(cartStore);
      cart.state.items = [];
      localStorage.setItem('cart-storage', JSON.stringify(cart));
    }

    // Countdown timer for redirect
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleOpenTelegram = () => {
    try {
      // Open Telegram chat with admin
      window.open('https://t.me/your_admin_username', '_blank');
    } catch (error) {
      console.log('Cannot open Telegram');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20 p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50"></div>
              <CheckCircle className="w-24 h-24 text-green-400 relative z-10" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Заказ успешно оформлен!
            </h1>
            <p className="text-purple-200 text-lg">
              Номер заказа: <span className="font-mono font-bold text-white">{orderId}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 mb-8"
          >
            <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-purple-300 mt-0.5" />
                <div>
                  <p className="text-purple-100 font-medium">Что дальше?</p>
                  <p className="text-purple-200 text-sm mt-1">
                    Наш менеджер свяжется с вами в течение 15 минут для подтверждения заказа и уточнения деталей доставки.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-purple-300 mt-0.5" />
                <div>
                  <p className="text-purple-100 font-medium">Остались вопросы?</p>
                  <p className="text-purple-200 text-sm mt-1">
                    Вы можете связаться с нами в Telegram для быстрого ответа.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <Button
              variant="primary"
              fullWidth
              onClick={handleOpenTelegram}
              icon={<MessageCircle className="w-5 h-5" />}
            >
              Открыть чат в Telegram
            </Button>

            <Link to="/">
              <Button
                variant="secondary"
                fullWidth
                icon={<Home className="w-5 h-5" />}
              >
                Вернуться на главную ({countdown})
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-purple-300 text-sm">
              Спасибо за ваш заказ! 💜
            </p>
            <p className="text-purple-400 text-xs mt-2">
              VA-PC — Ваш надежный поставщик компьютерной техники
            </p>
          </motion.div>
        </Card>

        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-700/20 rounded-full blur-3xl"
          />
        </div>
      </motion.div>
    </div>
  );
}