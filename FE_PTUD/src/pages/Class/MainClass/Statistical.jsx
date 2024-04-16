import React from "react";
import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const Statistical = () => {
  // Fake data 
  const data = [
    { name: 'Average Score', value: 85 },
    { name: 'Highest Score', value: 100 },
    { name: 'Lowest Score', value: 70 },
    { name: 'Pass Rate', value: 90 }
  ];

  // Kiểu dữ liệu cho thanh trong biểu đồ
  const barDataKey = 'value';

  // Styles cho Card
  const cardStyle = {
    width: "80%",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
  };

  
  const listItemStyle = {
    fontSize: "18px", 
    marginBottom: "10px", 
    fontWeight: "bold" 
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Class Statistics</h1>
      <Card title={<span style={{ fontSize: "24px", fontWeight: "bold" }}>Cơ Sở Dữ Liệu</span>} style={cardStyle}>
        {/* Hiển thị thông tin thống kê */}
        <ul style={{ listStyleType: "none", padding: 0, textAlign: "left" }}>
          <li style={listItemStyle}>Average Score: 85</li>
          <li style={listItemStyle}>Highest Score: 100</li>
          <li style={listItemStyle}>Lowest Score: 70</li>
          <li style={listItemStyle}>Pass Rate: 90%</li>
        </ul>
        {/* Biểu đồ cột */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Thanh trong biểu đồ */}
            <Bar dataKey={barDataKey} fill="#8884d8" barSize={50} /> {/* Điều chỉnh kích thước của cột */}
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Statistical;
