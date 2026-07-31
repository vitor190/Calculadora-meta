import { Outlet } from 'react-router';
import { useSidebar } from '../store/sidebar.store';
import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';
import { Backdrop } from './backdrop';

export function AppLayout() {
  const { isExpanded, isHovered } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 xl:flex">
      <AppSidebar />
      <Backdrop />

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? 'lg:ml-70' : 'lg:ml-20'
        }`}
      >
        <AppHeader />
        <main className="mx-auto w-full max-w-400 flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
