import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { Badge } from '../ui';

interface CartButtonProps {
  className?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({ className }) => {
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleCart}
      className={`relative p-2 bg-va-gradient rounded-va text-white shadow-va-glow ${className}`}
    >
      <ShoppingCart className="w-6 h-6" />
      
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2"
          >
            <Badge variant="error" size="sm">
              {totalItems > 99 ? '99+' : totalItems}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};