import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  pulse = false,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full';
  
  const variants = {
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    error: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    purple: 'bg-va-purple/20 text-va-purple border border-va-purple/30',
    default: 'bg-va-dark-lighter text-va-gray border border-va-dark-border',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };
  
  return (
    <span
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        pulse && 'animate-pulse-slow',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};