import React from "react";
import { Card, Typography } from "antd";
import Faker from "../../data/index.jsx";

const linkStyle = {
  textDecoration: "none",
  color: "#1890ff",
  cursor: "pointer",
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
      <Typography.Title level={6}>List of classes</Typography.Title>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {Faker.ClassFaker.map((classItem) => (
          <Card
            key={classItem.IDClass}
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
              <li>IDClass: {classItem.IDClass}</li>
              <li>Student: {classItem.Student}</li>
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
