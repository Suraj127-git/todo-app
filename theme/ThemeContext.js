// theme/ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  
  const toggleTheme = () => setIsDark(!isDark);
  
  const theme = {
    isDark,
    toggleTheme,
    colors: {
      light: {
        background: '#f7f8fa',
        text: '#212529',
        inputBg: 'white',
        icon: '#4a90e2',
        delete: '#ff6b6b',
        placeholder: '#6c757d',
        headerBg: '#ffffff',
        cardBg: '#ffffff',
      },
      dark: {
        background: '#1a1a1a',
        text: '#e9ecef',
        inputBg: '#2d2d2d',
        icon: '#5699ff',
        delete: '#ff5252',
        placeholder: '#868e96',
        headerBg: '#121212',
        cardBg: '#2d2d2d',
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};