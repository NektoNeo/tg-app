import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Users, Shield, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Официальный партнер',
      description: 'Авторизованный продавец ведущих брендов компьютерной техники'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Гарантия качества',
      description: 'Все товары сертифицированы, предоставляем официальную гарантию'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Быстрая доставка',
      description: 'Доставка по Москве в день заказа, по России 2-5 дней'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Опытная команда',
      description: 'Более 10 лет опыта в сборке и настройке компьютеров'
    }
  ];

  const achievements = [
    { number: '5000+', label: 'Довольных клиентов' },
    { number: '10+', label: 'Лет на рынке' },
    { number: '24/7', label: 'Поддержка клиентов' },
    { number: '100%', label: 'Оригинальная продукция' }
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
          <h1 className="text-xl font-bold text-white">О компании</h1>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 p-8 text-white">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">VA-PC</h2>
            <p className="text-xl mb-2">Ваш надежный партнер в мире технологий</p>
            <p className="text-purple-100">
              Специализируемся на продаже и сборке высокопроизводительных компьютеров
            </p>
          </motion.div>
        </Card>
      </motion.div>

      {/* About Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Company Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">О нас</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                VA-PC — это команда профессионалов, которая более 10 лет занимается продажей 
                и сборкой компьютеров для любых задач: от офисных решений до мощных игровых 
                станций и профессиональных рабочих станций.
              </p>
              <p>
                Мы работаем напрямую с производителями и официальными дистрибьюторами, 
                что позволяет нам предлагать лучшие цены и гарантировать подлинность товаров.
              </p>
              <p>
                Наша миссия — сделать высокие технологии доступными каждому, предоставляя 
                качественное оборудование и профессиональный сервис.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-white mb-6">Почему выбирают нас</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20 p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-purple-400">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20 p-8">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Наши достижения</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {item.number}
                  </div>
                  <div className="text-sm text-gray-400">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Наши услуги</h3>
            <div className="space-y-3">
              {[
                'Сборка компьютеров под ключ',
                'Модернизация и апгрейд существующих систем',
                'Установка и настройка программного обеспечения',
                'Консультации по подбору комплектующих',
                'Гарантийное и постгарантийное обслуживание',
                'Доставка и установка оборудования'
              ].map((service, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{service}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-lg border-purple-500/30 p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Готовы сделать заказ?
            </h3>
            <p className="text-gray-300 mb-6">
              Свяжитесь с нами для консультации и подбора оптимального решения
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/catalog')}
            >
              Перейти в каталог
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;