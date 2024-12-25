import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Sun, User, Key } from 'lucide-react';

const LoginPage = ({ onLogin, isDarkMode, onToggleDarkMode, showError, onCloseError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    onLogin(username, password);
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex items-center justify-center min-h-screen relative p-4"
    >
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-3 px-6 rounded-lg shadow-lg z-50"
            role="alert"
          >
            <div className="flex items-center space-x-2">
              <span>Invalid username or password!</span>
              <button
                onClick={onCloseError}
                className="ml-4 text-sm hover:text-gray-200 underline"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={itemVariants}
        className="w-full max-w-md"
      >
        <Card className={`backdrop-blur-md shadow-2xl ${
          isDarkMode 
            ? 'bg-gray-800/90 border-gray-700 text-white' 
            : 'bg-white/90 border-gray-200'
        }`}>
          <CardHeader className="space-y-1 p-6">
            <div className="flex justify-between items-center">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleDarkMode}
                className="p-2 rounded-full transition-colors duration-200"
              >
                {isDarkMode ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-blue-500" />
                )}
              </motion.button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="relative">
                <User className={`absolute left-3 top-3 h-5 w-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 focus:ring-purple-500 text-white' 
                      : 'bg-gray-50 border-gray-200 focus:ring-blue-500'
                  }`}
                  placeholder="Enter username"
                />
              </div>

              <div className="relative">
                <Key className={`absolute left-3 top-3 h-5 w-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 focus:ring-purple-500 text-white' 
                      : 'bg-gray-50 border-gray-200 focus:ring-blue-500'
                  }`}
                  placeholder="Enter password"
                />
              </div>
            </motion.div>
          </CardContent>

          <CardFooter className="p-6">
            <motion.div
              className="w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className={`w-full h-11 relative overflow-hidden ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                } hover:opacity-90 transition-all duration-200`}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Login
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;