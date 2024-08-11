import React from 'react';
import { Card, Typography } from 'antd';
import Navbar from './Navbar'; // Assuming you have a Navbar component

const { Title } = Typography;

const ContactUs = () => {
  return (
    <div>
     
      <div style={{ marginTop: '64px', padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
        <Title level={2}>Contact Us</Title>
        <Card>
          <p>If you have any questions or concerns, please feel free to reach out to us. You can contact us via the following methods:</p>
          <ul>
            <li>Email: support@example.com</li>
            <li>Phone: (123) 456-7890</li>
            <li>Address: 123 Example Street, Example City, EX 12345</li>
          </ul>
          <p>We look forward to hearing from you!</p>
        </Card>
      </div>
    </div>
  );
};

export default ContactUs;
