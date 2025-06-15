import React from 'react';
import { Layout } from 'antd';
import AppHeader from '../components/Header';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const { Content } = Layout;

const AppLayout = ({ children }) => {
  const { currentTheme } = useTheme();

  return (
    <Layout style={{
      minHeight: '100vh',
      margin: '0',
      padding: '0',
      backgroundColor: currentTheme.background
    }}>
      <AppHeader />
      <Layout style={{ backgroundColor: currentTheme.background }}>
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          background: currentTheme.cardBg,
          minHeight: 280,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;