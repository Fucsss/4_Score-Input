import React from "react";
import { Menu } from "antd";
import { Header } from "antd/lib/layout/layout";

export const setChoose = (key) => {
  switch (key) {
    case "1":
      window.location.replace("#StudentList");
      break;
    case "2":
      window.location.replace("#Transcript");
      break;
    case "3":
      window.location.replace("#Statistical");
      break;
    default:
      window.location.replace("");
      break;
  }
};

const HeaderClass = () => {
  const items = [
    { key: "1", label: "Student list" },
    { key: "2", label: "Transcript" },
    { key: "3", label: "Statistical" },
  ];

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: 0,
        margin: 0,
      }}
    >
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {items.map((item) => (
          <Menu.Item onClick={() => setChoose(item.key)} key={item.key}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </Header>
  );
};

export default HeaderClass;