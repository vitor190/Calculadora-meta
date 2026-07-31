import { create } from 'zustand';

interface SidebarState {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isMobile: boolean;
  isHovered: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (value: boolean) => void;
  setIsMobile: (value: boolean) => void;
}

const useSidebarStore = create<SidebarState>((set) => ({
  isExpanded: true,
  isMobileOpen: false,
  isMobile: false,
  isHovered: false,
  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
  toggleMobileSidebar: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  setIsHovered: (isHovered) => set({ isHovered }),
  setIsMobile: (isMobile) => set({ isMobile }),
}));

if (typeof window !== 'undefined') {
  const sync = () => {
    const mobile = window.innerWidth < 1024;
    const { setIsMobile } = useSidebarStore.getState();
    setIsMobile(mobile);
    if (!mobile) useSidebarStore.setState({ isMobileOpen: false });
  };
  sync();
  window.addEventListener('resize', sync);
}

export function useSidebar() {
  const state = useSidebarStore();
  return { ...state, isExpanded: state.isMobile ? false : state.isExpanded };
}
