import React from 'react';
import { Layout } from 'antd';
import AppHeader from '../components/Header';
import AppSidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
const { Content } = Layout;

const AppLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh', margin: '0 ' ,padding: '0'}}>
      <AppHeader />
      <Layout>
        <Content style={{ margin: '24px 16px', padding: 0, background: 'white', minHeight: 280 , border:'4px'}}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 