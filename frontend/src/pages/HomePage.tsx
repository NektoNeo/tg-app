import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MessageCircle, 
  ChevronRight,
  Monitor,
  Cpu,
  HardDrive,
  Gamepad2,
  Truck,
  Sparkles,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { postEvent } from '@tma.js/sdk';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      postEvent('web_app_request_theme');
      postEvent('web_app_expand');
    } catch (error) {
      console.log('Running outside Telegram');
    }
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickLinks = [
    {
      icon: <Monitor className="w-6 h-6" />,
      title: 'ЗНАКОМЬТЕСЬ,',
      subtitle: 'VA-PC!',
      gradient: 'from-purple-600 to-blue-600',
      path: '/about',
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'КАК ЗАКАЗАТЬ',
      subtitle: 'КОМПЬЮТЕР?',
      gradient: 'from-blue-600 to-purple-600',
      path: '/catalog',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'ОТЗЫВЫ',
      subtitle: '',
      gradient: 'from-purple-600 to-pink-600',
      path: '/reviews',
    },
    {
      icon: <HardDrive className="w-6 h-6" />,
      title: 'FAQ',
      subtitle: '',
      gradient: 'from-pink-600 to-purple-600',
      path: '/faq',
    },
  ];

  const promoCards = [
    {
      title: 'А У НАС РОЗЫГРЫШ!',
      subtitle: 'Игровой ПК и кастомная клавиатура',
      description: 'в уникальном дизайне',
      badge: 'ЗА ПОДПИСКУ!',
      gradient: 'from-purple-900 to-purple-600',
      image: '/images/pc-promo-1.svg'
    },
    {
      title: 'ВЫБРАТЬ И ЗАКАЗАТЬ',
      subtitle: '',
      description: '',
      gradient: 'from-blue-900 to-blue-600',
      image: '/images/pc-promo-2.svg',
      action: () => navigate('/catalog')
    }
  ];

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0B0819' }}>
      {/* Grid Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Gradient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[150px]" />

      <div className="relative z-10 px-4 py-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            ДОБРО ПОЖАЛОВАТЬ
          </h1>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            В VA-PC!
          </h2>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">А</span>
          </div>
          <span className="text-white text-lg">Арон</span>
          <ChevronRight className="w-5 h-5 text-purple-400" />
        </motion.div>

        {/* Telegram Channel Button */}
        <motion.a
          href="https://t.me/VAPCBUILD"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-6 max-w-xs hover:shadow-lg hover:shadow-purple-600/30 transition-all"
        >
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="text-white font-semibold">@VAPCBUILD</span>
          <span className="text-white/80 text-sm">наш Telegram-канал</span>
        </motion.a>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mb-8"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Например: RTX 4090"
            className="w-full px-6 py-4 bg-white/8 backdrop-blur-md border border-purple-600/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-600/40 transition-all"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:shadow-lg hover:shadow-purple-600/30 transition-all"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </motion.div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {quickLinks.map((link, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              onClick={() => navigate(link.path)}
              className="relative p-4 bg-white/5 backdrop-blur-sm border border-purple-600/20 rounded-2xl hover:bg-white/8 hover:border-purple-600/40 transition-all group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center mb-3 mx-auto`}>
                  {link.icon}
                </div>
                <h3 className="text-white font-bold text-xs">{link.title}</h3>
                {link.subtitle && <h3 className="text-white font-bold text-xs">{link.subtitle}</h3>}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Promo Cards */}
        <div className="space-y-4 mb-8">
          {promoCards.map((promo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              onClick={promo.action}
              className={`relative h-48 rounded-2xl overflow-hidden ${promo.action ? 'cursor-pointer' : ''}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${promo.gradient} opacity-90`} />
              
              {/* Background Image */}
              {promo.image && (
                <div className="absolute right-0 top-0 h-full w-2/3 opacity-50">
                  <img 
                    src={promo.image} 
                    alt=""
                    className="h-full w-full object-contain object-right"
                  />
                </div>
              )}
              
              <div className="relative z-10 p-6 h-full flex flex-col justify-center">
                {promo.badge && (
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold mb-3 w-fit">
                    {promo.badge}
                  </span>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{promo.title}</h3>
                {promo.subtitle && (
                  <p className="text-sm text-white/90">{promo.subtitle}</p>
                )}
                {promo.description && (
                  <p className="text-sm text-white/90">{promo.description}</p>
                )}
                {promo.action && (
                  <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-white" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Delivery Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/delivery')}
            className="w-full p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl hover:shadow-lg hover:shadow-green-600/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-white" />
                <div className="text-left">
                  <h3 className="text-white font-bold">СКОЛЬКО СТОИТ ДОСТАВКА?</h3>
                  <p className="text-white/80 text-xs">Рассчитать стоимость доставки к Вашему адресу</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </button>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-20"
        >
          <div className="p-6 bg-white/5 backdrop-blur-sm border border-purple-600/20 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-2">ОСТАЛИСЬ ВОПРОСЫ?</h3>
            <p className="text-gray-300 mb-4">НАШ МЕНЕДЖЕР ПОМОЖЕТ ВАМ!</p>
            <button
              onClick={() => window.open('https://t.me/your_manager', '_blank')}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-bold hover:shadow-lg hover:shadow-purple-600/30 transition-all"
            >
              Написать менеджеру
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;