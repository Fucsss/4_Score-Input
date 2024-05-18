import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Input, Table, Modal, Select } from "antd";

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
  ]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState();
  const [newColumnName, setNewColumnName] = useState("");
  const [count, setCount] = useState(dataSource.length);

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    if (index > -1) {
      const item = newData[index];
      if (JSON.stringify(item) !== JSON.stringify(row)) {
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
      }
    }
  };

  const handleAddRow = () => {
    const newData = {
      key: `${count}`,
      STT: `${count + 1}`,
      MSSV: `20124${count + 51}`,
      NameStudent: `Nguyen Van A${count + 1}`,
      ClassSTD: `DHKHDL1${count + 6}A`,
      Email: `NguyenVanA${count + 1}@gmail.com`,
      
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleDeleteColumn = () => {
    const updatedColumns = columns.filter((col, index) => index !== selectedColumnIndex);
    setColumns(updatedColumns);
    setIsDeleteModalVisible(false);
  };

  const handleAddColumn = () => {
    const newColumn = {
      title: `Column ${columns.length + 1}`,
      dataIndex: `column${columns.length + 1}`,
      width: "10%",
      editable: true,
    };
    setColumns([...columns, newColumn]);
  };

  const handleRenameColumn = () => {
    const updatedColumns = columns.map((col, idx) =>
      idx === selectedColumnIndex ? { ...col, title: newColumnName } : col
    );
    setColumns(updatedColumns);
    setIsRenameModalVisible(false);
    setNewColumnName(" ");
  };

  const showModal = () => {
    setIsDeleteModalVisible(true);
  };

  const showRenameModal = (index) => {
    setSelectedColumnIndex(index);
    setIsRenameModalVisible(true);
  };

  const handleCancel = () => {
    setIsDeleteModalVisible(false);
    setIsRenameModalVisible(false);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const mergedColumns = columns.map((col, index) => ({
    ...col,
    onCell: (record) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave: handleSave,
    }),
    onHeaderCell: () => ({
      onDoubleClick: () => {
        showRenameModal(index);
      },
    }),
  }));

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Transcript</h1>
      <Button onClick={handleAddRow} type="primary" style={{ marginBottom: 16, marginLeft: "20px" }}>
        Add a row
      </Button>
      <Button onClick={handleAddColumn} type="primary" style={{ marginBottom: 16, marginLeft: "20px" }}>
        Add a column
      </Button>
      <Button onClick={showModal} type="primary" style={{ marginBottom: 16, marginLeft: "20px" }}>
        Delete a column
      </Button>
      <Modal title="Delete a Column" visible={isDeleteModalVisible} onOk={handleDeleteColumn} onCancel={handleCancel}>
        <Select
          style={{ width: 120 }}
          onChange={setSelectedColumnIndex}
          placeholder="Select a column"
        >
          {columns.map((col, index) => (
            <Select.Option key={index} value={index}>{col.title}</Select.Option>
          ))}
        </Select>
      </Modal>
      <Button onClick={showRenameModal} type="primary" style={{ marginBottom: 16, marginLeft: "20px" }}>
        Rename Column
      </Button>
      <Modal title="Rename Column" visible={isRenameModalVisible} onOk={handleRenameColumn} onCancel={handleCancel}>
        <Select
          onChange={(value) => setSelectedColumnIndex(value)}
          placeholder="Select a column"
          style={{ marginBottom: 5, width: "auto" }}
        >
          {columns.map((col, index) => (
            <Select.Option key={index} value={index}>{col.title}</Select.Option>
          ))}
        </Select>
        <Input
          placeholder="New column name"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
        />
      </Modal>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={mergedColumns}
        style={{ marginRight: "250px", marginLeft: "20px" }}
        scroll={{x: 1200,  y: 600 }}
        pagination={false}
      />
    </div>
  );
};

export default Transcript;