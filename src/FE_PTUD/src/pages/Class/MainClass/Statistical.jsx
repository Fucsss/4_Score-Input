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

  // Key for bar data
  const barDataKey = 'value';

  // Styles for the Card component
  const cardStyle = {
    width: "80%",
    margin: "50px 100px",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
  };

  // Styles for list items
  const listItemStyle = {
    fontSize: "18px",
    marginBottom: "10px",
    fontWeight: "bold"
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Class Statistics</h1>
      <Card title={<span style={{ fontSize: "24px", fontWeight: "bold" }}>Cơ Sở Dữ Liệu</span>} style={cardStyle}>
        {/* Display statistical information */}
        <ul style={{ listStyleType: "none", padding: 0, textAlign: "left" }}>
          <li style={listItemStyle}>Average Score: 85</li>
          <li style={listItemStyle}>Highest Score: 100</li>
          <li style={listItemStyle}>Lowest Score: 70</li>
          <li style={listItemStyle}>Pass Rate: 90%</li>
        </ul>
        {/* Bar chart */}
        <div style={{ margin: '0 auto' }}> {/* Center the chart */}
          <ResponsiveContainer width="90%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Bar within the chart */}
              <Bar dataKey={barDataKey} fill="#8884d8" barSize={50} /> {/* Adjust the size of the bars */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Statistical;
