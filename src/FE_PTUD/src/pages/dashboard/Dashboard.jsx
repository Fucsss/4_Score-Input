import React, { useEffect, useState } from "react";
import { Card, Typography, Modal, Form, Input, Button, Select } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import LopHocApi from "../../configs/LopHocApi.js";
import MonHocApi from "../../configs/MonHocApi.jsx";
import { Link } from "react-router-dom";
import { useMaLopHoc } from "../../provider/authContext.jsx";


const linkStyle = {
  textDecoration: "none",
  color: "#1890ff",
  cursor: "pointer",
  fontSize: "23px",
  whiteSpace: "normal",
};

const Dashboard = () => {
  const [isDBModalVisible, setIsDBModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const { maLopHoc, setMaLopHoc } = useMaLopHoc();

  const handleLinkClick = (maLopHoc) => {
    setMaLopHoc(maLopHoc);
    localStorage.setItem("maLopHoc", maLopHoc);
  };


  const handleModalOpen = () => {
    setIsDBModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsDBModalVisible(false);
  };

  const onFinish = async (values) => {
    console.log("Received values:", values);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is not available in local storage");
      }
      const response = await LopHocApi.add(values, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log(response);
      setClasses([...classes, values]);
      form.resetFields();
      setIsDBModalVisible(false);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        // Handle 401 error here by prompting user to login again or refresh the token
      }
    }
  };
  const validatePositiveNumber = (rule, value) => {
    return new Promise((resolve, reject) => {
      if (value && value <= 0) {
        reject("Vui lòng nhập số dương!");
      } else {
        resolve();
      }
    });
  };

  const onGenderChange = (value) => {
    const selectedSubjects = subjects.find(
      (subject) => subject.TenMonHoc === value
    );
    if (selectedSubjects) {
      form.setFieldsValue({
        SoTinChi: selectedSubjects.SoTinChi,
        MaMonHoc: selectedSubjects.MaMonHoc,
      });
    }
  };

  useEffect(() => {
    const fetchLopHocs = async () => {
      const token = localStorage.getItem("token");
      console.log(`Token: ${token}`);

      try {
        const response = await LopHocApi.getAll({
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const LopHocList = JSON.parse(response.data);
        console.log(LopHocList);
        setClasses(LopHocList.classes); // Gán dữ liệu từ API vào state classes
      } catch (error) {
        console.error(error);
      }
    };
    fetchLopHocs();
  }, []);

  useEffect(() => {
    const fetchMonHocs = async () => {
      const token = localStorage.getItem("token");
      console.log(`Token: ${token}`);

      try {
        const response = await MonHocApi.getAll({
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const MonHocList = JSON.parse(response.data);
        console.log(MonHocList);
        if (Array.isArray(MonHocList.subjects)) {
          setSubjects(MonHocList.subjects); // Set subjects to the array under the 'subjects' property
        } else {
          console.error("MonHocList.subjects is not an array:", MonHocList.subjects);
          // Handle the case where MonHocList.subjects is not an array
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMonHocs();
  }, []);



  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        overflow: "auto"
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
              <Link
                to={`/class#StudentList?MaLopHoc=${classItem.MaLopHoc}`}
                style={linkStyle}
                onClick={() => handleLinkClick(classItem.MaLopHoc)}
              >
                {classItem.TenMonHoc}
              </Link>
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
