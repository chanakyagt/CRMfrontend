import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Space, message, Modal } from 'antd';
import axios from 'axios';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const AddStore = () => {
  const [form] = Form.useForm();
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/admin/employees`, {
          withCredentials: true,
        });
        const filteredTechnicians = response.data.filter(employee => employee.Type === 'technician');
        setTechnicians(filteredTechnicians);
      } catch (error) {
        console.error('Error fetching technicians:', error);
        message.error('Error fetching technicians. Please try again.');
      }
    };

    fetchTechnicians();
  }, []);

  const onFinish = async (values) => {
    Modal.confirm({
      title: 'Are you sure you want to add the store?',
      onOk: async () => {
        try {
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/admin/stores/add`, values, {
            withCredentials: true,
          });
          message.success('Store added successfully!');
          Modal.info({
            title: 'Server Response',
            content: JSON.stringify(response.data, null, 2),
          });
        } catch (error) {
          message.error('Error adding store. Please try again.');
          Modal.error({
            title: 'Server Response',
            content: error.response ? JSON.stringify(error.response.data, null, 2) : 'Unknown error',
          });
        }
      },
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      name: 'Store Name',
      location: 'Store Location',
      type: 'Store', // Locked value
    });
  };

  return (
    <Form
      {...layout}
      form={form}
      name="add-store"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
    >
      <Form.Item
        name="Name"
        label="Store Name"
        rules={[{ required: true, message: 'Please input store name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="Location"
        label="Location"
        rules={[{ required: true, message: 'Please input location!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="Password"
        label="Password"
        rules={[{ required: true, message: 'Please input password for store!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="defaultTechnician"
        label="Default Technician"
        rules={[{ required: true, message: 'Please select a default technician!' }]}
      >
        <Select placeholder="Select a technician">
          {technicians.map((tech) => (
            <Option key={tech._id} value={tech._id}>
              {tech.Name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={onFill}>
            Fill form
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddStore;
