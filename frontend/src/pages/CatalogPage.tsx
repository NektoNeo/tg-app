import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, Grid, List } from 'lucide-react';
import { ProductCard, SearchBar, Select, Button, Card, Badge } from '../components/ui';
import { useCartStore } from '../store/cartStore';

// Временные данные для демонстрации
const mockProducts = [
  {
    id: '1',
    name: 'VA NOVA Gaming RTX 4070',
    price: 125000,
    oldPrice: 145000,
    specs: {
      cpu: 'Intel Core i5-13400F',
      gpu: 'NVIDIA RTX 4070 12GB',
      ram: '16GB DDR4 3200MHz',
      storage: '1TB NVMe SSD',
    },
    badges: [{ text: 'Новинка', variant: 'info' as const }],
    inStock: true,
    isHit: true,
  },
  {
    id: '2',
    name: 'VA NOVA Pro RTX 4080',
    price: 185000,
    specs: {
      cpu: 'Intel Core i7-13700KF',
      gpu: 'NVIDIA RTX 4080 16GB',
      ram: '32GB DDR5 5600MHz',
      storage: '2TB NVMe SSD',
    },
    badges: [],
    inStock: true,
    isHit: false,
  },
  {
    id: '3',
    name: 'VA NOVA Ultimate RTX 4090',
    price: 295000,
    oldPrice: 320000,
    specs: {
      cpu: 'Intel Core i9-13900KS',
      gpu: 'NVIDIA RTX 4090 24GB',
      ram: '64GB DDR5 6000MHz',
      storage: '2TB NVMe SSD Gen5',
    },
    badges: [{ text: 'TOP', variant: 'error' as const }],
    inStock: false,
    isHit: true,
  },
  {
    id: '4',
    name: 'VA NOVA Budget GTX 1660',
    price: 55000,
    specs: {
      cpu: 'Intel Core i3-12100F',
      gpu: 'NVIDIA GTX 1660 Super',
      ram: '8GB DDR4 3200MHz',
      storage: '512GB NVMe SSD',
    },
    badges: [{ text: 'Выгодно', variant: 'success' as const }],
    inStock: true,
    isHit: false,
  },
];

const CatalogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Фильтры
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
  const [selectedGpu, setSelectedGpu] = useState('all');
  const [selectedCpu, setSelectedCpu] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // Фильтрация и сортировка продуктов
  const filteredProducts = useMemo(() => {
    let filtered = [...mockProducts];
    
    // Поиск
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specs.gpu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specs.cpu?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Фильтр по наличию
    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }
    
    // Фильтр по цене
    filtered = filtered.filter(p => 
      p.price >= priceRange.min && p.price <= priceRange.max
    );
    
    // Сортировка
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // popular - оставляем как есть
        break;
    }
    
    return filtered;
  }, [searchQuery, sortBy, priceRange, inStockOnly]);
  
  const addToCart = useCartStore((state) => state.addItem);
  
  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        basePrice: product.oldPrice || product.price,
        quantity: 1,
        image: product.image,
        configuration: {},
        specs: product.specs || {}
      });
    }
  };
  
  const handleQuickView = (productId: string) => {
    console.log('Quick view:', productId);
    // TODO: Implement quick view modal
  };
  
  const handleProductClick = (productId: string) => {
    console.log('Product click:', productId);
    // TODO: Navigate to product page
  };
  
  return (
    <div className="min-h-screen bg-va-dark text-white">
      {/* Header */}
      <div className="px-4 py-4 bg-gradient-to-b from-va-dark-lighter to-va-dark">
        <h1 className="text-2xl font-bold mb-4">Каталог компьютеров</h1>
        
        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по каталогу..."
        />
        
        {/* Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={filterOpen ? 'primary' : 'secondary'}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="w-4 h-4 mr-1" />
              Фильтры
            </Button>
            
            <Select
              size="sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'popular', label: 'Популярные' },
                { value: 'price-asc', label: 'Сначала дешевые' },
                { value: 'price-desc', label: 'Сначала дорогие' },
                { value: 'name', label: 'По названию' },
              ]}
            />
          </div>
          
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters Panel */}
      {filterOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 py-3 bg-va-dark-card border-y border-va-dark-border"
        >
          <div className="space-y-3">
            <div>
              <label className="text-sm text-va-gray">Цена</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  placeholder="От"
                  className="flex-1 px-3 py-1.5 bg-va-dark border border-va-dark-border rounded-va text-sm"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                />
                <span className="text-va-gray">—</span>
                <input
                  type="number"
                  placeholder="До"
                  className="flex-1 px-3 py-1.5 bg-va-dark border border-va-dark-border rounded-va text-sm"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                />
              </div>
            </div>
            
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-va-dark-border bg-va-dark-card text-va-purple focus:ring-va-purple"
                />
                <span className="text-sm">Только в наличии</span>
              </label>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => setFilterOpen(false)}
              >
                Применить
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setPriceRange({ min: 0, max: 500000 });
                  setInStockOnly(false);
                  setSelectedGpu('all');
                  setSelectedCpu('all');
                }}
              >
                Сбросить
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Results Count */}
      <div className="px-4 py-2">
        <p className="text-sm text-va-gray">
          Найдено: <span className="text-white font-semibold">{filteredProducts.length}</span> компьютеров
        </p>
      </div>
      
      {/* Products Grid/List */}
      <div className="px-4 pb-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  {...product}
                  onAddToCart={() => handleAddToCart(product.id)}
                  onQuickView={() => handleQuickView(product.id)}
                  onClick={() => handleProductClick(product.id)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card hover onClick={() => handleProductClick(product.id)}>
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-va-dark-lighter rounded-va flex items-center justify-center flex-shrink-0">
                      <SlidersHorizontal className="w-12 h-12 text-va-purple/30" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <div className="flex items-center gap-2">
                          {product.isHit && <Badge variant="error" size="sm">Хит</Badge>}
                          {product.inStock ? (
                            <Badge variant="success" size="sm">В наличии</Badge>
                          ) : (
                            <Badge variant="error" size="sm">Под заказ</Badge>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-va-gray mb-3">
                        {product.specs.cpu && <p>• {product.specs.cpu}</p>}
                        {product.specs.gpu && <p>• {product.specs.gpu}</p>}
                        {product.specs.ram && <p>• {product.specs.ram}</p>}
                        {product.specs.storage && <p>• {product.specs.storage}</p>}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-white">
                            {product.price.toLocaleString('ru-RU')} ₽
                          </span>
                          {product.oldPrice && (
                            <span className="ml-2 text-sm text-va-gray line-through">
                              {product.oldPrice.toLocaleString('ru-RU')} ₽
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product.id);
                          }}
                          disabled={!product.inStock}
                        >
                          В корзину
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Load More */}
      {filteredProducts.length > 0 && (
        <div className="px-4 pb-6 flex justify-center">
          <Button variant="secondary">
            Показать еще
          </Button>
        </div>
      )}
      
      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="px-4 py-12 text-center">
          <p className="text-va-gray mb-4">Ничего не найдено</p>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchQuery('');
              setPriceRange({ min: 0, max: 500000 });
              setInStockOnly(false);
            }}
          >
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;