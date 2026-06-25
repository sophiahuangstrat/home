import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/appStore';
import { LockScreen } from './components/LockScreen';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { AboutUsPage } from './components/AboutUsPage';

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
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'about':
        return <AboutUsPage />;
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
