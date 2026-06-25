import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Blueprint } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const BlueprintPage: React.FC = () => {
  const userRole = useAppStore((state) => state.userRole);
  const blueprint = useAppStore((state) => state.data.blueprint);
  const updateBlueprint = useAppStore((state) => state.updateBlueprint);
  const deleteBlueprint = useAppStore((state) => state.deleteBlueprint);
  const saveDataToLocalStorage = useAppStore((state) => state.saveDataToLocalStorage);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    dimensionalNotes: blueprint?.dimensionalNotes || '',
  });
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target?.result as string;
        const newBlueprint: Blueprint = {
          id: blueprint?.id || uuidv4(),
          fileName: file.name,
          fileSize: file.size,
          fileData: fileData,
          dimensionalNotes: formData.dimensionalNotes,
          uploadedAt: blueprint?.uploadedAt || Date.now(),
          updatedAt: Date.now(),
        };
        updateBlueprint(newBlueprint);
        saveDataToLocalStorage();
        setFileInputKey((prev) => prev + 1);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotesChange = (value: string) => {
    setFormData({ dimensionalNotes: value });
  };

  const handleSaveNotes = () => {
    if (blueprint) {
      updateBlueprint({
        ...blueprint,
        dimensionalNotes: formData.dimensionalNotes,
        updatedAt: Date.now(),
      });
      saveDataToLocalStorage();
      setIsEditing(false);
    }
  };

  const handleDeleteBlueprint = () => {
    if (window.confirm('Are you sure you want to delete this blueprint?')) {
      deleteBlueprint();
      saveDataToLocalStorage();
    }
  };

  const isAdmin = userRole === 'admin';
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Home Blueprint</h1>
        {isAdmin && blueprint && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Edit Notes
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Upload Blueprint File</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select File (PDF, Image, etc.)
              </label>
              <input
                key={fileInputKey}
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg,.gif"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          {blueprint && (
            <div className="mt-4 text-sm text-gray-600">
              Current file: <span className="font-semibold">{blueprint.fileName}</span> ({formatFileSize(blueprint.fileSize)})
            </div>
          )}
        </div>
      )}

      {blueprint ? (
        <div className="space-y-8">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Blueprint File</h2>
            <div className="flex gap-4 items-center justify-between">
              <div>
                <p className="text-gray-600"><span className="font-semibold">File:</span> {blueprint.fileName}</p>
                <p className="text-gray-600"><span className="font-semibold">Size:</span> {formatFileSize(blueprint.fileSize)}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Uploaded: {new Date(blueprint.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              {blueprint.fileData.startsWith('data:image') && (
                <img
                  src={blueprint.fileData}
                  alt="Blueprint preview"
                  className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                />
              )}
            </div>
            {blueprint.fileData && (
              <a
                href={blueprint.fileData}
                download={blueprint.fileName}
                className="inline-block mt-4 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Download
              </a>
            )}
          </div>

          {isEditing && isAdmin ? (
            <div className="bg-white rounded-lg p-8 border border-gray-200 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Dimensional Notes & Measurements
                </label>
                <textarea
                  value={formData.dimensionalNotes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                  rows={6}
                  placeholder="Add any dimensional notes, measurements, or layout specifications..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleSaveNotes}
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
          ) : blueprint.dimensionalNotes ? (
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Dimensional Notes</h2>
                {isAdmin && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition"
                  >
                    Edit
                  </button>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{blueprint.dimensionalNotes}</p>
            </div>
          ) : isAdmin ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-4">No dimensional notes yet.</p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-900 font-semibold hover:underline"
              >
                Add Notes
              </button>
            </div>
          ) : null}

          {isAdmin && (
            <div className="text-right">
              <button
                onClick={handleDeleteBlueprint}
                className="text-red-600 hover:text-red-800 text-sm font-semibold transition"
              >
                Delete Blueprint
              </button>
            </div>
          )}
        </div>
      ) : isAdmin ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No blueprint uploaded yet.</p>
          <p className="text-sm text-gray-500">Upload a file above to get started.</p>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">No blueprint available.</p>
        </div>
      )}
    </div>
  );
};
