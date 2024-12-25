import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import BankCardAnalyzer from './components/BankCardAnalyzer';
import ProfileManager from './components/ProfileManager';

const App = () => {
  // Initialize dark mode to true by default
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null ? JSON.parse(savedMode) : true;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    return savedLogin !== null ? JSON.parse(savedLogin) : false;
  });
  
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [showError, setShowError] = useState(false);

  // Apply dark mode to document root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Persist login state
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
    }
  }, [isLoggedIn, username]);

  const handleLogin = (user, pass) => {
    if (user === 'admin' && pass === 'admin') {
      setIsLoggedIn(true);
      setUsername(user);
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      {!isLoggedIn ? (
        <LoginPage
          onLogin={handleLogin}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          showError={showError}
          onCloseError={() => setShowError(false)}
        />
      ) : (
        <div className="relative">
          <div className="absolute top-4 right-4 z-50">
            <ProfileManager
              username={username}
              onLogout={handleLogout}
              isDarkMode={isDarkMode}
            />
          </div>
          <BankCardAnalyzer
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            username={username}
          />
        </div>
      )}
    </div>
  );
};

export default App;