export const LAYOUT_VARIANT =
  import.meta.env.VITE_LAYOUT_VARIANT === 'without-sidebar' ? 'without-sidebar' : 'sidebar';

export const isSidebarEnabled = LAYOUT_VARIANT === 'sidebar';
