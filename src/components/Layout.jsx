import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import MenuComponent from './MenuComponent';
import { Layout } from 'antd';
import { useAuth } from './AuthContext';

const { Content } = Layout;

const LayoutComponent = () => {
  const { isLoggedIn, userType } = useAuth();
  console.log('LayoutComponent rendered', { isLoggedIn, userType });

  useEffect(() => {
    if (!isLoggedIn && window.location.pathname === '/') {
      window.location.href = '/home'; // Redirect to /home
      setTimeout(() => {
        window.location.reload(); // Reload the page after redirecting
      }, 100); // Short delay to ensure redirect happens first
    }
  }, [isLoggedIn]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      {isLoggedIn && <MenuComponent userType={userType} />}
      <Layout>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          {!isLoggedIn && <Outlet />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
