import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Input, Popconfirm, Table } from "antd";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

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
  const [count, setCount] = useState(2);
  const [editingKey, setEditingKey] = useState(""); // State để theo dõi key của dòng đang được chỉnh sửa

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
  };

  const handleAdd = () => {
    const newData = {
      key: count.toString(),
      STT: (count + 1).toString(),
      MSSV: `2012455${count}`,
      NameStudent: `Nguyen Van A${count}`,
      ClassSTD: `DHKHDL1${count}A `,
      Email: `NguyenVan${count}@gmail.com`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);

    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      setDataSource(newData);
      setEditingKey("");
    } else {
      newData.push(row);
      setDataSource(newData);
      setEditingKey("");
    }
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      width: "4%",
      align: "center",
      editable: true,
    },
    {
      title: "MSSV",
      dataIndex: "MSSV",
      width: "6%",
      editable: true,
    },
    {
      title: "NameStudent",
      dataIndex: "NameStudent",
      width: "10%",
      editable: true,
    },
    {
      title: "ClassSTD",
      dataIndex: "ClassSTD",
      width: "10%",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "Email",
      width: "15%",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: "15%",
      render: (_, record) => {
        const editable = isEditing(record);

        return editable ? (
          <span>
            <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </a>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={cancel}
            >
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <a onClick={() => edit(record.key)}>Edit</a> |{" "}
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <a>Delete</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ].map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave: handleSave,
    }),
  }));

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Student List</h1>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
          marginLeft: "20px",
        }}
      >
        Add a row
      </Button>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
        style={{ marginRight: "250px", marginLeft: "20px" }}
        scroll={{ y: 920 }}
        pagination={false}
      />
    </div>
  );
};

export default StudentList;
