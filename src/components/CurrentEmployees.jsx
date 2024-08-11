import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Space, Typography, Form, Input, Select, Modal, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const CurrentEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/admin/employees`, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleEdit = (employee) => {
    setEditingId(employee._id);
    form.setFieldsValue({
      ID: employee.ID,
      Name: employee.Name,
      Location: employee.Location,
      Password: employee.Password,
      Type: employee.Type,
    });
  };

  const handleSave = async () => {
    const values = form.getFieldsValue();
    Modal.confirm({
      title: 'Are you sure you want to make the changes?',
      onOk: async () => {
        try {
          const response = await axios.put(`${import.meta.env.VITE_BACKEND_URI}/admin/employees/${values.ID}/edit`, values, {
            withCredentials: true, // Ensure cookies are sent with the request
          });
          message.success('Employee updated successfully!');
          setEditingId(null);
          fetchEmployees();
        } catch (error) {
          message.error('Error updating employee. Please try again.');
          console.error('Error updating employee:', error);
        }
      },
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (ID) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this employee?',
      onOk: async () => {
        try {
          await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/admin/employees/remove/${ID}`, {
            withCredentials: true, // Ensure cookies are sent with the request
          });
          message.success('Employee deleted successfully!');
          fetchEmployees();
        } catch (error) {
          message.error('Error deleting employee. Please try again.');
          console.error('Error deleting employee:', error);
        }
      },
    });
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {employees.map((employee) => (
        <Card key={employee._id} title={employee.Name} style={{ width: 300 }}>
          {editingId === employee._id ? (
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                ID: employee.ID,
                Name: employee.Name,
                Location: employee.Location,
                Password: employee.Password,
                Type: employee.Type,
              }}
              onFinish={handleSave}
            >
              <Form.Item
                name="ID"
                label="Employee Code"
                rules={[{ required: true, message: 'Please input employee code!' }]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="Name"
                label="Employee Name"
                rules={[{ required: true, message: 'Please input employee name!' }]}
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
                name="Type"
                label="Role"
                rules={[{ required: true, message: 'Please select a role!' }]}
              >
                <Select>
                  <Option value="admin">Admin</Option>
                  <Option value="moderator">Moderator</Option>
                  <Option value="technician">Technician</Option>
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
              <Text>ID: {employee.ID}</Text>
              <br />
              <Text>Location: {employee.Location}</Text>
              <br />
              <Text>Role: {employee.Type}</Text>
              <div
                style={{
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text>Password: {visiblePasswords[employee._id] ? employee.Password : '********'}</Text>
                <Button
                  icon={visiblePasswords[employee._id] ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                  onClick={() => togglePasswordVisibility(employee._id)}
                  style={{ marginLeft: 8 }}
                />
              </div>
              <Space style={{ marginTop: '10px' }}>
                <Button type="primary" onClick={() => handleEdit(employee)}>
                  Edit
                </Button>
                <Button type="danger" onClick={() => handleDelete(employee.ID)}>
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

export default CurrentEmployees;
