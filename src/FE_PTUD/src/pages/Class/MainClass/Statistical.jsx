import React, { useEffect, useState } from "react";
import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatisticalApi from "../../../configs/StatisticalApi";

const COLORS = ["#00C49F", "#FFBB28"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Statistical = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await StatisticalApi.getAll("LH00001");
      console.log(response.data); // Log data to console
      setData(response.data);
    };

    fetchData();
  }, []);

  const chartData = [
    { name: "Average Score", score: data.average_score },
    { name: "Highest Score", score: data.max_score },
    { name: "Lowest Score", score: data.min_score },
  ];

  const pieData = [
    { name: "Pass Rate", value: data?.pass_rate },
    { name: "Fail Rate", value: data?.fail_rate },
  ];

  // Styles cho Card
  const cardStyle = {
    width: "45%",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "30px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const listItemStyle = {
    fontSize: "18px",
    marginBottom: "10px",
    fontWeight: "bold",
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Class Statistics
      </h1>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Card
          title={
            <span style={{ fontSize: "24px", fontWeight: "bold" }}>
              Biểu đồ cột
            </span>
          }
          style={cardStyle}
        >
          {/* Hiển thị thông tin thống kê */}
          <ul style={{ listStyleType: "none", padding: 0, textAlign: "left" }}>
            <li style={listItemStyle}>
              Average Score:{" "}
              {data.average_score ? data.average_score.toFixed(2) : "Loading..."}
            </li>
            <li style={listItemStyle}>
              Highest Score:{" "}
              {data.max_score ? data.max_score.toFixed(2) : "Loading..."}
            </li>
            <li style={listItemStyle}>
              Lowest Score:{" "}
              {data.min_score ? data.min_score.toFixed(2) : "Loading..."}
            </li>
          </ul>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#8884d8" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card
          title={
            <span style={{ fontSize: "24px", fontWeight: "bold" }}>
              Biểu đồ tròn
            </span>
          }
          style={cardStyle}
        >
          <ResponsiveContainer width="100%" height={400}>
            <PieChart width={400} height={400}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Statistical;