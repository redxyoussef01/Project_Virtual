import React, {useState} from 'react'
import { Button, Flex, Layout } from 'antd';
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'
import Sidebar from '../component/Sidebar';
import MainContent from '../component/MainContent';
import image from '../assets/southema.png';

import CustomHeader from '../component/Header';
import '../App.css'


const {Sider, Header, Content} = Layout;
const App = () => {
  const [collapsed, setCollapsed] = useState(false)
  return (
    
    <Layout>
      <Sider theme="light" trigger={null} collapsible collapsed={collapsed} className="sider">

        <Sidebar />

        <Button type='text' icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)} className='triger-btn' />
      </Sider>
      <Layout>
        <Header className="header">
          <CustomHeader />
        </Header>
        <Content className="content">
          <Flex gap="large">
            <MainContent />
          </Flex>
          <div className="image-container">
            <img src={image} alt="Southema image" className="your-image-class" />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;