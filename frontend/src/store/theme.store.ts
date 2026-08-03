import { create } from 'zustand';

type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function loadInitialTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY);
  const theme: Theme = saved === 'dark' ? 'dark' : 'light';
  applyTheme(theme);
  return theme;
}

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: loadInitialTheme(),

  toggleTheme: () => get().setTheme(get().theme === 'light' ? 'dark' : 'light'),

  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
    set({ theme });
  },
}));
