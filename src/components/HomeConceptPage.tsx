import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { HomeConcept } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const HomeConceptPage: React.FC = () => {
  const userRole = useAppStore((state) => state.userRole);
  const homeConcept = useAppStore((state) => state.data.homeConcept);
  const updateHomeConcept = useAppStore((state) => state.updateHomeConcept);
  const saveDataToLocalStorage = useAppStore((state) => state.saveDataToLocalStorage);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<HomeConcept>(
    homeConcept || {
      id: uuidv4(),
      designVision: '',
      moodPalette: '',
      overallReferences: '',
      updatedAt: Date.now(),
    }
  );

  const handleChange = (field: keyof HomeConcept, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    updateHomeConcept(formData);
    saveDataToLocalStorage();
    setIsEditing(false);
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Home Design Concept</h1>
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
              Design Vision
            </label>
            <textarea
              value={formData.designVision}
              onChange={(e) => handleChange('designVision', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              rows={5}
              placeholder="Describe your overall design vision for the home..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Mood & Color Palette
            </label>
            <textarea
              value={formData.moodPalette}
              onChange={(e) => handleChange('moodPalette', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              rows={4}
              placeholder="Describe the mood, colors, textures, and overall aesthetic..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Overall References & Inspiration
            </label>
            <textarea
              value={formData.overallReferences}
              onChange={(e) => handleChange('overallReferences', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              rows={4}
              placeholder="Links, designer names, or overall inspirations..."
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
          {homeConcept ? (
            <>
              <section className="bg-white rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Design Vision</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{homeConcept.designVision}</p>
              </section>

              <section className="bg-white rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Mood & Color Palette</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{homeConcept.moodPalette}</p>
              </section>

              <section className="bg-white rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall References & Inspiration</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{homeConcept.overallReferences}</p>
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
