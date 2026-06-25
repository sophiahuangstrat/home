import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { AboutUs } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const AboutUsPage: React.FC = () => {
  const userRole = useAppStore((state) => state.userRole);
  const aboutUs = useAppStore((state) => state.data.aboutUs);
  const updateAboutUs = useAppStore((state) => state.updateAboutUs);
  const saveDataToLocalStorage = useAppStore((state) => state.saveDataToLocalStorage);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AboutUs>(
    aboutUs || {
      id: uuidv4(),
      coupleIntroduction: '',
      livingRoutines: '',
      lifestyleHabits: '',
      idealHomeVibe: '',
      updatedAt: Date.now(),
    }
  );

  const handleChange = (field: keyof AboutUs, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    updateAboutUs(formData);
    saveDataToLocalStorage();
    setIsEditing(false);
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
        {isAdmin && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing && isAdmin ? (
        <div className="space-y-6 bg-white rounded-lg p-8 border border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Couple Introduction
            </label>
            <textarea
              value={formData.coupleIntroduction}
              onChange={(e) => handleChange('coupleIntroduction', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              rows={4}
              placeholder="Tell us about yourselves..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Living Routines
            </label>
            <textarea
              value={formData.livingRoutines}
              onChange={(e) => handleChange('livingRoutines', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              rows={4}
              placeholder="Describe your daily living routines..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Lifestyle Habits
            </label>
            <textarea
              value={formData.lifestyleHabits}
              onChange={(e) => handleChange('lifestyleHabits', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              rows={4}
              placeholder="Share your lifestyle habits and preferences..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Ideal Home Vibe
            </label>
            <textarea
              value={formData.idealHomeVibe}
              onChange={(e) => handleChange('idealHomeVibe', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              rows={4}
              placeholder="Describe the vibe you want for your home..."
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {aboutUs ? (
            <>
              <section className="bg-white rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Couple Introduction</h2>
                <p className="text-gray-700 leading-relaxed">{aboutUs.coupleIntroduction}</p>
              </section>

              <section className="bg-white rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Living Routines</h2>
                <p className="text-gray-700 leading-relaxed">{aboutUs.livingRoutines}</p>
              </section>

              <section className="bg-white rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Lifestyle Habits</h2>
                <p className="text-gray-700 leading-relaxed">{aboutUs.lifestyleHabits}</p>
              </section>

              <section className="bg-white rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ideal Home Vibe</h2>
                <p className="text-gray-700 leading-relaxed">{aboutUs.idealHomeVibe}</p>
              </section>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600">
                {isAdmin ? 'No content yet. Click Edit to get started.' : 'No content available.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
