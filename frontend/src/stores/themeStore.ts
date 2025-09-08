import { create } from 'zustand';

interface ThemeStore {
  theme: 'light' | 'dark';
  tgThemeParams: any;
  initTheme: (tgThemeParams: any) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',
  tgThemeParams: null,
  initTheme: (tgThemeParams) => {
    set({ 
      tgThemeParams,
      theme: tgThemeParams?.colorScheme === 'light' ? 'light' : 'dark'
    });
  },
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'dark' ? 'light' : 'dark' 
  })),
}));