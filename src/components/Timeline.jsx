import React, { useEffect, useState } from 'react';
import { Card, Button, Space, Typography, Form, Input, Select, Tag, Modal, message, DatePicker, Image, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PictureOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { useForm } = Form;

const statusColors = {
  submitted: 'blue',
  accepted: 'green',
  inprogress: 'orange',
  rejected: 'red',
  completed: 'gray',
};

const Timeline = () => {
  const [works, setWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [visibleImages, setVisibleImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [form] = useForm();
  const [updateForm] = useForm();
  const [technicianOptions, setTechnicianOptions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');
  const [sortCreationDate, setSortCreationDate] = useState('desc');
  const [sortUpdateDate, setSortUpdateDate] = useState('desc');
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [storeOptions, setStoreOptions] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('ID');

  const getApiEndpoint = () => {
    if (userType === 'moderator') {
      return `${import.meta.env.VITE_BACKEND_URI}/moderator/works`;
    } else if (userType === 'store') {
      const storeName = localStorage.getItem('name');
      if (!storeName) {
        message.error('Store name not found. Please set the store name.');
        return null;
      }
      return `${import.meta.env.VITE_BACKEND_URI}/store/works/${storeName}`;
    } else if (userType === 'technician') {
      return `${import.meta.env.VITE_BACKEND_URI}/technician/works/${userId}`;
    } else {
      return `${import.meta.env.VITE_BACKEND_URI}/admin/works`;
    }
  };

  const fetchWorks = async () => {
    const endpoint = getApiEndpoint();
    if (!endpoint) return;

    try {
      const { data } = await axios.get(endpoint, {
        withCredentials: true,
      });
      setWorks(data);
      setFilteredWorks(data);
      const uniqueEquipments = [...new Set(data.map(work => work.equipmentModel))];
      const uniqueStores = [...new Set(data.map(work => work.store))];
      setEquipmentOptions(uniqueEquipments);
      setStoreOptions(uniqueStores);
    } catch (error) {
      console.error('Error fetching works:', error);
      message.error('Failed to fetch works');
    }
  };

  const fetchTechnicians = async () => {
    const endpoint = userType === 'technician'
      ? `${import.meta.env.VITE_BACKEND_URI}/technician/technicians`
      : userType === 'moderator'
      ? `${import.meta.env.VITE_BACKEND_URI}/moderator/technicians`
      : `${import.meta.env.VITE_BACKEND_URI}/admin/technicians`;

    try {
      const { data } = await axios.get(endpoint, {
        withCredentials: true,
      });
      setTechnicianOptions(data);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      message.error('Failed to fetch technicians');
    }
  };

  useEffect(() => {
    fetchWorks();
    fetchTechnicians();
  }, []);

  useEffect(() => {
    filterWorks();
  }, [statusFilter, equipmentFilter, storeFilter, sortCreationDate, sortUpdateDate, dateRange, works]);

  const filterWorks = () => {
    let filtered = works;
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(work => work.status === statusFilter);
    }
    if (equipmentFilter && equipmentFilter !== 'all') {
      filtered = filtered.filter(work => work.equipmentModel === equipmentFilter);
    }
    if (storeFilter && storeFilter !== 'all') {
      filtered = filtered.filter(work => work.store === storeFilter);
    }
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(work => {
        const workDate = new Date(work.date);
        return workDate >= dateRange[0] && workDate <= dateRange[1];
      });
    }
    if (sortCreationDate) {
      filtered = filtered.sort((a, b) => {
        return sortCreationDate === 'asc'
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
    if (sortUpdateDate) {
      filtered = filtered.sort((a, b) => {
        return sortUpdateDate === 'asc'
          ? new Date(a.updatedAt) - new Date(b.updatedAt)
          : new Date(b.updatedAt) - new Date(a.updatedAt);
      });
    }
    setFilteredWorks(filtered);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleEdit = (work) => {
    setEditingId(work.workCode);
    form.setFieldsValue({
      workCode: work.workCode,
      store: work.store,
      date: new Date(work.date).toISOString().split('T')[0],
      equipmentModel: work.equipmentModel,
      serviceVisitType: work.serviceVisitType,
      issueAboutEquipment: work.issueAboutEquipment,
      customerName: work.customerName,
      customerAddress: work.customerAddress || '',
      customerPhoneNumber: work.customerPhoneNumber,
      serviceUpdates: work.serviceUpdates || '',
      technician: work.technician?._id,
      status: work.status,
      amountPaidBy: work.amountPaidBy,
      amountUpdates: work.amountUpdates || ''
    });
  };

  const handleSave = async () => {
    const values = form.getFieldsValue();
    const work = works.find(work => work.workCode === editingId);
    Modal.confirm({
      title: 'Are you sure you want to save the changes?',
      onOk: async () => {
        try {
          const updatedWork = {
            ...work,
            ...values,
            date: values.date ? new Date(values.date).toISOString() : undefined,
          };
          await axios.put(`${getApiEndpoint()}/${editingId}/edit`, updatedWork, {
            withCredentials: true,
          });
          message.success('Work updated successfully!');
          setEditingId(null);
          fetchWorks();
        } catch (error) {
          message.error('Error updating work. Please try again.');
          console.error('Error updating work:', error);
          console.error('Server response:', error.response.data);
        }
      },
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setUpdatingId(null);
    setVisibleImages(false);
    setFileList([]);
  };

  const handleDelete = (workCode) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this work?',
      onOk: async () => {
        try {
          await axios.delete(`${getApiEndpoint()}/${workCode}/remove`, {
            withCredentials: true,
          });
          message.success('Work deleted successfully!');
          fetchWorks();
        } catch (error) {
          message.error('Error deleting work. Please try again.');
          console.error('Error deleting work:', error);
        }
      },
    });
  };

  const handleUpdate = (work) => {
    setUpdatingId(work.workCode);
    updateForm.setFieldsValue({
      technician: work.technician?._id,
      status: work.status,
      serviceUpdates: work.serviceUpdates || '',
      amountUpdates: work.amountUpdates || '',
      store: work.store,
      date: work.date,
      equipmentModel: work.equipmentModel,
      serviceVisitType: work.serviceVisitType,
      issueAboutEquipment: work.issueAboutEquipment,
      customerName: work.customerName,
      customerAddress: work.customerAddress || '',
      customerPhoneNumber: work.customerPhoneNumber,
      amountPaidBy: work.amountPaidBy,
    });
  };

  const handleUpdateSave = async () => {
    const values = updateForm.getFieldsValue();
    const work = works.find(work => work.workCode === updatingId);

    const updatedWork = {
      ...work,
      ...values,
      serviceUpdates: values.serviceUpdates || work.serviceUpdates || '',
      amountUpdates: values.amountUpdates || work.amountUpdates || '',
      customerAddress: values.customerAddress || work.customerAddress || '',
    };

    const formData = new FormData();
    formData.append('technician', updatedWork.technician);
    formData.append('status', updatedWork.status);
    formData.append('serviceUpdates', updatedWork.serviceUpdates);
    formData.append('amountUpdates', updatedWork.amountUpdates);
    formData.append('store', updatedWork.store);
    formData.append('date', new Date(updatedWork.date).toISOString());
    formData.append('equipmentModel', updatedWork.equipmentModel);
    formData.append('serviceVisitType', updatedWork.serviceVisitType);
    formData.append('issueAboutEquipment', updatedWork.issueAboutEquipment);
    formData.append('customerName', updatedWork.customerName);
    formData.append('customerAddress', updatedWork.customerAddress);
    formData.append('customerPhoneNumber', updatedWork.customerPhoneNumber);
    formData.append('amountPaidBy', updatedWork.amountPaidBy);

    fileList.forEach((file) => {
      formData.append('images', file.originFileObj);
    });

    Modal.confirm({
      title: 'Are you sure you want to update the service updates, amount updates, status, and technician?',
      onOk: async () => {
        try {
          const endpoint = userType === 'technician'
            ? `${import.meta.env.VITE_BACKEND_URI}/technician/works/${updatingId}/edit`
            : `${getApiEndpoint()}/${updatingId}/edit`;

          const response = await axios.put(endpoint, formData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          message.success('Service updates, amount updates, status, and technician updated successfully!');
          setUpdatingId(null);
          setFileList([]);
          fetchWorks();
        } catch (error) {
          message.error('Error updating service updates, amount updates, status, or technician. Please try again.');
          console.error('Error updating work:', error);
          console.error('Server response:', error.response.data);
        }
      },
    });
  };

  const handleSeePics = async (workCode) => {
    let endpoint = `${import.meta.env.VITE_BACKEND_URI}/admin/works/${workCode}/images`;
    if (userType === 'moderator') {
      endpoint = `${import.meta.env.VITE_BACKEND_URI}/moderator/works/${workCode}/images`;
    } else if (userType === 'store') {
      endpoint = `${import.meta.env.VITE_BACKEND_URI}/store/works/${workCode}/images`;
    } else if (userType === 'technician') {
      endpoint = `${import.meta.env.VITE_BACKEND_URI}/technician/works/${workCode}/images`;
    }
    try {
      const { data } = await axios.get(endpoint, {
        withCredentials: true,
      });
      setSelectedImages(data.images || []);
      setVisibleImages(true);
    } catch (error) {
      message.error('Failed to fetch images. Please try again.');
      console.error('Error fetching images:', error);
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setEquipmentFilter('all');
    setStoreFilter('all');
    setSortCreationDate('desc');
    setSortUpdateDate('desc');
    setDateRange([null, null]);
    setFilteredWorks(works);
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'flex-start', marginBottom: '20px' }}>
        <Select
          placeholder="Filter by Status"
          onChange={setStatusFilter}
          value={statusFilter}
          style={{ width: 200 }}
        >
          <Option value="all">All Statuses</Option>
          <Option value="submitted">Submitted</Option>
          <Option value="inprogress">In Progress</Option>
          <Option value="rejected">Rejected</Option>
          <Option value="completed">Completed</Option>
        </Select>
        <Select
          placeholder="Filter by Equipment Model"
          onChange={setEquipmentFilter}
          value={equipmentFilter}
          style={{ width: 200 }}
        >
          <Option value="all">All Equipment Models</Option>
          {equipmentOptions.map(equipment => (
            <Option key={equipment} value={equipment}>{equipment}</Option>
          ))}
        </Select>
        <Select
          placeholder="Filter by Store"
          onChange={setStoreFilter}
          value={storeFilter}
          style={{ width: 200 }}
        >
          <Option value="all">All Stores</Option>
          {storeOptions.map(store => (
            <Option key={store} value={store}>{store}</Option>
          ))}
        </Select>
        <RangePicker
          style={{ width: 300 }}
          onChange={handleDateRangeChange}
          value={dateRange}
        />
        <Select
          placeholder="Sort by Creation Date"
          onChange={setSortCreationDate}
          value={sortCreationDate}
          style={{ width: 200 }}
        >
          <Option value="asc">Creation Date Ascending</Option>
          <Option value="desc">Creation Date Descending</Option>
        </Select>
        <Select
          placeholder="Sort by Update Date"
          onChange={setSortUpdateDate}
          value={sortUpdateDate}
          style={{ width: 200 }}
        >
          <Option value="asc">Update Date Ascending</Option>
          <Option value="desc">Update Date Descending</Option>
        </Select>
        <Button onClick={handleResetFilters}>Reset Filters</Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'flex-start' }}>
        {filteredWorks.map((work) => (
          <Card
            key={work.workCode}
            title={
              <div>
                <Text strong>{work.store}</Text>
                <div style={{ fontSize: '0.9em', color: 'gray' }}>({work.equipmentModel})</div>
              </div>
            }
            style={{ width: 400, marginBottom: 16, border: `1px solid ${statusColors[work.status]}` }}
            actions={[
              userType !== 'technician' && userType !== 'store' && editingId === work.workCode ? (
                <Button type="primary" onClick={handleSave}>
                  Save
                </Button>
              ) : userType !== 'technician' && userType !== 'store' && (
                <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(work)}>
                  Edit
                </Button>
              ),
              userType !== 'store' && (
                updatingId === work.workCode ? (
                  <Button type="primary" onClick={handleUpdateSave}>
                    Update
                  </Button>
                ) : (
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleUpdate(work)}>
                    Update
                  </Button>
                )
              ),
              userType === 'admin' && (
                <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(work.workCode)}>
                  Delete
                </Button>
              ),
              <Button type="link" icon={<PictureOutlined />} onClick={() => handleSeePics(work.workCode)}>
                See Pics
              </Button>
            ]}
          >
            {editingId === work.workCode ? (
              <Form form={form} layout="vertical" initialValues={work}>
                <Form.Item name="workCode" label="Job Code" rules={[{ required: true, message: 'Please input job code!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="store" label="Store" rules={[{ required: true, message: 'Please input store!' }]}>
                  <Input disabled={userType === 'store'} />
                </Form.Item>
                <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please input date!' }]}>
                  <Input type="date" />
                </Form.Item>
                <Form.Item name="equipmentModel" label="Equipment Model" rules={[{ required: true, message: 'Please input equipment model!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="serviceVisitType" label="Service Visit Type">
                  <Input />
                </Form.Item>
                <Form.Item name="issueAboutEquipment" label="Issue About Equipment">
                  <Input />
                </Form.Item>
                <Form.Item name="customerName" label="Customer Name" rules={[{ required: true, message: 'Please input customer name!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="customerAddress" label="Customer Address">
                  <Input />
                </Form.Item>
                <Form.Item name="customerPhoneNumber" label="Customer Phone Number" rules={[{ required: true, message: 'Please input customer phone number!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="serviceUpdates" label="Service Updates">
                  <Input />
                </Form.Item>
                {userType !== 'store' && (
                  <Form.Item name="amountUpdates" label="Amount Updates">
                    <Input />
                  </Form.Item>
                )}
                <Form.Item name="technician" label="Technician" rules={[{ required: true, message: 'Please select a technician!' }]}>
                  <Select disabled={userType === 'technician'}>
                    {technicianOptions.map(tech => (
                      <Option key={tech._id} value={tech._id}>{tech.Name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select a status!' }]}>
                  <Select>
                    <Option value="submitted">Submitted</Option>
                    <Option value="inprogress">In Progress</Option>
                    <Option value="rejected">Rejected</Option>
                    <Option value="completed">Completed</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="amountPaidBy" label="Amount Paid By" rules={[{ required: true, message: 'Please select who paid the amount!' }]}>
                  <Select placeholder="Select who paid the amount">
                    <Option value="store">Paid by Store</Option>
                    <Option value="customer">Paid by Customer</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button htmlType="button" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            ) : updatingId === work.workCode ? (
              <Form form={updateForm} layout="vertical" initialValues={{ serviceUpdates: work.serviceUpdates, status: work.status, technician: work.technician?._id, amountUpdates: work.amountUpdates }}>
                <Form.Item name="technician" label="Technician" rules={[{ required: true, message: 'Please select a technician!' }]}>
                  <Select disabled={userType === 'technician'}>
                    {technicianOptions.map(tech => (
                      <Option key={tech._id} value={tech._id}>{tech.Name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status!' }]}>
                  <Select>
                    <Option value="submitted">Submitted</Option>
                    <Option value="inprogress">In Progress</Option>
                    <Option value="rejected">Rejected</Option>
                    <Option value="completed">Completed</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="serviceUpdates" label="Service Updates">
                  <Input />
                </Form.Item>
                {userType !== 'store' && (
                  <Form.Item name="amountUpdates" label="Amount Updates">
                    <Input />
                  </Form.Item>
                )}
                <Form.Item>
                  <Upload
                    listType="picture"
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={() => false} // Prevent automatic upload
                  >
                    <Button icon={<UploadOutlined />}>Upload Images</Button>
                  </Upload>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button htmlType="button" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="primary" onClick={handleUpdateSave}>
                      Update
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            ) : (
              <>
                <p><Text strong>Job Code:</Text> {work.workCode}</p>
                <p><Text strong>Date:</Text> {new Date(work.date).toLocaleDateString()}</p>
                <p><Text strong>Service Visit Type:</Text> {work.serviceVisitType || 'N/A'}</p>
                <p><Text strong>Issue About Equipment:</Text> {work.issueAboutEquipment || 'N/A'}</p>
                <p><Text strong>Customer Name:</Text> {work.customerName}</p>
                <p><Text strong>Customer Address:</Text> {work.customerAddress || 'N/A'}</p>
                <p><Text strong>Customer Phone Number:</Text> {work.customerPhoneNumber}</p>
                <p><Text strong>Service Updates:</Text> {work.serviceUpdates || 'N/A'}</p>
                {userType !== 'store' && (
                  <p><Text strong>Amount Updates:</Text> {work.amountUpdates || 'N/A'}</p>
                )}
                <p><Text strong>Technician:</Text> {work.technician ? work.technician.Name : 'N/A'}</p>
                <p><Text strong>Amount Paid By:</Text> {work.amountPaidBy ? (work.amountPaidBy === 'store' ? 'Paid by Store' : 'Paid by Customer') : 'N/A'}</p>
                <p><Text strong>Created At:</Text> {new Date(work.createdAt).toLocaleString()}</p>
                <p><Text strong>Updated At:</Text> {new Date(work.updatedAt).toLocaleString()}</p>
                <Tag color={statusColors[work.status]}>
                  {work.status.charAt(0).toUpperCase() + work.status.slice(1)}
                </Tag>
              </>
            )}
          </Card>
        ))}
      </div>
      <Modal
        open={visibleImages}
        title="Job Photos"
        footer={null}
        onCancel={handleCancel}
        width="80%"
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
          {selectedImages.map((image, index) => (
            <div key={index} style={{ flex: '1 1 calc(25% - 10px)', maxWidth: 'calc(25% - 10px)' }}>
              <Image src={image.base64} alt={`Photo ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Timeline;
