import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const LoginPage = ({ onLogin, isDarkMode, onToggleDarkMode, showError, onCloseError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleLogin = () => {
    onLogin(username, password);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex items-center justify-center min-h-screen relative"
    >
      {/* Error Popup */}
      {showError && (
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white py-2 px-6 rounded-lg shadow-lg"
          role="alert"
        >
          Invalid username or password!
          <button
            onClick={onCloseError}
            className="ml-4 text-sm underline hover:text-gray-200"
          >
            Close
          </button>
        </motion.div>
      )}

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <Card
          className={`w-full max-w-md shadow-2xl transform transition-all ${
            isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'
          }`}
        >
          {/* Header */}
          <CardHeader className="p-4 flex justify-between items-center">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CardTitle className="text-2xl font-extrabold">Welcome Back</CardTitle>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleDarkMode}
              className="transition-all duration-300"
            >
              {isDarkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-blue-500" />}
            </motion.button>
          </CardHeader>

          {/* Content */}
          <CardContent className="p-6 space-y-6">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label className="block text-sm font-medium mb-2">Username</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 focus:ring-yellow-500' : 'bg-gray-100 border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter username"
              />
            </motion.div>
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label className="block text-sm font-medium mb-2">Password</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 focus:ring-yellow-500' : 'bg-gray-100 border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter password"
              />
            </motion.div>
          </CardContent>

          {/* Footer */}
          <CardFooter className="p-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white py-2 px-4 rounded-lg shadow-md transform transition-transform duration-300"
              >
                Login
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
