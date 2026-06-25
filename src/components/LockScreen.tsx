import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';

interface LockScreenProps {
  onAuthenticated: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);
  const settings = useAppStore((state) => state.data.settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === settings.adminPassword) {
      setAuthenticated('admin');
      onAuthenticated();
    } else if (password === settings.viewerPassword) {
      setAuthenticated('viewer');
      onAuthenticated();
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-12 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Home Design Brief</h1>
            <p className="text-gray-600 text-sm">Enter your password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition"
                autoFocus
              />
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Enter
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center">
            This site is password-protected. Designers: use your provided password.
          </p>
        </div>
      </div>
    </div>
  );
};
