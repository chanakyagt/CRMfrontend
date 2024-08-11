import React, { useEffect, useState } from 'react';
import { Card, Button, Space, Typography, message, Modal, Form, Input, Select } from 'antd';
import axios from 'axios';

const { Text } = Typography;
const { Option } = Select;

const CurrentStores = () => {
  const [stores, setStores] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchStores = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/admin/stores`, {
        withCredentials: true,
      });
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
      message.error('Error fetching stores. Please try again.');
    }
  };

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

  useEffect(() => {
    fetchStores();
    fetchTechnicians();
  }, []);

  const handleEdit = (store) => {
    setEditingId(store._id);
    form.setFieldsValue({
      ID: store.ID,
      Name: store.Name,
      Location: store.Location,
      Password: store.PlainPassword, // Use plain password for editing
      defaultTechnician: store.defaultTechnician?._id,
    });
  };

  const handleSave = async () => {
    const values = form.getFieldsValue();
    Modal.confirm({
      title: 'Are you sure you want to make the changes?',
      onOk: async () => {
        try {
          const response = await axios.put(`${import.meta.env.VITE_BACKEND_URI}/admin/stores/${values.ID}/edit`, values, {
            withCredentials: true,
          });
          message.success('Store updated successfully!');
          setEditingId(null);
          fetchStores();
        } catch (error) {
          message.error('Error updating store. Please try again.');
          console.error('Error updating store:', error);
        }
      },
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (ID) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this store?',
      onOk: async () => {
        try {
          await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/admin/stores/remove/${ID}`, {
            withCredentials: true,
          });
          message.success('Store deleted successfully!');
          fetchStores();
        } catch (error) {
          message.error('Error deleting store. Please try again.');
          console.error('Error deleting store:', error);
        }
      },
    });
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {stores.map((store) => (
        <Card key={store._id} title={store.Name} style={{ width: 300 }}>
          {editingId === store._id ? (
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                ID: store.ID,
                Name: store.Name,
                Location: store.Location,
                Password: store.PlainPassword, // Use plain password for editing
                defaultTechnician: store.defaultTechnician?._id,
              }}
              onFinish={handleSave}
            >
              <Form.Item
                name="ID"
                label="Store ID"
                rules={[{ required: true, message: 'Please input store ID!' }]}
              >
                <Input disabled />
              </Form.Item>

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
                rules={[{ required: true, message: 'Please input password!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="defaultTechnician"
                label="Default Technician"
                rules={[{ required: true, message: 'Please select a default technician!' }]}
              >
                <Select>
                  {technicians.map((tech) => (
                    <Option key={tech._id} value={tech._id}>
                      {tech.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                  <Button htmlType="button" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          ) : (
            <>
              <Text>ID: {store.ID}</Text>
              <br />
              <Text>Location: {store.Location}</Text>
              <br />
              <Text>Password: {store.PlainPassword}</Text>
              <br />
              <Text>Default Technician: {store.defaultTechnician?.Name || 'None'}</Text>
              <Space style={{ marginTop: '10px' }}>
                <Button type="primary" onClick={() => handleEdit(store)}>
                  Edit
                </Button>
                <Button type="danger" onClick={() => handleDelete(store.ID)}>
                  Delete
                </Button>
              </Space>
            </>
          )}
        </Card>
      ))}
    </div>
  );
};

export default CurrentStores;
