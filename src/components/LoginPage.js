import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Sun, User, Key, Lock, Mail, ChevronRight } from 'lucide-react';

// Add Iran Sans font
const fontStyles = `
  @font-face {
    font-family: 'IRANSans';
    src: url('https://github.com/9231058/BozorgOn/blob/master/fonts/IRANSans-web.woff') format('woff'),
         url('https://github.com/9231058/BozorgOn/blob/master/fonts/IRANSans-web.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'IRANSans';
    src: url('https://github.com/9231058/BozorgOn/blob/master/fonts/IRANSans-Bold-web.woff') format('woff'),
         url('https://github.com/9231058/BozorgOn/blob/master/fonts/IRANSans-Bold-web.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }
  
  * {
    font-family: 'IRANSans', 'Tahoma', sans-serif;
  }
  
  /* RTL support */
  .rtl-text {
    direction: rtl;
    text-align: right;
  }
  
  /* Smooth transitions for all theme changes */
  * {
    transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease;
  }
  
  /* Glassmorphism effect */
  .glass {
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  
  /* Modern scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const LoginPage = ({ onLogin, isDarkMode, onToggleDarkMode, showError, onCloseError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);
  
  // Colors based on mode
  const colors = {
    dark: {
      primary: '#7C3AED', // vivid purple
      secondary: '#3B82F6', // bright blue
      accent: '#0EA5E9', // sky blue
      cardBg: 'rgba(17, 24, 39, 0.85)',
      inputBg: 'rgba(31, 41, 55, 0.8)',
      text: '#F9FAFB',
      placeholder: '#9CA3AF',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      backgroundAnimated: 'linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #1E293B 100%)',
      errorBg: 'rgba(220, 38, 38, 0.9)',
      shadowColor: 'rgba(0, 0, 0, 0.5)'
    },
    light: {
      primary: '#4F46E5', // indigo
      secondary: '#8B5CF6', // purple
      accent: '#EC4899', // pink
      cardBg: 'rgba(255, 255, 255, 0.85)',
      inputBg: 'rgba(249, 250, 251, 0.8)',
      text: '#111827',
      placeholder: '#6B7280',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)',
      backgroundAnimated: 'linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 50%, #F5F3FF 100%)',
      errorBg: 'rgba(239, 68, 68, 0.9)',
      shadowColor: 'rgba(0, 0, 0, 0.1)'
    }
  };

  const currentTheme = isDarkMode ? colors.dark : colors.light;
  
  // Background animation effect on theme toggle
  useEffect(() => {
    setAnimateBackground(true);
    const timer = setTimeout(() => setAnimateBackground(false), 2000);
    return () => clearTimeout(timer);
  }, [isDarkMode]);
  
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

  // Enhanced animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };
  
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.03,
      boxShadow: `0 10px 25px -5px ${currentTheme.shadowColor}`,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.97 }
  };
  
  const backgroundVariants = {
    static: { 
      backgroundImage: currentTheme.background,
      backgroundSize: "200% 200%",
      backgroundPosition: "0% 0%"
    },
    animate: { 
      backgroundImage: currentTheme.backgroundAnimated,
      backgroundSize: "200% 200%",
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: { 
        duration: 3,
        ease: "easeInOut",
        repeat: 0
      }
    }
  };

  return (
    <>
      <style>{fontStyles}</style>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex items-center justify-center min-h-screen relative p-4 overflow-hidden"
        style={{
          color: currentTheme.text
        }}
      >
        {/* Animated background */}
        <motion.div 
          className="absolute inset-0 -z-10"
          variants={backgroundVariants}
          animate={animateBackground ? "animate" : "static"}
        />
        
        {/* Animated decorative elements */}
        <div className="absolute inset-0 -z-5 overflow-hidden opacity-20">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() *.20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-6 left-1/2 transform -translate-x-1/2 py-3 px-6 rounded-lg shadow-lg z-50 rtl-text glass"
              style={{ backgroundColor: currentTheme.errorBg, color: '#FFFFFF' }}
              role="alert"
            >
              <div className="flex items-center space-x-2">
                <span>نام کاربری یا رمز عبور نامعتبر است!</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onCloseError}
                  className="mr-4 text-sm hover:text-gray-200 underline"
                >
                  بستن
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={itemVariants}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl rounded-3xl overflow-hidden glass"
            style={{ 
              backgroundColor: currentTheme.cardBg,
              borderColor: 'transparent',
              boxShadow: `0 25px 50px -12px ${currentTheme.shadowColor}`,
            }}
          >
            {/* Decorative top border */}
            <div className="h-1.5 w-full bg-gradient-to-r" 
              style={{ 
                backgroundImage: `linear-gradient(to left, ${currentTheme.primary}, ${currentTheme.secondary}, ${currentTheme.accent})` 
              }}
            />
            
            <CardHeader className="space-y-1 p-8">
              <div className="flex justify-between items-center">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rtl-text"
                >
                  <CardTitle className="text-4xl font-bold" style={{ 
                    fontFamily: 'IRANSans, Tahoma, sans-serif',
                    background: `linear-gradient(to left, ${currentTheme.primary}, ${currentTheme.secondary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    خوش آمدید
                  </CardTitle>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 20 }}
                  whileTap={{ scale: 0.9, rotate: -20 }}
                  onClick={onToggleDarkMode}
                  className="p-3 rounded-full"
                  style={{ 
                    background: `linear-gradient(135deg, ${currentTheme.secondary}22, ${currentTheme.primary}22)` 
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isDarkMode ? (
                      <motion.div
                        key="sun"
                        initial={{ opacity: 0, rotate: -30 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 30 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Sun className="w-6 h-6 text-yellow-400" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ opacity: 0, rotate: 30 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -30 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Moon className="w-6 h-6" style={{ color: currentTheme.primary }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
              
              <motion.p
                variants={itemVariants}
                className="text-sm mt-2 rtl-text opacity-70"
              >
                لطفا اطلاعات خود را وارد کنید
              </motion.p>
            </CardHeader>

            <CardContent className="p-8 pt-0 space-y-6">
              <motion.div variants={itemVariants} className="space-y-5">
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                    className="relative"
                  >
                    <motion.input
                      whileFocus={{ 
                        boxShadow: `0 0 0 2px ${currentTheme.primary}33, 0 0 0 4px ${currentTheme.primary}22` 
                      }}
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full pr-12 pl-4 py-4 rounded-xl focus:outline-none rtl-text"
                      placeholder="نام کاربری را وارد کنید"
                      style={{ 
                        backgroundColor: currentTheme.inputBg,
                        color: currentTheme.text,
                        fontFamily: 'IRANSans, Tahoma, sans-serif',
                        border: '1px solid',
                        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)',
                      }}
                    />
                    <div className="absolute right-3 top-0 h-full flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          y: [0, -3, 0], 
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{ 
                          color: username ? currentTheme.primary : currentTheme.placeholder
                        }}
                      >
                        <User className="h-5 w-5" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                    className="relative"
                  >
                    <motion.input
                      whileFocus={{ 
                        boxShadow: `0 0 0 2px ${currentTheme.primary}33, 0 0 0 4px ${currentTheme.primary}22` 
                      }}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full pr-12 pl-4 py-4 rounded-xl focus:outline-none rtl-text"
                      placeholder="رمز عبور را وارد کنید"
                      style={{ 
                        backgroundColor: currentTheme.inputBg,
                        color: currentTheme.text,
                        fontFamily: 'IRANSans, Tahoma, sans-serif',
                        border: '1px solid',
                        borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)',
                      }}
                    />
                    <div className="absolute right-3 top-0 h-full flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          y: [0, -3, 0], 
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.3
                        }}
                        style={{ 
                          color: password ? currentTheme.primary : currentTheme.placeholder
                        }}
                      >
                        <Lock className="h-5 w-5" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="flex justify-between items-center rtl-text text-sm"
              >
                <motion.div 
                  className="flex items-center space-x-2"
                  style={{ 
                    color: currentTheme.text + 'cc'
                  }}
                >
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="w-4 h-4 rounded-sm ml-2"
                    style={{
                      accentColor: currentTheme.primary
                    }}
                  />
                  <label htmlFor="remember">مرا به خاطر بسپار</label>
                </motion.div>
                
                <motion.a 
                  href="#" 
                  whileHover={{ 
                    scale: 1.05, 
                    color: currentTheme.primary 
                  }}
                  style={{ 
                    color: currentTheme.secondary
                  }}
                >
                  رمز عبور را فراموش کرده‌اید؟
                </motion.a>
              </motion.div>
            </CardContent>

            <CardFooter className="p-8 pt-0">
              <motion.div
                className="w-full"
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full h-14 relative overflow-hidden rounded-xl rtl-text"
                  style={{ 
                    background: `linear-gradient(to left, ${currentTheme.primary}, ${currentTheme.secondary})`,
                    fontFamily: 'IRANSans, Tahoma, sans-serif'
                  }}
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
                        <motion.div 
                          className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ 
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                          }}
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
                        <motion.span
                          className="text-lg font-bold"
                        >
                          ورود
                        </motion.span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut" 
                          }}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </CardFooter>
            
            <motion.div 
              variants={itemVariants}
              className="flex justify-center items-center pb-8 rtl-text"
            >
              <p className="text-sm opacity-70">
                حساب کاربری ندارید؟ 
                <motion.a 
                  href="#" 
                  whileHover={{ scale: 1.05 }}
                  className="mr-2 font-bold"
                  style={{ color: currentTheme.primary }}
                >
                  ثبت نام کنید
                </motion.a>
              </p>
            </motion.div>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
};

export default LoginPage;