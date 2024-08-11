import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn) {
      const userType = localStorage.getItem('userType');
      if (userType) {
        navigate(`/${userType.toLowerCase()}`);
      }
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          ID: values.ID,
          Password: values.Password,
        }),
      });

      const data = await response.json();

      if (data.status === 'ok') {
        const { userType, ID, name } = data;

        message.success('Login successful!');
        login(ID, userType, name);

        // Navigate based on user type
        switch (userType) {
          case 'admin':
            navigate('/admin');
            break;
          case 'store':
            navigate('/store');
            break;
          case 'moderator':
            navigate('/moderator');
            break;
          case 'technician':
            navigate('/technician');
            break;
          default:
            navigate('/userDetails');
        }
      } else {
        message.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{ maxWidth: 300, width: '100%' }}
        className="bg-white p-8 rounded shadow-md"
      >
        <Form.Item
          name="ID"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="Password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
