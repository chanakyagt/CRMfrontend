import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Tag } from 'antd';
import { ShopOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

function OverallAnalysis() {
  const [data, setData] = useState({
    overview: [],
    stores: 0,
    users: [
      { _id: 'admin', count: 0 },
      { _id: 'moderator', count: 0 },
      { _id: 'technician', count: 0 },
      { _id: 'store', count: 0 }
    ],
    works: 0,
    jobStatusCounts: []
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/admin/overall-analysis`, {
          withCredentials: true
        });
        const responseData = response.data;

        const allUserTypes = ['admin', 'moderator', 'technician', 'store'];
        const userTypes = allUserTypes.map(type => ({
          _id: type,
          count: responseData.users.find(user => user._id === type)?.count || 0
        }));

        const allStatuses = ['submitted', 'inprogress', 'rejected', 'completed'];
        const jobStatusCounts = allStatuses.map(status => ({
          _id: status,
          count: responseData.jobStatusCounts.find(item => item._id === status)?.count || 0
        }));

        setData({ ...responseData, users: userTypes, jobStatusCounts });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const statusColors = {
    submitted: '#90CAF9',  // Softer blue
    inprogress: '#FFCC80',  // Softer orange
    rejected: '#EF9A9A',  // Softer red
    completed: '#B0BEC5',  // Softer gray
  };

  const typeColors = {
    stores: '#FFE082',  // Soft amber
    works: '#FFAB91',  // Soft coral
    admin: '#FFF59D',  // Soft yellow
    moderator: '#FFE082',  // Soft amber
    technician: '#FFCC80',  // Soft orange
    store: '#FFAB91'  // Soft coral
  };

  const iconStyles = {
    fontSize: '24px',
    color: '#1890ff',
    marginRight: '10px'
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card 
            style={{ 
              borderColor: typeColors.stores, 
              borderWidth: 2, 
              borderStyle: 'solid',
              backgroundColor: '#FFF8E1', // Light background for better contrast
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Subtle shadow for depth
            }}
          >
            <Statistic 
              title={<span><ShopOutlined style={iconStyles}/> Total Stores</span>} 
              value={data.stores} 
              valueStyle={{ color: 'black', fontWeight: 'bold', fontSize: '24px' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card 
            style={{ 
              borderColor: typeColors.works, 
              borderWidth: 2, 
              borderStyle: 'solid',
              backgroundColor: '#FFF8E1',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Statistic 
              title={<span><FileTextOutlined style={iconStyles}/> Total Works</span>} 
              value={data.works} 
              valueStyle={{ color: 'black', fontWeight: 'bold', fontSize: '24px' }} 
            />
          </Card>
        </Col>
        {data.users.map(user => (
          <Col key={user._id} xs={24} sm={12} md={8} lg={6}>
            <Card 
              style={{ 
                borderColor: typeColors[user._id], 
                borderWidth: 2, 
                borderStyle: 'solid',
                backgroundColor: '#FFF8E1',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            >
              <Statistic
                title={<span><UserOutlined style={iconStyles}/> {user._id.charAt(0).toUpperCase() + user._id.slice(1)} Users</span>}
                value={user.count}
                valueStyle={{ color: 'black', fontWeight: 'bold', fontSize: '24px' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="Job Status Overview" style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Row gutter={[16, 16]}>
              {data.jobStatusCounts.map(status => (
                <Col key={status._id} xs={24} sm={12} md={8} lg={6}>
                  <Card>
                    <Tag
                      color={statusColors[status._id]}
                      style={{
                        fontWeight: 'bold',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        color: 'black', // Black text inside the Tag
                      }}
                    >
                      {status._id.charAt(0).toUpperCase() + status._id.slice(1)}
                    </Tag>
                    <Statistic
                      value={status.count}
                      valueStyle={{ color: 'black', fontWeight: 'bold', fontSize: '24px' }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OverallAnalysis;
