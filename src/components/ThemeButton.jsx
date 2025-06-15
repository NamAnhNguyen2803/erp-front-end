import React from 'react';
import { Button } from 'antd';
import { useTheme } from '../contexts/ThemeContext';

const ThemeButton = ({ 
  type = 'primary', 
  children, 
  buttonType = 'default', // 'default', 'creative', 'balance', 'danger'
  ...props 
}) => {
  const { currentTheme } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      height: '40px',
      borderRadius: '6px',
      fontWeight: 500,
      fontSize: '14px',
      transition: 'all 0.3s ease'
    };

    switch (buttonType) {
      case 'creative':
        return {
          ...baseStyle,
          backgroundColor: 'var(--creativity-yellow)',
          borderColor: 'var(--creativity-yellow)',
          color: 'var(--text-primary)'
        };
      case 'balance':
        return {
          ...baseStyle,
          backgroundColor: 'var(--balance-green)',
          borderColor: 'var(--balance-green)',
          color: 'var(--text-on-color)'
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: 'var(--error)',
          borderColor: 'var(--error)',
          color: 'var(--text-on-color)'
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: type === 'primary' ? currentTheme.primary : 'transparent',
          borderColor: currentTheme.primary,
          color: type === 'primary' ? 'var(--text-on-color)' : currentTheme.primary
        };
    }
  };

  return (
    <Button
      type={type}
      style={getButtonStyle()}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ThemeButton;