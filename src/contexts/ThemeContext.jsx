import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('focus'); // focus, creative, balance, relax

  const themes = {
    focus: {
      name: 'Tập trung',
      background: 'var(--bg-focus-area)',
      primary: 'var(--primary-blue)',
      primaryHover: 'var(--primary-blue-hover)',
      cardBg: 'var(--bg-white)',
      description: 'Màu xanh dương - tăng tập trung và tin tưởng'
    },
    creative: {
      name: 'Sáng tạo',
      background: 'var(--bg-creative-area)',
      primary: 'var(--creativity-yellow)',
      primaryHover: 'var(--creativity-yellow-hover)',
      cardBg: 'var(--bg-white)',
      description: 'Màu vàng - kích thích sáng tạo và lạc quan'
    },
    balance: {
      name: 'Cân bằng',
      background: 'var(--bg-balance-area)',
      primary: 'var(--balance-green)',
      primaryHover: 'var(--balance-green-hover)',
      cardBg: 'var(--bg-white)',
      description: 'Màu xanh lá - tăng tập trung lâu dài'
    },
    relax: {
      name: 'Thư giãn',
      background: 'var(--bg-relax-area)',
      primary: 'var(--relax-pink)',
      primaryHover: 'var(--relax-pink-hover)',
      cardBg: 'var(--bg-white)',
      description: 'Màu hồng - giúp thư giãn và giảm căng thẳng'
    }
  };

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme: themes[currentTheme],
      changeTheme,
      themes,
      activeThemeName: currentTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};