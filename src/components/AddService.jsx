import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, message, Select, Row, Col, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const AddService = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [fileList, setFileList] = useState([]); // State to store uploaded images
  const userType = localStorage.getItem('userType');
  const storeName = localStorage.getItem('name');

  useEffect(() => {
    if (userType !== 'store') {
      const fetchStores = async () => {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/admin/stores`, {
            withCredentials: true,
          });
          setStores(data);
        } catch (error) {
          message.error('Failed to fetch stores.');
        }
      };

      fetchStores();
    }
  }, [userType]);

  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const onFinish = async (values) => {
    try {
      // Prepare data for POST request
      const dataToSend = {
        ...values,
        date: values.date.toISOString(), // Convert Date to ISO format
      };

      // Determine the API endpoint based on the user type
      const apiEndpoint =
        userType === 'store'
          ? `${import.meta.env.VITE_BACKEND_URI}/store/works/add`
          : `${import.meta.env.VITE_BACKEND_URI}/admin/works/add`;

      // Include images in the same request if fileList is not empty
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append('images', file.originFileObj);
      });

      // Append other form data
      Object.keys(dataToSend).forEach((key) => {
        formData.append(key, dataToSend[key]);
      });

      // POST request to add a new service and upload images
      await axios.post(apiEndpoint, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Service added successfully!');
      form.resetFields();
      setFileList([]); // Reset file list
      navigate('/services'); // Redirect after submission
    } catch (error) {
      message.error('Failed to add service.');
    }
  };

  return (
    <div style={{ padding: '24px', background: '#fff', minHeight: '100%' }}>
      <h2>Add Service</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          store: userType === 'store' ? storeName : undefined,
          date: moment(), // Default to today's date
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="store"
              label="Store"
              rules={[{ required: true, message: 'Please select the store!' }]}
            >
              {userType === 'store' ? (
                <Input value={storeName} disabled />
              ) : (
                <Select placeholder="Select Store">
                  {stores.map((store) => (
                    <Option key={store.ID} value={store.Name}>
                      {store.Name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select the date!' }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
                onChange={(date) => {
                  form.setFieldsValue({ date });
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="equipmentModel"
              label="Equipment Type/Model"
              rules={[{ required: true, message: 'Please input the Equipment Model!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="serviceVisitType"
              label="Service Visit Type"
              rules={[{ required: true, message: 'Please select the Service Visit Type!' }]}
            >
              <Select placeholder="Select Service Visit Type" style={{ width: '100%' }}>
                <Option value="installation">Installation</Option>
                <Option value="warranty">Warranty</Option>
                <Option value="repair">Repair</Option>
                <Option value="parts_exchange">Parts Exchange</Option>
                <Option value="others">Others</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              name="issueAboutEquipment"
              label="Issue About Equipment"
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="customerName"
              label="Customer Name"
              rules={[{ required: true, message: 'Please input the Customer Name!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="customerPhoneNumber"
              label="Customer Phone Number"
              rules={[{ required: true, message: 'Please input the Customer Phone Number!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              name="customerAddress"
              label="Customer Address"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              name="serviceUpdates"
              label="Service Updates"
            >
              <TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="amountPaidBy"
              label="Amount Paid By"
              rules={[{ required: true, message: 'Please select who paid the amount!' }]}
            >
              <Select placeholder="Select who paid the amount" style={{ width: '100%' }}>
                <Option value="store">Paid by Store</Option>
                <Option value="customer">Paid by Customer</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              name="images"
              label="Upload Images"
            >
              <Upload
                listType="picture"
                fileList={fileList}
                onChange={handleUpload}
                multiple
                beforeUpload={() => false} // Prevent auto upload
              >
                <Button icon={<UploadOutlined />}>Add Pics</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddService;
