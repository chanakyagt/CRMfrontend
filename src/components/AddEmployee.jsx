import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AddEmployee = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Log the environment variable when the component mounts
  useEffect(() => {
    console.log('Backend URI:', import.meta.env.VITE_BACKEND_URI);
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/admin/employees/add`, values, {
        withCredentials: true, // Ensure cookies are sent with the request
      });

      if (response.data.status === 'ok') {
        message.success('Employee added successfully!');
        form.resetFields();
      } else {
        message.error('Failed to add employee. Please try again.');
      }
    } catch (error) {
      message.error('Failed to add employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Form
        form={form}
        name="addEmployee"
        onFinish={onFinish}
        style={{ maxWidth: 400, width: '100%' }}
        className="bg-white p-8 rounded shadow-md"
      >
        <Form.Item
          name="Name"
          label="Employee Name"
          rules={[{ required: true, message: 'Please input employee name!' }]}
        >
          <Input placeholder="Employee Name" />
        </Form.Item>

        <Form.Item
          name="Location"
          label="Location"
          rules={[{ required: true, message: 'Please input location!' }]}
        >
          <Input placeholder="Location" />
        </Form.Item>

        <Form.Item
          name="Password"
          label="Password"
          rules={[{ required: true, message: 'Please input password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="Type"
          label="Role"
          rules={[{ required: true, message: 'Please select a role!' }]}
        >
          <Select placeholder="Select a role">
            <Option value="admin">Admin</Option>
            <Option value="moderator">Moderator</Option>
            <Option value="technician">Technician</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Add Employee
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEmployee;
