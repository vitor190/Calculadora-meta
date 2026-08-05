import { Outlet } from 'react-router';
import { AppHeader } from './app-header';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex min-h-screen min-w-0 flex-col">
        <AppHeader />
        <main className="mx-auto w-full max-w-400 min-w-0 flex-1 p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
