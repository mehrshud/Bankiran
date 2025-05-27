import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Sun, User, Lock } from 'lucide-react';

const fontStyles = `
  @font-face {
    font-family: 'IRANSans';
    src: url('https://raw.githubusercontent.com/9231058/BozorgOn/master/fonts/IRANSans-web.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'IRANSans';
    src: url('https://raw.githubusercontent.com/9231058/BozorgOn/master/fonts/IRANSans-Bold-web.woff2') format('woff2'),
         url('https://raw.githubusercontent.com/9231058/BozorgOn/master/fonts/IRANSans-Bold-web.woff') format('woff');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  .persian-font {
    font-family: 'IRANSans', 'Tahoma', sans-serif;
  }

  .rtl-text {
    direction: rtl;
    text-align: right;
  }

  .glass {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const LoginPage = ({ onLogin, isDarkMode, onToggleDarkMode, showError, onCloseError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const colors = {
    dark: {
      primary: '#7C3AED',
      secondary: '#3B82F6',
      accent: '#0EA5E9',
      cardBg: 'rgba(17, 24, 39, 0.9)',
      inputBg: 'rgba(31, 41, 55, 0.85)',
      text: '#F9FAFB',
      placeholder: '#9CA3AF',
      background: 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)',
      errorBg: 'rgba(220, 38, 38, 0.95)',
      shadowColor: 'rgba(0, 0, 0, 0.6)',
    },
    light: {
      primary: '#4F46E5',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      cardBg: 'rgba(255, 255, 255, 0.9)',
      inputBg: 'rgba(249, 250, 251, 0.9)',
      text: '#111827',
      placeholder: '#6B7280',
      background: 'radial-gradient(circle at center, #F5F3FF 0%, #EFF6FF 100%)',
      errorBg: 'rgba(239, 68, 68, 0.95)',
      shadowColor: 'rgba(0, 0, 0, 0.15)',
    },
  };

  const currentTheme = isDarkMode ? colors.dark : colors.light;

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') handleLogin();
  };

  const handleLogin = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onLogin(username, password);
    setIsLoading(false);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, boxShadow: `0 12px 30px -5px ${currentTheme.primary}80`, transition: { type: 'spring', stiffness: 300 } },
    tap: { scale: 0.98 },
  };

  const rippleVariants = {
    start: { scale: 0, opacity: 0.5 },
    end: { scale: 2, opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <>
      <style>{fontStyles}</style>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex items-center justify-center min-h-screen relative overflow-hidden"
        style={{ background: currentTheme.background, color: currentTheme.text }}
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0 -z-10">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.sin(i) * 50],
                y: [0, Math.cos(i) * 50],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="absolute top-8 left-1/2 transform -translate-x-1/2 py-3 px-6 rounded-full shadow-lg z-50 rtl-text glass persian-font"
              style={{ backgroundColor: currentTheme.errorBg, color: '#FFFFFF' }}
            >
              <div className="flex items-center gap-2">
                <span>خطا در ورود!</span>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onCloseError}>
                  <span className="text-sm">×</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Card */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-sm relative"
          whileHover={{ scale: 1.02, boxShadow: `0 20px 40px -10px ${currentTheme.shadowColor}` }}
        >
          <Card className="glass rounded-2xl overflow-hidden relative">
            {/* Animated Border */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ border: `2px solid ${currentTheme.primary}` }}
              animate={{ borderColor: [currentTheme.primary, currentTheme.secondary, currentTheme.accent, currentTheme.primary] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />

            <CardHeader className="p-6 relative">
              <motion.div className="flex justify-between items-center">
                <CardTitle
                  className="text-3xl font-bold persian-font rtl-text"
                  style={{ color: currentTheme.text }}
                >
                  ورود
                </CardTitle>
                <motion.button
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onToggleDarkMode}
                  className="p-2 rounded-full"
                  style={{ background: `radial-gradient(circle, ${currentTheme.primary}33, transparent)` }}
                >
                  <AnimatePresence mode="wait">
                    {isDarkMode ? (
                      <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                        <Sun className="w-6 h-6 text-yellow-300" />
                      </motion.div>
                    ) : (
                      <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                        <Moon className="w-6 h-6" style={{ color: currentTheme.accent }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <motion.div variants={itemVariants} className="space-y-5">
                {/* Username Input */}
                <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                  <motion.input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pr-12 pl-4 py-3 rounded-full focus:outline-none rtl-text persian-font shadow-md"
                    placeholder="نام کاربری"
                    style={{
                      backgroundColor: currentTheme.inputBg,
                      color: currentTheme.text,
                      border: 'none',
                    }}
                    whileFocus={{ boxShadow: `0 0 10px ${currentTheme.primary}80` }}
                  />
                  <motion.div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    animate={username ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <User className="h-5 w-5" style={{ color: username ? currentTheme.primary : currentTheme.placeholder }} />
                  </motion.div>
                </motion.div>

                {/* Password Input */}
                <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                  <motion.input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pr-12 pl-4 py-3 rounded-full focus:outline-none rtl-text persian-font shadow-md"
                    placeholder="رمز عبور"
                    style={{
                      backgroundColor: currentTheme.inputBg,
                      color: currentTheme.text,
                      border: 'none',
                    }}
                    whileFocus={{ boxShadow: `0 0 10px ${currentTheme.primary}80` }}
                  />
                  <motion.div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    animate={password ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  >
                    <Lock className="h-5 w-5" style={{ color: password ? currentTheme.primary : currentTheme.placeholder }} />
                  </motion.div>
                </motion.div>
              </motion.div>
            </CardContent>

            <CardFooter className="p-6 flex flex-col items-center gap-4">
              <motion.div
                className="w-full relative"
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full h-12 rounded-full persian-font rtl-text relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center"
                      >
                        <motion.div
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <span className="text-lg font-bold">ورود</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Ripple Effect */}
                  <motion.div
                    className="absolute inset-0 bg-white rounded-full"
                    variants={rippleVariants}
                    initial="start"
                    animate={isLoading ? 'end' : 'start'}
                    whileHover="end"
                  />
                </Button>
              </motion.div>

              {/* Copyright */}
              <motion.div
                className="text-xs opacity-70 persian-font rtl-text flex flex-col items-center gap-1"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span>Mehrshad ©</span>
                <span>All Rights Reserved: Capt. Esmaeili</span>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
};

export default LoginPage;