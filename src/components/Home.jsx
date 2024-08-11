import React from 'react';
import { Carousel, Card, Typography, Button } from 'antd';
import Navbar from './Navbar'; // Assuming you have a Navbar component

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: '64px', padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
        <Title level={2}>Welcome to Gym Equipment Repair Center</Title>
        <Paragraph>
          We specialize in repairing and maintaining all types of gym equipment. Our experienced technicians ensure your machines are running smoothly and safely. Whether it's a treadmill, elliptical, weight machine, or any other fitness equipment, we've got you covered.
        </Paragraph>
        <Carousel autoplay style={{ marginTop: 16 }}>
          <div>
            <img
              src="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Treadmill Repair"
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
            <Card.Meta
              title="Treadmill Repair"
              description="Expert repair services for all treadmill models."
              style={{ textAlign: 'center', marginTop: '16px' }}
            />
          </div>
          <div>
            <img
              src="https://images.pexels.com/photos/9545909/pexels-photo-9545909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Elliptical Maintenance"
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
            <Card.Meta
              title="Elliptical Maintenance"
              description="Keep your ellipticals running smoothly with regular maintenance."
              style={{ textAlign: 'center', marginTop: '16px' }}
            />
          </div>
          <div>
            <img
              src="https://images.pexels.com/photos/5327505/pexels-photo-5327505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Strength Equipment Service"
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
            <Card.Meta
              title="Strength Equipment Service"
              description="Comprehensive servicing for all strength equipment."
              style={{ textAlign: 'center', marginTop: '16px' }}
            />
          </div>
        </Carousel>
        <Card title="Our Services" style={{ marginTop: 16 }}>
          <ul>
            <li>Treadmill repair and maintenance</li>
            <li>Elliptical machine servicing</li>
            <li>Strength equipment repair</li>
            <li>Preventive maintenance programs</li>
            <li>Equipment installation and setup</li>
          </ul>
        </Card>
        <Card style={{ marginTop: 16 }}>
          <Paragraph>
            At Gym Equipment Repair Center, we understand the importance of keeping your fitness equipment in top condition. Regular maintenance can extend the life of your machines and ensure a safe workout environment. Contact us today to schedule a service or learn more about our offerings.
          </Paragraph>
          <Button type="primary" href="/contact-us">
            Contact Us
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Home;
