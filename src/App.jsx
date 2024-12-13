// src/App.jsx
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import BankCardAnalyzer from './components/BankCardAnalyzer';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return <BankCardAnalyzer />;
};

export default App;