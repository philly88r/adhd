import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppRouter } from './components/AppRouter';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';
import { AuthScreen } from './components/Auth/AuthScreen';
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is already authenticated on component mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          {isAuthenticated ? (
            <>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
                <AppRouter />
                <Toaster />
              </div>
            </>
          ) : (
            <>
              <AuthScreen onAuthenticated={handleAuthenticated} />
              <Toaster />
            </>
          )}
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
