import { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  
  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
  };
  
  const baseTabStyles = 'relative font-medium transition-all duration-200 flex items-center gap-2';
  
  const getTabStyles = (isActive: boolean, disabled?: boolean) => {
    if (disabled) {
      return 'text-va-gray/50 cursor-not-allowed';
    }
    
    switch (variant) {
      case 'pills':
        return clsx(
          isActive
            ? 'bg-va-gradient text-white shadow-va-glow'
            : 'text-va-gray hover:text-white hover:bg-va-purple/20',
          'rounded-va'
        );
      case 'underline':
        return clsx(
          isActive
            ? 'text-va-purple border-b-2 border-va-purple'
            : 'text-va-gray hover:text-white border-b-2 border-transparent'
        );
      default:
        return clsx(
          isActive
            ? 'bg-va-dark-card text-white border-va-purple'
            : 'text-va-gray hover:text-white hover:bg-va-dark-card/50',
          'border border-va-dark-border rounded-va'
        );
    }
  };
  
  return (
    <div className={clsx(
      'flex gap-2',
      fullWidth && 'w-full',
      variant === 'underline' && 'border-b border-va-dark-border'
    )}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <motion.button
            key={tab.id}
            whileHover={!tab.disabled ? { scale: 1.02 } : undefined}
            whileTap={!tab.disabled ? { scale: 0.98 } : undefined}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            className={clsx(
              baseTabStyles,
              sizes[size],
              getTabStyles(isActive, tab.disabled),
              fullWidth && 'flex-1'
            )}
            disabled={tab.disabled}
          >
            {tab.icon && (
              <span className={clsx(
                'transition-colors',
                isActive ? 'text-current' : 'text-va-gray'
              )}>
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            
            {variant === 'pills' && isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-va-gradient rounded-va -z-10"
                transition={{ type: 'spring', duration: 0.3 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

interface TabPanelProps {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ tabId, activeTab, children }) => {
  if (tabId !== activeTab) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};