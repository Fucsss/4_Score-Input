import React, { useState } from "react";
import { Avatar, Layout, Dropdown, Menu, Modal } from "antd";
import { BellOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import { GiWhiteBook } from "react-icons/gi";
import { IoLogOutOutline } from "react-icons/io5"; // Import the logout icon
import { useAuth } from "../../provider/authContext";
const { Header } = Layout;
import { useNavigate } from "react-router-dom";



const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#000000",
};

const iconGroupStyle = {
  display: "flex",
  alignItems: "center",
};



const HeaderLayout = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  let { logout } = useAuth();
  const navigate = useNavigate();

  const handleBellIconClick = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "4":
        // Handle logout action here
        logout();
        navigate("/");
        break;
      default:
        // Handle other menu item clicks if needed
        break;
    }
  };

  const avatarMenu = (
    <Menu onClick={handleMenuClick}>
      {[
        {
          label: "Nâng cấp tài khoản",
          key: "1",
        },
        {
          label: "Hồ sơ của bạn",
          key: "2",
        },
        {
          label: "Cài đặt",
          key: "3",
        },
        {
          type: "divider",
          key: "divider", 
          style: { borderBottom: "1px solid gray" }, 
        },
        {
          label: "Đăng xuất",
          key: "4",
          style: { color: "red" }, 
          icon: <IoLogOutOutline style={{ marginRight: "8px" }} />, 
        },
      ].map((item) =>
        item.type === "divider" ? (
          <Menu.Divider key={item.key} style={item.style} />
        ) : (
          <Menu.Item key={item.key} style={item.style}>
            {item.icon}
            {item.label}
          </Menu.Item>
        )
      )}
    </Menu>
  );

  return (
    <Header style={headerStyle}>
      <div style={iconGroupStyle}>
        <GiWhiteBook style={{ fontSize: "45px" }} />
        ClassRoom
      </div>

      <div style={iconGroupStyle}>
        <HomeOutlined style={{ fontSize: "35px", marginRight: "46px" }} />
        <BellOutlined
          style={{ fontSize: "35px", marginRight: "46px" }}
          onClick={handleBellIconClick}
        />
        <Dropdown overlay={avatarMenu} trigger={["click"]}>
          <UserOutlined style={{ fontSize: "35px" }} />
        </Dropdown>
      </div>
      <Modal
        title="Notification"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        {/* Content of the modal goes here */}
      </Modal>
    </Header>
  );
};

export default HeaderLayout;
