import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, fullWidth, ...props }, ref) => {
    return (
      <div className={clsx('relative', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-va-gray mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-va-gray">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full px-4 py-2.5 bg-va-dark-card border border-va-dark-border rounded-va',
              'text-white placeholder-va-gray',
              'focus:outline-none focus:ring-2 focus:ring-va-purple focus:border-transparent',
              'transition-all duration-200',
              icon && 'pl-10',
              error && 'border-red-500',
              props.disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';