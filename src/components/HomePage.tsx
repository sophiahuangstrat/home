import React from 'react';
import { useAppStore } from '../store/appStore';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const aboutUs = useAppStore((state) => state.data.aboutUs);
  const homeConcept = useAppStore((state) => state.data.homeConcept);
  const rooms = useAppStore((state) => state.getRoomsSorted());
  const userRole = useAppStore((state) => state.userRole);

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 py-8">
        <h1 className="text-5xl font-bold text-gray-900">Welcome to Our Home</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore our home design brief and help us bring our vision to life
        </p>
      </section>

      {aboutUs && (
        <section className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
          <p className="text-gray-700 line-clamp-3">{aboutUs.coupleIntroduction}</p>
          <button
            onClick={() => onNavigate('about')}
            className="inline-block mt-4 text-gray-900 font-semibold hover:underline"
          >
            Read More →
          </button>
        </section>
      )}

      {homeConcept && (
        <section className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Design Vision</h2>
          <p className="text-gray-700 line-clamp-3">{homeConcept.designVision}</p>
          <button
            onClick={() => onNavigate('concept')}
            className="inline-block mt-4 text-gray-900 font-semibold hover:underline"
          >
            View Full Concept →
          </button>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Rooms</h2>
        {rooms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">
              {userRole === 'admin' ? 'No rooms yet. Add one to get started!' : 'No rooms available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onNavigate(`room-${room.id}`)}
                className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition border border-gray-200 text-left"
              >
                {room.moodBoardData && (
                  <img
                    src={room.moodBoardData}
                    alt={room.name}
                    className="w-full h-40 object-cover group-hover:opacity-90 transition"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {room.inspirationItems.length} inspiration items
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
