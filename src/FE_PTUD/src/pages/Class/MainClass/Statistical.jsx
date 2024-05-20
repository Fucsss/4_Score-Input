import React, { useState, useEffect } from "react";
import { Card } from "antd";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sector, LineChart, Line
} from "recharts";
import axios from 'axios';

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{`${(percent * 100).toFixed(0)}%`}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
    </g>
  );
};

const Statistical = () => {
  const [data, setData] = useState({
    barData: [],
    pieData: [],
    lineData: [],
    additionalData: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/score/Statistic/', {
          headers: {
            Authorization: `Bearer your_token_here`
          },
          params: {
            MaLopHoc: 'your_class_id',
            TenThanhPhanDiem: 'your_component_name'
          }
        });
        const stats = response.data;
        setData({
          barData: [
            { name: 'Average Score', value: stats.average_score },
            { name: 'Highest Score', value: stats.max_score },
            { name: 'Lowest Score', value: stats.min_score }
          ],
          pieData: [
            { name: 'Pass', value: stats.pass_rate * 100 },
            { name: 'Fail', value: (1 - stats.pass_rate) * 100 }
          ],
          lineData: stats.trends,
          additionalData: stats.additional_data
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const cardStyle = {
    width: "100%",
    margin: "10px",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
  };

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
    gap: "20px",
    width: "100%",
    height: "100%", // Changed to '100%' to fit container height
    margin: "0 auto",
    padding: "0 10px"
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Class Statistics</h1>
      <div style={containerStyle}>
        <Card title="Bar Chart: Score Comparisons" style={cardStyle}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Pie Chart: Pass Rate" style={cardStyle}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.pieData}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                activeIndex={0}
                activeShape={renderActiveShape}
              >
                {data.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
            </ResponsiveContainer>
        </Card>
        <Card title="Line Chart: Score Trends" style={cardStyle}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Additional Chart" style={cardStyle}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.additionalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Statistical;

