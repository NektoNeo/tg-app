import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { Button, Card, Badge } from '../ui';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    isOpen, 
    setCartOpen, 
    removeItem, 
    updateQuantity, 
    clearCart,
    getTotalPrice,
    getTotalItems 
  } = useCartStore();
  
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  
  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-va-dark-card border-l border-va-dark-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-4 border-b border-va-dark-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-va-purple" />
                  <h2 className="text-lg font-semibold text-white">
                    Корзина {totalItems > 0 && <span className="text-va-gray">({totalItems})</span>}
                  </h2>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCartOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-4 py-8">
                  <div className="w-20 h-20 bg-va-purple/20 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="w-10 h-10 text-va-purple" />
                  </div>
                  <p className="text-va-gray text-center mb-4">
                    Корзина пуста
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/catalog');
                    }}
                  >
                    Перейти в каталог
                  </Button>
                </div>
              ) : (
                <div className="px-4 py-4 space-y-4">
                  {items.map((item) => (
                    <Card key={item.id} variant="default" padding="md">
                      <div className="flex gap-3">
                        {/* Image */}
                        <div className="w-20 h-20 bg-va-dark-lighter rounded-va flex items-center justify-center flex-shrink-0">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover rounded-va"
                            />
                          ) : (
                            <ShoppingCart className="w-8 h-8 text-va-purple/30" />
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white text-sm mb-1 truncate">
                            {item.name}
                          </h3>
                          
                          {/* Configuration */}
                          {(item.configuration.ram || item.configuration.storage) && (
                            <div className="flex gap-2 mb-2">
                              {item.configuration.ram && (
                                <Badge size="sm" variant="purple">
                                  {item.configuration.ram === '16gb' && '16GB'}
                                  {item.configuration.ram === '32gb' && '32GB'}
                                  {item.configuration.ram === '64gb' && '64GB'}
                                </Badge>
                              )}
                              {item.configuration.storage && (
                                <Badge size="sm" variant="purple">
                                  {item.configuration.storage === '1tb' && '1TB'}
                                  {item.configuration.storage === '2tb' && '2TB'}
                                  {item.configuration.storage === '1tb+1tb' && '1TB+1TB'}
                                  {item.configuration.storage === '2tb+2tb' && '2TB+2TB'}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          {/* Price and Quantity */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-va-purple font-semibold">
                                {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-va-gray">
                                  {item.price.toLocaleString('ru-RU')} ₽ × {item.quantity}
                                </p>
                              )}
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeItem(item.id)}
                                className="p-1 ml-1"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  {/* Clear Cart Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={clearCart}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Очистить корзину
                  </Button>
                </div>
              )}
            </div>
            
            {/* Footer with Checkout */}
            {items.length > 0 && (
              <div className="px-4 py-4 border-t border-va-dark-border bg-va-dark">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-va-gray">Итого:</span>
                  <span className="text-2xl font-bold text-white">
                    {totalPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <Button
                  fullWidth
                  size="lg"
                  variant="primary"
                  onClick={handleCheckout}
                >
                  Оформить заказ
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};