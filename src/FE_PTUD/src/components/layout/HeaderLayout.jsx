import React, { useState } from "react";
import { Avatar, Layout, Dropdown, Menu, Modal } from "antd";
import { BellOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import { GiWhiteBook } from "react-icons/gi";
import { IoLogOutOutline } from "react-icons/io5";
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
  let { logout } = useAuth();
  const navigate = useNavigate();

  const handleHomeIconClick = () => {
    navigate("/home");
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

  const bellMenu = (
    <Menu>
      <Menu.Item key="1">Notification 1</Menu.Item>
      <Menu.Item key="2">Notification 2</Menu.Item>
      <Menu.Item key="3">Notification 3</Menu.Item>
    </Menu>
  );

  return (
    <Header style={headerStyle}>
      <div style={iconGroupStyle}>
        <GiWhiteBook style={{ fontSize: "45px", cursor: "pointer" }}  onClick={handleHomeIconClick} />
        ClassRoom
      </div>

      <div style={iconGroupStyle}>
        <HomeOutlined
          style={{ fontSize: "35px", marginRight: "46px" }}
          onClick={handleHomeIconClick}
        />
        <Dropdown overlay={bellMenu} trigger={["click"]}>
          <BellOutlined style={{ fontSize: "35px", marginRight: "46px" }} />
        </Dropdown>
        <Dropdown overlay={avatarMenu} trigger={["click"]}>
          <UserOutlined style={{ fontSize: "35px" }} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderLayout;
