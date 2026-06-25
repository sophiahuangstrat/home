import React from 'react';
import { useAppStore } from '../store/appStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const userRole = useAppStore((state) => state.userRole);
  const logout = useAppStore((state) => state.logout);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/concept', label: 'Home Concept' },
    { path: '/blueprint', label: 'Blueprint' },
    { path: '/rooms', label: 'Rooms' },
    ...(userRole === 'admin' ? [{ path: '/settings', label: 'Settings' }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Home Design Brief</h2>

          <div className="flex items-center gap-8">
            <div className="flex gap-6">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
              <span className="text-xs font-semibold text-gray-600 uppercase">
                {userRole}
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">{children}</main>
    </div>
  );
};
