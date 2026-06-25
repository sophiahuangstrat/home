import React from 'react';
import { useAppStore } from '../store/appStore';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate }) => {
  const userRole = useAppStore((state) => state.userRole);
  const logout = useAppStore((state) => state.logout);

  const navItems = [
    { path: 'home', label: 'Home' },
    { path: 'about', label: 'About Us' },
    { path: 'concept', label: 'Concept' },
    { path: 'blueprint', label: 'Blueprint' },
    { path: 'rooms', label: 'Rooms' },
    ...(userRole === 'admin' ? [{ path: 'settings', label: 'Settings' }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition"
          >
            Home Design Brief
          </button>

          <div className="flex items-center gap-8">
            <div className="flex gap-6">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
              <span className="text-xs font-semibold text-gray-600 uppercase bg-gray-100 px-3 py-1 rounded-full">
                {userRole}
              </span>
              <button
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
                className="text-sm text-gray-600 hover:text-red-600 transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">{children}</main>

      <footer className="border-t border-gray-200 bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-600">
          <p>Home Design Brief &copy; 2024. All content is private and password-protected.</p>
        </div>
      </footer>
    </div>
  );
};
