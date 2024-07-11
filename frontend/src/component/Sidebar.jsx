import React, { useState } from 'react';
import { Flex, Menu } from 'antd';
import { FaHouse } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation from React Router

import { UserOutlined } from '@ant-design/icons'; // Ant Design icons
import { SiAffinitydesigner } from "react-icons/si";
import { MdProductionQuantityLimits } from "react-icons/md";

import { FiBox } from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);

  // Function to handle submenu open change
  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  // Function to get the parent keys of the active route
  const getParentKeys = (pathname) => {
    const paths = pathname.split('/').filter((p) => p);
    return paths.map((_, index) => `/${paths.slice(0, index + 1).join('/')}`);
  };

  return (
    <>
      <Flex align="center" justify="center">
        <Link to="/Home"><div className="logo">
          <FaHouse />
        </div>
        </Link>
      </Flex>

      <Menu
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        selectedKeys={[location.pathname]}
        defaultOpenKeys={openKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        className="menu-bar"
      >
        {/* Use Link components from React Router */}
         <Menu.Item key="/Home" icon={<UserOutlined />} title={<UserOutlined />}>
      <Link to="/Home">Dashboard</Link>
    </Menu.Item>
    <Menu.Item key="/Produits" icon={<MdProductionQuantityLimits />} title={<MdProductionQuantityLimits />}>
      <Link to="/Produits">Produits</Link>
    </Menu.Item>
    <Menu.Item key="/stock" icon={<FiBox />} title={<FiBox />}>
      <Link to="/stock">Stock</Link>
    </Menu.Item>
    <Menu.Item key="/Affichage" icon={<SiAffinitydesigner  /> } title={<SiAffinitydesigner  />}>
      <Link to="/Affichage">affichage 3D</Link>
    </Menu.Item>
      </Menu>

    </>
  );
};

export default Sidebar;
