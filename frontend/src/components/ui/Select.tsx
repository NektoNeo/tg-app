import { SelectHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, fullWidth, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'px-3 py-1.5 pr-8 text-sm',
      md: 'px-4 py-2.5 pr-10 text-base',
      lg: 'px-5 py-3 pr-12 text-lg',
    };
    
    return (
      <div className={clsx('relative', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-va-gray mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={clsx(
              'w-full bg-va-dark-card border border-va-dark-border rounded-va',
              'text-white appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-va-purple focus:border-transparent',
              'transition-all duration-200',
              sizes[size],
              error && 'border-red-500',
              props.disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-va-dark-card text-white"
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className={clsx(
            'absolute right-3 top-1/2 transform -translate-y-1/2 text-va-gray pointer-events-none',
            size === 'sm' && 'w-4 h-4',
            size === 'md' && 'w-5 h-5',
            size === 'lg' && 'w-6 h-6'
          )} />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';