import React, { useState, useEffect } from "react";
import { Button, Input, Popconfirm, Table, Modal, Select, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useMaLopHoc } from "../../../provider/authContext";
import DS_DiemSinhVienAPI from "../../../configs/DS_DiemSinhVienApi";

const { Option } = Select;

const Transcript = () => {
  const { maLopHoc } = useMaLopHoc();
  const [dataSource, setDataSource] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [newColumnName, setNewColumnName] = useState('');
  const [columns, setColumns] = useState([
    {
      title: "STT",
      dataIndex: "STT",
      width: "4%",
    },
    {
      title: "MaSinhVien",
      dataIndex: "MaSinhVien",
      width: "8%",
      editable: true,
    },
    {
      title: "HoVaTen",
      dataIndex: "HoVaTen",
      width: "20%",
      editable: true,
    },
    {
      title: "TenKhoa",
      dataIndex: "TenKhoa",
      width: "20%",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      fixed: 'right',
      width: "20%",
    },
  ]);

  useEffect(() => {
    const fetchDSDSV = async () => {
      const token = localStorage.getItem("token");
      console.log(`Token: ${token}`);
      try {
        const response = await DS_DiemSinhVienAPI.getAll(maLopHoc);
        console.log(response.data);

        
        if (response.status === 200 && Array.isArray(response.data)) {
          const { score_columns, student_scores } = response.data;
  
          // Tạo cột mới dựa trên score_columns từ API
          const dynamicColumns = score_columns.map(column => ({
            title: column,
            dataIndex: column,
            width: 10,
            editable: true,
          }));
  
          // Cập nhật cột trong bảng
          setColumns([
            ...columns.slice(0, columns.length - 1), // bỏ cột operation
            ...dynamicColumns,
            columns[columns.length - 1] // thêm lại cột operation
          ]);
  
          // Cập nhật dataSource
          setDataSource(
            student_scores.map((score, index) => ({
              key: index.toString(),
              STT: (index + 1).toString(),

              ...score,
            }))
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDSDSV();
  }, [maLopHoc]);
  

  const isEditing = (record) => record.key === editingKey;

  const handleDelete = async (key) => {
    const studentToDelete = dataSource.find((item) => item.key === key);
    try {
      const response = await DS_DiemSinhVienAPI.remove({
        MaSinhVien: studentToDelete.MaSinhVien,
      });
      if (response.status === 200) {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
        setEditingKey("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (key, dataIndex, value) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);

    if (index > -1) {
      const item = newData[index];
      item[dataIndex] = value;
      setDataSource(newData);
      setEditingKey('');

      try {
        const response = await DS_DiemSinhVienAPI.update(item);
        if (response.status === 200) {
          message.success('Update successful');
        } else {
          console.error('Failed to update data on the server');
          message.error('Update failed');
        }
      } catch (error) {
        console.error(error);
        message.error('Update failed');
      }
    }
  };

  const EditableCell = ({ value, dataIndex, record, handleSave, editing }) => {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (e) => {
      setInputValue(e.target.value);
    };

    const save = () => {
      handleSave(record.key, dataIndex, inputValue);
    };

    return editing ? (
      <Input
        value={inputValue}
        onChange={handleChange}
        onPressEnter={save}
        onBlur={save}
      />
    ) : (
      <div>{value}</div>
    );
  };

  const handleAddColumn = () => {
    const newColumnIndex = columns.length - 1;
    const newColumn = {
      title: `New Column ${newColumnIndex}`,
      dataIndex: `newColumn${newColumnIndex}`,
      editable: true,
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <EditableCell
            value={record[`newColumn${newColumnIndex}`]}
            dataIndex={`newColumn${newColumnIndex}`}
            record={record}
            handleSave={handleSave}
            editing={editable}
          />
        ) : (
          <div>{record[`newColumn${newColumnIndex}`]}</div>
        );
      }
    };
    setColumns([...columns.slice(0, -1), newColumn, columns[columns.length - 1]]);
  };

  const showModal = (action) => {
    setModalContent(action);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (modalContent === 'deleteColumn') {
      const newColumns = columns.filter((col) => !selectedColumns.includes(col.dataIndex));
      setColumns(newColumns);
    } else if (modalContent === 'renameColumn') {
      const newColumns = columns.map((col) => {
        if (col.dataIndex === selectedColumns[0]) {
          return { ...col, title: newColumnName };
        }
        return col;
      });
      setColumns(newColumns);
    }
    setIsModalVisible(false);
    setSelectedColumns([]);
    setNewColumnName('');
  };

  const handleHeaderDoubleClick = (dataIndex, newTitle) => {
    const newColumns = columns.map((col) => {
      if (col.dataIndex === dataIndex) {
        return { ...col, title: newTitle };
      }
      return col;
    });
    setColumns(newColumns);
  };

  const handleFileUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      // Process the contents of the file here (parse CSV, etc.)
      // After processing, update the dataSource
    };
    reader.readAsText(file);
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Transcript List</h1>
      <Button type='primary' onClick={handleAddColumn} style={{ marginBottom: 16, marginLeft: 20 }}>Add Column</Button>
      <Button type='primary' onClick={() => showModal('deleteColumn')} style={{ marginBottom: 16, marginLeft: 20 }}>Delete Column</Button>
      <Button type='primary' onClick={() => showModal('renameColumn')} style={{ marginBottom: 16, marginLeft: 20 }}>Rename Column</Button>
      <Upload
        accept=".csv"
        customRequest={handleFileUpload}
        showUploadList={false}
      >
        <Button style={{ marginBottom: 16, marginLeft: 20 }} icon={<UploadOutlined />}>Upload File</Button>
      </Upload>
      <Modal
        title={`${modalContent === 'deleteColumn' ? 'Delete' : 'Rename'} Column`}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        {modalContent === 'deleteColumn' && (
          <Select mode="multiple" style={{ width: '100%' }} onChange={setSelectedColumns}>
            {columns.map((col) => col.dataIndex !== 'operation' && <Option key={col.dataIndex}>{col.title}</Option>)}
          </Select>
        )}
        {modalContent === 'renameColumn' && (
          <>
            <Select style={{ width: '100%' }} onChange={setSelectedColumns}>
              {columns.map((col) => col.dataIndex !== 'operation' && <Option key={col.dataIndex}>{col.title}</Option>)}
            </Select>
            <Input
              style={{ marginTop: '5%' }}
              placeholder="New column name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
          </>
        )}
      </Modal>
      <Table
        bordered
        dataSource={dataSource}
        columns={mergedColumns.map((col) => ({
          ...col,
          title: col.dataIndex !== 'operation' ? (
            <div onDoubleClick={() => handleHeaderDoubleClick(col.dataIndex, col.title)}>{col.title}</div>
          ) : (
            col.title
          ),
        }))}
        rowClassName="editable-row"
        pagination={false}
        scroll={{ y: 565 }}
      />
    </div>
  );
};

export default Transcript;
