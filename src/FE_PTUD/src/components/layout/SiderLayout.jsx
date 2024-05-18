import React from "react";
import { Avatar, Layout, theme, Modal } from "antd";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  FormOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Menu, Input, Form, List } from "antd";
import { MdLibraryBooks } from "react-icons/md";
import { ImBooks } from "react-icons/im";

const { Sider, Content } = Layout;

const siderStyle = {
  textAlign: "center",
  lineHeight: "100vh",
  color: "#fff",
  backgroundColor: "#333333",
};

const items = [
  { key: "1", icon: <ImBooks />, label: "Class" },
  { key: "2", icon: <MdLibraryBooks />, label: "Notes" },
  { key: "3", icon: <ContainerOutlined />, label: "Shortcut" },
];

const SiderLayout = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isClassModalVisible, setIsClassModalVisible] = React.useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleItemClick = (key) => {
    if (key === '2') {
      setIsModalVisible(true);
    } else if (key === '3') {
      setIsClassModalVisible(true);
    }
  };

  return (
    <Sider
      style={{ ...siderStyle, width: collapsed ? 80 : 200 }}
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
    >
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{ backgroundColor: "#333333" }}
      >
        <Menu.Item
          key="0"
          onClick={toggleCollapsed}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        >
          {collapsed ? "Expand" : "Collapse"}
        </Menu.Item>
        {items.map((item) => (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={() => handleItemClick(item.key)}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
      <Modal
        title={<div style={{ textAlign: "center" }}>Notes</div>}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="Note 1">
            <Input placeholder="Enter note 1" />
          </Form.Item>
          <Form.Item label="Note 2">
            <Input placeholder="Enter note 2" />
          </Form.Item>
          <Form.Item label="Note 3">
            <Input placeholder="Enter note 3" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={<div style={{ textAlign: "center" }}>Classes</div>}
        visible={isClassModalVisible}
        onCancel={() => setIsClassModalVisible(false)}
        footer={null}
      >
        <List
          size="large"
          bordered
          dataSource={["Class 1", "Class 2", "Class 3"]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Modal>
    </Sider>
  );
};

export default SiderLayout;
