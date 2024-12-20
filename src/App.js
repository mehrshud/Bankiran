import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import BankCardAnalyzer from './components/BankCardAnalyzer';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showError, setShowError] = useState(false);

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
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'
      }`}
    >
      {!isLoggedIn ? (
        <LoginPage
          onLogin={handleLogin}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          showError={showError}
          onCloseError={() => setShowError(false)}
        />
      ) : (
        <BankCardAnalyzer
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          username={username}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
