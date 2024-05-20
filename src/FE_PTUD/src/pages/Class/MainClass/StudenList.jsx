
import React, { useState } from "react";
import { Button, Input, Popconfirm, Table } from "antd";

const StudentList = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: "0",
      STT: "1",
      MSSV: "20124551",
      NameStudent: "Nguyen Van A1",
      ClassSTD: "DHKHDL16A",
      Email: "NguyenVanA1@gmail.com",
    },
    {
      key: "1",
      STT: "2",
      MSSV: "20124552",
      NameStudent: "Nguyen Van A2",
      ClassSTD: "DHKHDL17A",
      Email: "NguyenVanA2@gmail.com",
    },
  ]);

  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const edit = (key) => {
    setEditingKey(key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    setEditingKey(""); // Đảm bảo kết thúc chỉnh sửa nếu dòng đang được chỉnh sửa bị xóa
  };

  const handleSave = (key, dataIndex, value) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);

    if (index > -1) {
      newData[index][dataIndex] = value;
      setDataSource(newData);
      setEditingKey(""); // Kết thúc chỉnh sửa sau khi lưu
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      width: "4%",
      
    },
    {
      title: "MSSV",
      dataIndex: "MSSV",
      width: "6%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <EditableCell
            value={record.MSSV}
            dataIndex="MSSV"
            record={record}
            handleSave={handleSave}
            editing={editable}
          />
        ) : (
          <div>{record.MSSV}</div>
        );
      },
    },
    {
      title: "NameStudent",
      dataIndex: "NameStudent",
      width: "20%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <EditableCell
            value={record.NameStudent}
            dataIndex="NameStudent"
            record={record}
            handleSave={handleSave}
            editing={editable}
          />
        ) : (
          <div>{record.NameStudent}</div>
        );
      },
    },
    {
      title: "ClassSTD",
      dataIndex: "ClassSTD",
      width: "20%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <EditableCell
            value={record.ClassSTD}
            dataIndex="ClassSTD"
            record={record}
            handleSave={handleSave}
            editing={editable}
          />
        ) : (
          <div>{record.ClassSTD}</div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "Email",
      width: "30%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <EditableCell
            value={record.Email}
            dataIndex="Email"
            record={record}
            handleSave={handleSave}
            editing={editable}
          />
        ) : (
          <div>{record.Email}</div>
        );
      },
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: "20%",
      render: (_, record) => {
        const editable = isEditing(record);

        return editable ? (
          <span>
            <Button type="primary" onClick={() => handleSave(record.key)}>Save</Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button>Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Button onClick={() => edit(record.key)}>Edit</Button>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button>Delete</Button>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const EditableCell = ({ value, dataIndex, record, handleSave, editing }) => {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (e) => {
      setInputValue(e.target.value);
    };

    const save = () => {
      handleSave(record.key, dataIndex, inputValue);
    };

    return editing ? (
      <Input value={inputValue} onChange={handleChange} onPressEnter={save} onBlur={save} />
    ) : (
      <div>{value}</div>
    );
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Student List</h1>
      <Button
        onClick={() => {
          const count = dataSource.length;
          const newData = {
            key: count.toString(),
            STT: (count + 1).toString(),
            MSSV: `2012455${count}`,
            NameStudent: `Nguyen Van A${count}`,
            ClassSTD: `DHKHDL1${count}A`,
            Email: `NguyenVan${count}@gmail.com`,
          };
          setDataSource([...dataSource, newData]);
        }}
        type="primary"
        style={{ marginBottom: 16, marginLeft: 20 }}
      >
        Add a row
      </Button>
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        style={{ marginRight: "250px", marginLeft: "20px" }}
        scroll={{ y: 920 }}
      />
    </div>
  );
};

export default StudentList;
