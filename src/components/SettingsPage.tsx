import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { AppSettings } from '../types';

export const SettingsPage: React.FC = () => {
  const userRole = useAppStore((state) => state.userRole);
  const settings = useAppStore((state) => state.data.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const saveDataToLocalStorage = useAppStore((state) => state.saveDataToLocalStorage);

  const [showPasswords, setShowPasswords] = useState(false);
  const [adminPassword, setAdminPassword] = useState(settings.adminPassword);
  const [viewerPassword, setViewerPassword] = useState(settings.viewerPassword);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isAdmin = userRole === 'admin';

  const handleUpdatePasswords = () => {
    setError('');
    setSuccess('');

    if (!confirmPassword) {
      setError('Please confirm your admin password to proceed');
      return;
    }

    if (confirmPassword !== settings.adminPassword) {
      setError('Incorrect admin password');
      return;
    }

    if (!adminPassword.trim() || !viewerPassword.trim()) {
      setError('Passwords cannot be empty');
      return;
    }

    if (adminPassword === viewerPassword) {
      setError('Admin and viewer passwords must be different');
      return;
    }

    const updatedSettings: AppSettings = {
      ...settings,
      adminPassword,
      viewerPassword,
      updatedAt: Date.now(),
    };

    updateSettings(updatedSettings);
    saveDataToLocalStorage();
    setSuccess('Passwords updated successfully!');
    setConfirmPassword('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleReset = () => {
    setAdminPassword(settings.adminPassword);
    setViewerPassword(settings.viewerPassword);
    setConfirmPassword('');
    setError('');
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="bg-white rounded-lg p-8 border border-gray-200 space-y-8">
        {/* Password Management */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Passwords</h2>

          <div className="space-y-6">
            {/* Admin Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Admin Password
              </label>
              <div className="flex gap-2">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                  placeholder="Enter new admin password"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Used to access admin features</p>
            </div>

            {/* Viewer Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Viewer Password
              </label>
              <div className="flex gap-2">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={viewerPassword}
                  onChange={(e) => setViewerPassword(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                  placeholder="Enter new viewer password"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Used to access read-only view</p>
            </div>

            {/* Show Passwords Toggle */}
            <button
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              {showPasswords ? '🔒 Hide Passwords' : '👁️ Show Passwords'}
            </button>

            {/* Confirmation Password */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <p className="text-sm font-semibold text-blue-900">
                To confirm changes, enter your current admin password:
              </p>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                placeholder="Current admin password"
              />
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleUpdatePasswords}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                Update Passwords
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">About This App</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-semibold">Data Storage:</span> All data is stored locally in your browser. No data is sent to external servers.</p>
            <p><span className="font-semibold">Backups:</span> To backup your data, download the browser console (ask your administrator for export feature).</p>
            <p><span className="font-semibold">Security:</span> Passwords are only used for access control. Keep them private and don't share them.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
