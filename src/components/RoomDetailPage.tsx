import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Room, InspirationItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface RoomDetailPageProps {
  roomId: string;
  onNavigate: (page: string) => void;
}

export const RoomDetailPage: React.FC<RoomDetailPageProps> = ({ roomId, onNavigate }) => {
  const userRole = useAppStore((state) => state.userRole);
  const room = useAppStore((state) => state.getRoomById(roomId));
  const updateRoom = useAppStore((state) => state.updateRoom);
  const addInspirationItem = useAppStore((state) => state.addInspirationItem);
  const deleteInspirationItem = useAppStore((state) => state.deleteInspirationItem);
  const saveDataToLocalStorage = useAppStore((state) => state.saveDataToLocalStorage);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    mustHaves: room?.mustHaves || '',
    niceToHaves: room?.niceToHaves || '',
    thingsToAvoid: room?.thingsToAvoid || '',
  });
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemType, setNewItemType] = useState<'photo' | 'link'>('photo');
  const [newItemAnnotation, setNewItemAnnotation] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');

  if (!room) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Room not found</p>
      </div>
    );
  }

  const handleSaveRoomInfo = () => {
    updateRoom(roomId, {
      mustHaves: editData.mustHaves,
      niceToHaves: editData.niceToHaves,
      thingsToAvoid: editData.thingsToAvoid,
    });
    saveDataToLocalStorage();
    setIsEditing(false);
  };

  const handleAddInspirationItem = (event?: React.ChangeEvent<HTMLInputElement>) => {
    if (newItemType === 'photo' && event?.target.files?.[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target?.result as string;
        const newItem: InspirationItem = {
          id: uuidv4(),
          roomId,
          type: 'photo',
          photoFileName: file.name,
          photoData,
          annotation: newItemAnnotation,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        addInspirationItem(roomId, newItem);
        saveDataToLocalStorage();
        setNewItemAnnotation('');
        setIsAddingItem(false);
      };
      reader.readAsDataURL(file);
    } else if (newItemType === 'link' && newItemUrl.trim()) {
      const newItem: InspirationItem = {
        id: uuidv4(),
        roomId,
        type: 'link',
        externalUrl: newItemUrl,
        annotation: newItemAnnotation,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      addInspirationItem(roomId, newItem);
      saveDataToLocalStorage();
      setNewItemAnnotation('');
      setNewItemUrl('');
      setIsAddingItem(false);
    }
  };

  const handleDeleteInspirationItem = (itemId: string) => {
    if (window.confirm('Delete this inspiration item?')) {
      deleteInspirationItem(roomId, itemId);
      saveDataToLocalStorage();
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => onNavigate('rooms')}
        className="text-gray-600 hover:text-gray-900 mb-6 text-sm font-semibold"
      >
        ← Back to Rooms
      </button>

      <h1 className="text-4xl font-bold text-gray-900 mb-8">{room.name}</h1>

      {/* Room Information Section */}
      <div className="bg-white rounded-lg p-8 border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Room Information</h2>
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
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Must-Haves
              </label>
              <textarea
                value={editData.mustHaves}
                onChange={(e) => setEditData({ ...editData, mustHaves: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                rows={4}
                placeholder="What must this room have?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nice-to-Haves
              </label>
              <textarea
                value={editData.niceToHaves}
                onChange={(e) => setEditData({ ...editData, niceToHaves: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                rows={4}
                placeholder="What would be nice to have?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Things to Avoid
              </label>
              <textarea
                value={editData.thingsToAvoid}
                onChange={(e) => setEditData({ ...editData, thingsToAvoid: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                rows={4}
                placeholder="What should we avoid?"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSaveRoomInfo}
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
          <div className="space-y-6">
            {room.mustHaves && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Must-Haves</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{room.mustHaves}</p>
              </div>
            )}
            {room.niceToHaves && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Nice-to-Haves</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{room.niceToHaves}</p>
              </div>
            )}
            {room.thingsToAvoid && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Things to Avoid</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{room.thingsToAvoid}</p>
              </div>
            )}
            {!room.mustHaves && !room.niceToHaves && !room.thingsToAvoid && isAdmin && (
              <p className="text-gray-600">No information added yet. Click Edit to get started.</p>
            )}
          </div>
        )}
      </div>

      {/* Inspiration Items Section */}
      <div className="bg-white rounded-lg p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Inspiration Gallery</h2>
          {isAdmin && (
            <button
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              {isAddingItem ? 'Cancel' : '+ Add Item'}
            </button>
          )}
        </div>

        {isAddingItem && isAdmin && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Type</label>
              <select
                value={newItemType}
                onChange={(e) => setNewItemType(e.target.value as 'photo' | 'link')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              >
                <option value="photo">Photo</option>
                <option value="link">Link</option>
              </select>
            </div>

            {newItemType === 'photo' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Upload Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddInspirationItem}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">URL</label>
                <input
                  type="url"
                  value={newItemUrl}
                  onChange={(e) => setNewItemUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Annotation (Optional)</label>
              <input
                type="text"
                value={newItemAnnotation}
                onChange={(e) => setNewItemAnnotation(e.target.value)}
                placeholder="Why do you like this? What caught your eye?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleAddInspirationItem()}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Add Item
              </button>
              <button
                onClick={() => setIsAddingItem(false)}
                className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {room.inspirationItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">
              {isAdmin ? 'No inspiration items yet. Add some to get started!' : 'No inspiration items yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {room.inspirationItems.map((item) => (
              <div key={item.id} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition bg-white">
                {item.type === 'photo' && item.photoData && (
                  <img
                    src={item.photoData}
                    alt="Inspiration"
                    className="w-full h-48 object-cover group-hover:opacity-90 transition"
                  />
                )}
                {item.type === 'link' && (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-48 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                  >
                    <span className="text-gray-600 text-center px-4 break-all text-sm">{item.externalUrl}</span>
                  </a>
                )}
                <div className="p-4 space-y-3">
                  {item.annotation && (
                    <p className="text-sm text-gray-700">{item.annotation}</p>
                  )}
                  {item.type === 'link' && item.externalUrl && (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-gray-700 break-all inline-block"
                    >
                      Visit →
                    </a>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteInspirationItem(item.id)}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
