import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  Clock,
  Cpu,
  HardDrive,
  Monitor,
  Zap,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { Button, Card, Badge, Select, Tabs, TabPanel } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

// Временные данные для демонстрации
const productData = {
  id: '1',
  name: 'VA NOVA Gaming RTX 4070',
  price: 125000,
  oldPrice: 145000,
  basePrice: 125000, // Базовая цена без апгрейдов
  images: [
    '/api/placeholder/400/400',
    '/api/placeholder/400/400',
    '/api/placeholder/400/400',
  ],
  specs: {
    cpu: 'Intel Core i5-13400F',
    gpu: 'NVIDIA RTX 4070 12GB',
    ram: '16GB DDR4 3200MHz',
    storage: '1TB NVMe SSD',
    motherboard: 'MSI B760M Gaming Plus',
    psu: '750W 80+ Gold',
    case: 'VA NOVA RGB Case',
    cooling: 'DeepCool AK620',
  },
  description: 'Мощный игровой компьютер для комфортной игры в 2K разрешении. Справится с любыми современными играми на высоких настройках графики.',
  features: [
    'Производительность в играх на высоких настройках',
    'Тихая система охлаждения',
    'RGB подсветка с управлением',
    'Готов к стримингу',
    'Поддержка Ray Tracing и DLSS 3',
  ],
  inStock: true,
  warranty: '3 года',
  delivery: '2-3 дня',
};

// Опции конфигуратора
const configuratorOptions = {
  ram: [
    { value: '16gb', label: '16GB DDR4 3200MHz', price: 0 },
    { value: '32gb', label: '32GB DDR4 3200MHz', price: 8000 },
    { value: '64gb', label: '64GB DDR4 3200MHz', price: 24000 },
  ],
  storage: [
    { value: '1tb', label: '1TB NVMe SSD', price: 0 },
    { value: '2tb', label: '2TB NVMe SSD', price: 7000 },
    { value: '1tb+1tb', label: '1TB NVMe + 1TB HDD', price: 4000 },
    { value: '2tb+2tb', label: '2TB NVMe + 2TB HDD', price: 12000 },
  ],
};

const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Конфигуратор
  const [selectedRam, setSelectedRam] = useState('16gb');
  const [selectedStorage, setSelectedStorage] = useState('1tb');
  
  // Расчет финальной цены
  const calculatePrice = () => {
    let price = productData.basePrice;
    
    const ramOption = configuratorOptions.ram.find(opt => opt.value === selectedRam);
    const storageOption = configuratorOptions.storage.find(opt => opt.value === selectedStorage);
    
    if (ramOption) price += ramOption.price;
    if (storageOption) price += storageOption.price;
    
    return price * quantity;
  };
  
  const finalPrice = calculatePrice();
  const discount = productData.oldPrice ? Math.round((1 - productData.price / productData.oldPrice) * 100) : 0;
  
  const handleAddToCart = () => {
    const ramOption = configuratorOptions.ram.find(opt => opt.value === selectedRam);
    const storageOption = configuratorOptions.storage.find(opt => opt.value === selectedStorage);
    
    addItem({
      productId: productData.id,
      name: productData.name,
      price: calculatePrice() / quantity, // Price per item with configuration
      basePrice: productData.basePrice,
      quantity,
      image: productData.images[0],
      configuration: {
        ram: selectedRam,
        storage: selectedStorage,
      },
      specs: {
        cpu: productData.specs.cpu,
        gpu: productData.specs.gpu,
        ram: ramOption?.label || productData.specs.ram,
        storage: storageOption?.label || productData.specs.storage,
      },
    });
    
    toast.success('Товар добавлен в корзину');
  };
  
  const handleShare = () => {
    console.log('Share product');
    // TODO: Implement share functionality
  };
  
  const tabs = [
    { id: 'description', label: 'Описание', icon: null },
    { id: 'specs', label: 'Характеристики', icon: null },
    { id: 'delivery', label: 'Доставка', icon: null },
  ];
  
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
          <h1 className="text-xl font-semibold flex-1">{productData.name}</h1>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="px-4 py-4">
        <div className="relative aspect-square bg-va-dark-lighter rounded-va-lg overflow-hidden mb-4">
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedImage}
              src={productData.images[selectedImage]}
              alt={productData.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && <Badge variant="warning">-{discount}%</Badge>}
            {productData.inStock && <Badge variant="success">В наличии</Badge>}
          </div>
          
          {/* Favorite Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        
        {/* Thumbnails */}
        <div className="flex gap-2">
          {productData.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-20 h-20 rounded-va overflow-hidden border-2 transition-all ${
                selectedImage === index 
                  ? 'border-va-purple shadow-va-glow' 
                  : 'border-va-dark-border'
              }`}
            >
              <img src={image} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      
      {/* Price and Actions */}
      <div className="px-4 py-4 border-t border-va-dark-border">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {finalPrice.toLocaleString('ru-RU')} ₽
              </span>
              {productData.oldPrice && quantity === 1 && selectedRam === '16gb' && selectedStorage === '1tb' && (
                <span className="text-lg text-va-gray line-through">
                  {(productData.oldPrice * quantity).toLocaleString('ru-RU')} ₽
                </span>
              )}
            </div>
            {quantity > 1 && (
              <p className="text-sm text-va-gray mt-1">
                {calculatePrice() / quantity} ₽ за штуку
              </p>
            )}
          </div>
          
          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Button
          fullWidth
          size="lg"
          variant="primary"
          onClick={handleAddToCart}
          disabled={!productData.inStock}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Добавить в корзину
        </Button>
        
        {/* Features */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <Card variant="bordered" padding="sm" hover={false}>
            <div className="text-center">
              <Truck className="w-5 h-5 text-va-purple mx-auto mb-1" />
              <p className="text-xs text-va-gray">Доставка</p>
              <p className="text-xs font-semibold">{productData.delivery}</p>
            </div>
          </Card>
          <Card variant="bordered" padding="sm" hover={false}>
            <div className="text-center">
              <Shield className="w-5 h-5 text-va-purple mx-auto mb-1" />
              <p className="text-xs text-va-gray">Гарантия</p>
              <p className="text-xs font-semibold">{productData.warranty}</p>
            </div>
          </Card>
          <Card variant="bordered" padding="sm" hover={false}>
            <div className="text-center">
              <Clock className="w-5 h-5 text-va-purple mx-auto mb-1" />
              <p className="text-xs text-va-gray">Сборка</p>
              <p className="text-xs font-semibold">1-2 дня</p>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Configurator */}
      <div className="px-4 py-4 border-t border-va-dark-border">
        <h3 className="text-lg font-semibold mb-4">Конфигуратор</h3>
        
        <div className="space-y-4">
          <Select
            label="Оперативная память"
            value={selectedRam}
            onChange={(e) => setSelectedRam(e.target.value)}
            options={configuratorOptions.ram.map(opt => ({
              value: opt.value,
              label: `${opt.label} ${opt.price > 0 ? `(+${opt.price.toLocaleString('ru-RU')} ₽)` : ''}`,
            }))}
            fullWidth
          />
          
          <Select
            label="Накопитель"
            value={selectedStorage}
            onChange={(e) => setSelectedStorage(e.target.value)}
            options={configuratorOptions.storage.map(opt => ({
              value: opt.value,
              label: `${opt.label} ${opt.price > 0 ? `(+${opt.price.toLocaleString('ru-RU')} ₽)` : ''}`,
            }))}
            fullWidth
          />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="px-4 py-4 border-t border-va-dark-border">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
          fullWidth
        />
        
        <div className="mt-4">
          <TabPanel tabId="description" activeTab={activeTab}>
            <div className="space-y-4">
              <p className="text-va-gray">{productData.description}</p>
              
              <div>
                <h4 className="font-semibold mb-2">Особенности:</h4>
                <ul className="space-y-2">
                  {productData.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-va-purple flex-shrink-0 mt-0.5" />
                      <span className="text-va-gray">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabPanel>
          
          <TabPanel tabId="specs" activeTab={activeTab}>
            <div className="space-y-3">
              {Object.entries(productData.specs).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-va-purple/20 rounded-va flex items-center justify-center">
                    {key === 'cpu' && <Cpu className="w-5 h-5 text-va-purple" />}
                    {key === 'gpu' && <Monitor className="w-5 h-5 text-va-purple" />}
                    {key === 'ram' && <HardDrive className="w-5 h-5 text-va-purple" />}
                    {key === 'storage' && <HardDrive className="w-5 h-5 text-va-purple" />}
                    {key === 'psu' && <Zap className="w-5 h-5 text-va-purple" />}
                    {!['cpu', 'gpu', 'ram', 'storage', 'psu'].includes(key) && 
                      <div className="w-2 h-2 bg-va-purple rounded-full" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-va-gray capitalize">
                      {key === 'cpu' && 'Процессор'}
                      {key === 'gpu' && 'Видеокарта'}
                      {key === 'ram' && 'Оперативная память'}
                      {key === 'storage' && 'Накопитель'}
                      {key === 'motherboard' && 'Материнская плата'}
                      {key === 'psu' && 'Блок питания'}
                      {key === 'case' && 'Корпус'}
                      {key === 'cooling' && 'Охлаждение'}
                    </p>
                    <p className="font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>
          
          <TabPanel tabId="delivery" activeTab={activeTab}>
            <div className="space-y-4">
              <Card variant="bordered" padding="md">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-va-purple mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Доставка по России</h4>
                    <p className="text-sm text-va-gray">
                      Доставка осуществляется транспортными компаниями СДЭК и DPD. 
                      Срок доставки 2-7 дней в зависимости от региона.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card variant="bordered" padding="md">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-va-purple mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Гарантия и сервис</h4>
                    <p className="text-sm text-va-gray">
                      Гарантия на компьютер 3 года. Бесплатная диагностика и консультация. 
                      Возможность апгрейда с зачетом старых комплектующих.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabPanel>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;