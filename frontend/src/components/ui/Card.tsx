import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'bordered';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, padding = 'md', children, ...props }, ref) => {
    const baseStyles = 'rounded-va-lg transition-all duration-200';
    
    const variants = {
      default: 'bg-va-dark-card border border-va-dark-border',
      gradient: 'bg-va-card-gradient border border-va-purple/20',
      bordered: 'bg-transparent border-2 border-va-purple',
    };
    
    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };
    
    const hoverStyles = hover ? 'hover:border-va-purple hover:shadow-va-card cursor-pointer' : '';
    
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { scale: 1.01 } : undefined}
        whileTap={hover ? { scale: 0.99 } : undefined}
        className={clsx(
          baseStyles,
          variants[variant],
          paddings[padding],
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';