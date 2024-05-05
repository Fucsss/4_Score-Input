import React, { useState } from "react";
import { Button, Input, Popconfirm, Table } from "antd";

const Transcript = () => {
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

  const [columns, setColumns] = useState([
    {
      title: "STT",
      dataIndex: "STT",
      width: "4%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <EditableCell
            value={record.STT}
            dataIndex="STT"
            record={record}
            handleSave={handleSave}
            editing={editable}
          />
        ) : (
          <div>{record.STT}</div>
        );
      },
    },
    {
      title: "MSSV",
      dataIndex: "MSSV",
      width: "6%",
      render: (_, record) => renderCell(record, "MSSV"),
    },
    {
      title: "NameStudent",
      dataIndex: "NameStudent",
      width: "20%",
      render: (_, record) => renderCell(record, "NameStudent"),
    },
    {
      title: "ClassSTD",
      dataIndex: "ClassSTD",
      width: "20%",
      render: (_, record) => renderCell(record, "ClassSTD"),
    },
    {
      title: "Email",
      dataIndex: "Email",
      width: "30%",
      render: (_, record) => renderCell(record, "Email"),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: "20%",
      render: (_, record) => renderOperation(record),
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
    setEditingKey(""); // Kết thúc chỉnh sửa sau khi xóa
  };

  const handleSave = (key, dataIndex, inputValue) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
  
    if (index > -1) {
      newData[index][dataIndex] = inputValue;
      setDataSource(newData);
      setEditingKey(""); // Kết thúc chỉnh sửa sau khi lưu
    }
  };

  const handleAddColumn = () => {
    const newColumnName = `NewColumn${columns.length}`;
    const newColumn = {
      title: newColumnName,
      dataIndex: newColumnName,
      width: "20%",
      render: (_, record) => renderCell(record, newColumnName),
    };

    const newDataSource = dataSource.map((item) => {
      return {
        ...item,
        [newColumnName]: `NewValue${item.key}`,
      };
    });

    setDataSource(newDataSource);
    setColumns([...columns, newColumn]);
  };

  const renderCell = (record, dataIndex) => {
    const editable = isEditing(record);
    return editable ? (
      <EditableCell
        value={record[dataIndex]}
        dataIndex={dataIndex}
        record={record}
        handleSave={handleSave}
      />
    ) : (
      <div>{record[dataIndex]}</div>
    );
  };

  const renderOperation = (record) => {
    const editable = isEditing(record);
  
    return editable ? (
      <span>
        {columns.map(({ dataIndex }) => (
          <Button
            type="primary"
            onClick={() => handleSave(record.key, dataIndex, record[dataIndex])}
            style={{ marginRight: 8 }}
          >
            Save
          </Button>
        ))}
        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
          <Button>Cancel</Button>
        </Popconfirm>
      </span>
    ) : (
      <span>
        <Button onClick={() => edit(record.key)} style={{ marginRight: 8 }}>
          Edit
        </Button>
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDelete(record.key)}
        >
          <Button>Delete</Button>
        </Popconfirm>
      </span>
    );
  };

  const EditableCell = ({ value, dataIndex, record, handleSave }) => {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (e) => {
      setInputValue(e.target.value);
    };

    const save = () => {
      handleSave(record.key, dataIndex, inputValue);
    };

    return (
      <Input
        value={inputValue}
        onChange={handleChange}
        onPressEnter={save}
        onBlur={save}
      />
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
      <Button onClick={handleAddColumn} style={{ marginBottom: 16, marginLeft: 20 }}>
        Add a column
      </Button>
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        style={{ marginRight: "250px", marginLeft: "20px" }}
        scroll={{ y: 320 }}
      />
    </div>
  );
};

export default Transcript;