import { motion } from 'framer-motion';
import { ShoppingCart, Cpu, HardDrive, Monitor } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image?: string;
  specs: {
    cpu?: string;
    gpu?: string;
    ram?: string;
    storage?: string;
  };
  badges?: Array<{
    text: string;
    variant: 'success' | 'warning' | 'error' | 'info' | 'purple';
  }>;
  inStock?: boolean;
  isHit?: boolean;
  onAddToCart?: () => void;
  onQuickView?: () => void;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  oldPrice,
  image,
  specs,
  badges = [],
  inStock = true,
  isHit = false,
  onAddToCart,
  onQuickView,
  onClick,
}) => {
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;
  
  return (
    <Card
      variant="default"
      padding="none"
      hover
      onClick={onClick}
      className="relative overflow-hidden group"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isHit && <Badge variant="error" pulse>Хит</Badge>}
        {discount > 0 && <Badge variant="warning">-{discount}%</Badge>}
        {badges.map((badge, index) => (
          <Badge key={index} variant={badge.variant}>
            {badge.text}
          </Badge>
        ))}
      </div>
      
      {/* Image Section */}
      <div className="relative h-48 bg-va-dark-lighter overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Monitor className="w-16 h-16 text-va-purple/30" />
          </div>
        )}
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {onQuickView && (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView();
              }}
            >
              Быстрый просмотр
            </Button>
          )}
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2">{name}</h3>
        
        {/* Specs */}
        <div className="space-y-1 mb-3">
          {specs.cpu && (
            <div className="flex items-center gap-2 text-sm text-va-gray">
              <Cpu className="w-4 h-4" />
              <span>{specs.cpu}</span>
            </div>
          )}
          {specs.gpu && (
            <div className="flex items-center gap-2 text-sm text-va-gray">
              <Monitor className="w-4 h-4" />
              <span>{specs.gpu}</span>
            </div>
          )}
          {specs.ram && (
            <div className="flex items-center gap-2 text-sm text-va-gray">
              <HardDrive className="w-4 h-4" />
              <span>{specs.ram}</span>
            </div>
          )}
        </div>
        
        {/* Price */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {price.toLocaleString('ru-RU')} ₽
              </span>
              {oldPrice && (
                <span className="text-sm text-va-gray line-through">
                  {oldPrice.toLocaleString('ru-RU')} ₽
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Stock Status */}
        <div className="mb-3">
          {inStock ? (
            <Badge variant="success" size="sm">В наличии</Badge>
          ) : (
            <Badge variant="error" size="sm">Под заказ</Badge>
          )}
        </div>
        
        {/* Add to Cart Button */}
        {onAddToCart && (
          <Button
            fullWidth
            variant="primary"
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            disabled={!inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            В корзину
          </Button>
        )}
      </div>
    </Card>
  );
};