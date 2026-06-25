import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/appStore';
import { LockScreen } from './components/LockScreen';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { AboutUsPage } from './components/AboutUsPage';
import { HomeConceptPage } from './components/HomeConceptPage';
import { BlueprintPage } from './components/BlueprintPage';
import { RoomsPage } from './components/RoomsPage';
import { RoomDetailPage } from './components/RoomDetailPage';
import { SettingsPage } from './components/SettingsPage';

function App() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const loadDataFromLocalStorage = useAppStore((state) => state.loadDataFromLocalStorage);
  const saveDataToLocalStorage = useAppStore((state) => state.saveDataToLocalStorage);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    loadDataFromLocalStorage();
  }, [loadDataFromLocalStorage]);

  useEffect(() => {
    saveDataToLocalStorage();
  }, [saveDataToLocalStorage]);

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (!isAuthenticated) {
    return (
      <LockScreen
        onAuthenticated={() => {
          setCurrentPage('home');
        }}
      />
    );
  }

  const renderPage = () => {
    // Check if it's a room detail page
    if (currentPage.startsWith('room-')) {
      const roomId = currentPage.replace('room-', '');
      return <RoomDetailPage roomId={roomId} onNavigate={handleNavigation} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'about':
        return <AboutUsPage />;
      case 'concept':
        return <HomeConceptPage />;
      case 'blueprint':
        return <BlueprintPage />;
      case 'rooms':
        return <RoomsPage onNavigate={handleNavigation} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <Layout onNavigate={handleNavigation}>
      {renderPage()}
    </Layout>
  );
}

export default App;
