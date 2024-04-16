import React from 'react';
import { Avatar, Layout, theme } from 'antd';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  FormOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { MdLibraryBooks } from "react-icons/md";
import { ImBooks } from "react-icons/im";

const { Sider, Content } = Layout;

const siderStyle = {
  textAlign: 'center',
  lineHeight: '100vh',
  color: '#fff',
  backgroundColor: '#333333',
};

const items = [
  { key: '1', icon: <ImBooks />, label: 'Class' },
  { key: '2', icon: <MdLibraryBooks />, label: 'Notes' },
  { key: '3', icon: <ContainerOutlined />, label: 'Shortcut' },
];

const SiderLayout = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
      <Sider style={{ ...siderStyle, width: collapsed ? 80 : 200 }}  collapsed={collapsed} onCollapse={toggleCollapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ backgroundColor: '#333333' }}>
          <Menu.Item key="0" onClick={toggleCollapsed} icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}>
            {collapsed ? 'Expand' : 'Collapse'}
          </Menu.Item>
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
  );
};

export default SiderLayout;