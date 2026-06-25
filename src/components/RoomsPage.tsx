import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Room, InspirationItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface RoomsPageProps {
  onNavigate: (page: string) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({ onNavigate }) => {
  const userRole = useAppStore((state) => state.userRole);
  const rooms = useAppStore((state) => state.getRoomsSorted());
  const addRoom = useAppStore((state) => state.addRoom);
  const deleteRoom = useAppStore((state) => state.deleteRoom);
  const updateRoom = useAppStore((state) => state.updateRoom);
  const saveDataToLocalStorage = useAppStore((state) => state.saveDataToLocalStorage);

  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const handleAddRoom = () => {
    if (newRoomName.trim()) {
      const newRoom: Room = {
        id: uuidv4(),
        name: newRoomName,
        sortOrder: rooms.length,
        mustHaves: '',
        niceToHaves: '',
        thingsToAvoid: '',
        inspirationItems: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      addRoom(newRoom);
      saveDataToLocalStorage();
      setNewRoomName('');
      setIsAddingRoom(false);
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      deleteRoom(roomId);
      saveDataToLocalStorage();
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Rooms</h1>
        {isAdmin && (
          <button
            onClick={() => setIsAddingRoom(!isAddingRoom)}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {isAddingRoom ? 'Cancel' : '+ Add Room'}
          </button>
        )}
      </div>

      {isAddingRoom && isAdmin && (
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8 space-y-4">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Room name (e.g., Living Room, Master Bedroom)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
            onKeyPress={(e) => e.key === 'Enter' && handleAddRoom()}
          />
          <div className="flex gap-4">
            <button
              onClick={handleAddRoom}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Create Room
            </button>
            <button
              onClick={() => setIsAddingRoom(false)}
              className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {rooms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">
            {isAdmin ? 'No rooms yet. Add one to get started!' : 'No rooms available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition"
            >
              {room.moodBoardData && (
                <img
                  src={room.moodBoardData}
                  alt={room.name}
                  className="w-full h-40 object-cover group-hover:opacity-90 transition"
                />
              )}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="text-gray-400 hover:text-red-600 transition"
                      title="Delete room"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  {room.mustHaves && (
                    <p>
                      <span className="font-semibold">Must-Haves:</span> {room.mustHaves.substring(0, 50)}...
                    </p>
                  )}
                  {room.niceToHaves && (
                    <p>
                      <span className="font-semibold">Nice-to-Haves:</span> {room.niceToHaves.substring(0, 50)}...
                    </p>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  {room.inspirationItems.length} inspiration item{room.inspirationItems.length !== 1 ? 's' : ''}
                </div>

                <button
                  onClick={() => onNavigate(`room-${room.id}`)}
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-semibold"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
