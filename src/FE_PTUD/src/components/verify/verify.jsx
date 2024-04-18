import React from "react";
import { Input, Space, Typography, Button } from "antd";

const { Title } = Typography;

const Verify = () => {
  const onChange = (text) => {
    console.log("onChange:", text);
  };

  const sharedProps = {
    onChange,
  };

  const formStyle = {
    minWidth: "500px", // Đặt chiều rộng tối thiểu cho form
    minHeight: "500px",
    margin: "auto", // Đưa form vào giữa trang
    padding: "20px", // Thêm padding cho form
    backgroundColor: "#f0f2f5", // Màu nền cho form
    borderRadius: "20px", // Bo tròn các cạnh của form
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Đổ bóng cho form
    display: "flex", // Sử dụng flexbox
    flexDirection: "column", // Căn nội dung theo chiều dọc
    justifyContent: "center", // Căn giữa nội dung theo chiều dọc
    textAlign: "center", // Căn giữa nội dung trong form
  };

  const containerStyle = {
    display: "flex", // Sử dụng flexbox
    justifyContent: "center", // Căn giữa form theo chiều ngang
    minHeight: "100vh", // Chiều cao tối thiểu bằng chiều cao của viewport
    alignItems: "center", // Căn giữa form theo chiều dọc
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <Space direction="vertical" size="middle" align="center">
          <Title level={5}>Please enter the code here!</Title>
          <Input.OTP
            length={4}
            formatter={(str) => str.toUpperCase()}
            {...sharedProps}
            style={{ borderRadius: "4px" }} // Bo tròn các cạnh của input
          />
          <Button type="primary">Submit</Button>
        </Space>
      </div>
    </div>
  );
};

export default Verify;
