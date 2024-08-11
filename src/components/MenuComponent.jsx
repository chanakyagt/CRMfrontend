import React, { useState } from 'react';
import { Layout, Menu, Drawer, Button } from 'antd';
import { MenuOutlined, PieChartTwoTone, ShopTwoTone, BankTwoTone, LogoutOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Import components
import OverallAnalysis from './OverallAnalysis';
import Timeline from './Timeline';
import CurrentEmployees from './CurrentEmployees';
import AddEmployee from './AddEmployee';
import CurrentStores from './CurrentStores';
import AddStore from './AddStore';
import AddService from './AddService';

// Define the menu items for each user type
const menuItemsByUserType = {
  admin: [
    {
      key: '/admin/dashboard',
      label: 'Dashboard',
      icon: <PieChartTwoTone />,
      children: [
        { key: '/admin/dashboard/overall-analysis', label: 'Overall Analysis' },
        { key: '/admin/dashboard/timeline', label: 'Timeline' },
      ],
    },
    {
      key: '/admin/employees',
      label: 'Employees',
      icon: <BankTwoTone />,
      children: [
        { key: '/admin/employees/current', label: 'Current Employees' },
        { key: '/admin/employees/add', label: 'Add Employee' },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: '/admin/stores',
      label: 'Stores',
      icon: <ShopTwoTone />,
      children: [
        { key: '/admin/stores/current', label: 'Current Stores' },
        { key: '/admin/stores/add', label: 'Add Store' },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: '/admin/services',
      label: 'Services',
      icon: <ShopTwoTone />,
      children: [
        { key: '/admin/services/add', label: 'Add Service' },
      ],
    },
    {
      key: '/logout',
      label: <span style={{ color: 'red' }}>Logout</span>,
      icon: <LogoutOutlined style={{ color: 'red' }} />,
    },
  ],
  moderator: [
    {
      key: '/moderator/dashboard',
      label: 'Dashboard',
      icon: <PieChartTwoTone />,
      children: [
        { key: '/moderator/dashboard/timeline', label: 'Timeline' },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: '/logout',
      label: <span style={{ color: 'red' }}>Logout</span>,
      icon: <LogoutOutlined style={{ color: 'red' }} />,
    },
  ],
  store: [
    {
      key: '/store/dashboard',
      label: 'Dashboard',
      icon: <PieChartTwoTone />,
      children: [
        { key: '/store/dashboard/timeline', label: 'Timeline' },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: '/store/services',
      label: 'Services',
      icon: <ShopTwoTone />,
      children: [
        { key: '/store/services/add', label: 'Add Request' },
      ],
    },
    {
      key: '/logout',
      label: <span style={{ color: 'red' }}>Logout</span>,
      icon: <LogoutOutlined style={{ color: 'red' }} />,
    },
  ],
  technician: [
    {
      key: '/technician/dashboard',
      label: 'Dashboard',
      icon: <PieChartTwoTone />,
      children: [
        { key: '/technician/dashboard/timeline', label: 'Timeline' },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: '/logout',
      label: <span style={{ color: 'red' }}>Logout</span>,
      icon: <LogoutOutlined style={{ color: 'red' }} />,
    },
  ],
};

const { Sider, Content } = Layout;

const MenuComponent = ({ userType }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedKey, setSelectedKey] = useState(window.location.pathname); // Initial state based on URL

  // Media query hook for screen size
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' });

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const onClick = (e) => {
    const key = e.key;

    if (key === '/logout') {
      // Clear local storage and redirect to login page
      logout();
      navigate('/login');
      return;
    }

    setSelectedKey(key); // Update selected key on menu item click
    navigate(key); // Navigate to the new route
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          onBreakpoint={(broken) => {
            if (broken) {
              setCollapsed(true);
            }
          }}
        >
          <div className="logo" />
          <Menu
            onClick={onClick}
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
            mode="inline"
            items={menuItemsByUserType[userType.toLowerCase()]}
          />
        </Sider>
      )}

      <Layout>
        {isMobile && (
          <Button
            type="primary"
            icon={<MenuOutlined />}
            onClick={showDrawer}
            style={{ 
              marginBottom: 16, 
              position: 'absolute', 
              top: 16, 
              left: 16, 
              zIndex: 1000,
              borderRadius: 4,
              fontSize: '16px',
              height: '32px',
              lineHeight: '32px',
              padding: '0 12px'
            }}
          >
            Open Menu
          </Button>
        )}

        <Drawer
          title="Menu"
          placement="left"
          closable={false}
          onClose={onClose}
          visible={drawerVisible}
          width={256}
        >
          <Menu
            onClick={onClick}
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
            mode="inline"
            items={menuItemsByUserType[userType.toLowerCase()]}
          />
        </Drawer>

        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          <Routes>
            <Route path="/admin/dashboard/overall-analysis" element={<OverallAnalysis />} />
            <Route path="/admin/dashboard/timeline" element={<Timeline />} />
            <Route path="/admin/employees/current" element={<CurrentEmployees />} />
            <Route path="/admin/employees/add" element={<AddEmployee />} />
            <Route path="/admin/stores/current" element={<CurrentStores />} />
            <Route path="/admin/stores/add" element={<AddStore />} />
            <Route path="/admin/services/add" element={<AddService />} />
            <Route path="/store/dashboard/timeline" element={<Timeline />} />
            <Route path="/store/services/add" element={<AddService />} />
            <Route path="/moderator/dashboard/timeline" element={<Timeline />} />
            <Route path="/technician/dashboard/timeline" element={<Timeline />} />
            <Route path="/" element={<div>Please select a menu item.</div>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MenuComponent;
