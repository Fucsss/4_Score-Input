import React from "react";
import { Card, Typography } from "antd";
import Faker from "../../data/index.jsx";

const linkStyle = {
  textDecoration: "none",
  color: "#1890ff",
  cursor: "pointer",
  fontSize: "23px",
  whiteSpace: "normal",
};

const Dashboard = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography.Title level={6} style={{ textAlign: "center", flex: 1 }}>
          List of classes
        </Typography.Title>
        <PlusSquareOutlined
          style={{ fontSize: "45px", marginRight: "30px", cursor: "pointer" }}
          onClick={handleModalOpen}
        />
      </div>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {classes.map((classItem, index) => (
          <Card
            key={index}
            title={
              <a href="#" style={linkStyle}>
                {classItem.nameClass}
              </a>
            }
            style={{
              margin: "20px",
              padding: "10px",
              minWidth: "200px",
              maxWidth: "300px",
            }}
          >
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li
                key={index + "MaLopHoc"}
                style={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  marginBottom: "8px",
                }}
              >
                MaLopHoc: {classItem.MaLopHoc}
              </li>
              <li
                key={index + "TenLopHoc"}
                style={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  marginBottom: "8px",
                }}
              >
                TenLopHoc: {classItem.TenLopHoc}
              </li>
              <li
                key={index + "TenPhongHoc"}
                style={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  marginBottom: "8px",
                }}
              >
                TenPhongHoc: {classItem.TenPhongHoc}
              </li>
              <li
                key={index + "MaMonHoc"}
                style={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  marginBottom: "8px",
                }}
              >
                MaMonHoc: {classItem.MaMonHoc}
              </li>
              <li
                key={index + "NamHoc"}
                style={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  marginBottom: "8px",
                }}
              >
                NamHoc: {classItem.NamHoc}
              </li>
              <li
                key={index + "HocKy"}
                style={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  marginBottom: "8px",
                }}
              >
                HocKy: {classItem.HocKy}
              </li>
            </ul>
          </Card>
        ))}
      </div>

      <Modal
        title={<div style={{ textAlign: "center" }}>Add Class</div>}
        visible={isDBModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          {/* <Form.Item
            name="MaLopHoc"
            label="Mã Lớp Học"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã lớp học!",
              },
            ]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            name="TenLopHoc"
            label="Tên Lớp Học"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên lớp học!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="TenPhongHoc"
            label="Tên Phòng Học"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên phòng học!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="MaMonHoc"
            label="Mã Môn Học"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã môn học!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="TenMonHoc"
            label="Tên Môn Học"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a MonHoc and change the input text in SoTinChi, MaMonHoc"
              onChange={onGenderChange}
              allowClear
            >
              {subjects.map((subject) => (
                <Option key={subject.MaMonHoc} value={subject.TenMonHoc}>
                  {subject.TenMonHoc}
                </Option>
              ))}
            </Select>
          </Form.Item>

          

          <Form.Item
            name="SoTinChi"
            label="Số tín chỉ"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          {/* <Form.Item
            name="TenMonHoc"
            label="Tên Môn Học"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên môn học!",
              },
            ]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item
            name="NamHoc"
            label="Năm Học"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập năm học!",
              },
              {
                validator: validatePositiveNumber,
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="HocKy"
            label="Học Kỳ"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập học kỳ!",
              },
              {
                validator: validatePositiveNumber,
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
