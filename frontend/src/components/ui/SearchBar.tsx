import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from './Input';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  suggestions?: string[];
  showSuggestions?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Поиск...',
  value: controlledValue,
  onChange,
  onSearch,
  onClear,
  suggestions = [],
  showSuggestions = true,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [controlledValue, onChange]);
  
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
    setIsFocused(false);
  }, [value, onSearch]);
  
  const handleClear = useCallback(() => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    onClear?.();
    onChange?.('');
  }, [controlledValue, onChange, onClear]);
  
  const handleSuggestionClick = useCallback((suggestion: string) => {
    if (controlledValue === undefined) {
      setInternalValue(suggestion);
    }
    onChange?.(suggestion);
    onSearch?.(suggestion);
    setIsFocused(false);
  }, [controlledValue, onChange, onSearch]);
  
  const showSuggestionsList = showSuggestions && isFocused && suggestions.length > 0 && value.length > 0;
  
  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            icon={<Search className="w-5 h-5" />}
            fullWidth
          />
          {value && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-va-gray hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </form>
      
      <AnimatePresence>
        {showSuggestionsList && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-va-dark-card border border-va-dark-border rounded-va-lg overflow-hidden z-50 shadow-va-card"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                type="button"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2.5 text-left text-white hover:bg-va-purple/20 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-va-gray" />
                <span>{suggestion}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};