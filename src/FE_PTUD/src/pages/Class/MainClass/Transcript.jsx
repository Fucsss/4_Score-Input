import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Popconfirm, Table, Modal, Form, message, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const Transcript = () => {
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([
    { title: 'STT', dataIndex: 'STT', width: '5%', editable: false, sorter: (a, b) => a.STT - b.STT },
    { title: 'MaSinhVien', dataIndex: 'MaSinhVien', width: 'auto', editable: true },
    { title: 'HoVaTen', dataIndex: 'HoVaTen', width: 'auto', editable: true },
    { title: 'TenKhoa', dataIndex: 'TenKhoa', width: 'auto', editable: true },
    { title: 'Email', dataIndex: 'Email', width: 'auto', editable: true },
    {
      title: 'Operation',
      fixed: 'right',
      width: 100,
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = record.MaSinhVien === editingKey;
        return editable ? (
          <span>
            <Button onClick={() => handleSave(record.MaSinhVien)} style={{ marginRight: 8 }}>Save</Button>
            <Popconfirm title="Sure to cancel?" onConfirm={handleCancel}>
              <Button>Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Button onClick={() => handleEdit(record.MaSinhVien)}>Edit</Button>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.MaSinhVien)}>
              <Button>Delete</Button>
            </Popconfirm>
          </span>
        );
      }
    }
  ]);
  const [editingKey, setEditingKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [newColumnName, setNewColumnName] = useState('');
  const [fileList, setFileList] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      message.error('No token found. Please log in.');
      return;
    }

    try {
      const { data } = await axios.get('http://127.0.0.1:8000/student/GetDanhSachSinhVien/', {
        headers: { Authorization: 'Token ${token}' }
      });
      setDataSource(data.class_students.map((item, index) => ({ ...item, STT: index + 1 })));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        message.error('Unauthorized. Please log in again.');
      } else {
        message.error('Error fetching data from server');
      }
    }
  };

  const handleEdit = (MaSinhVien) => {
    setEditingKey(MaSinhVien);
  };

  const handleCancel = () => {
    setEditingKey('');
  };

  const handleDelete = async (MaSinhVien) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      message.error('No token found. Please log in.');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/student/RemoveSinhVien/', { MaSinhVien }, {
        headers: { Authorization: `Token ${token}` }
      });
      message.success('Student successfully deleted.');
      fetchData();
    } catch (error) {
      message.error('Failed to delete student');
    }
  };

  const handleSave = async (MaSinhVien) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      message.error('No token found. Please log in.');
      return;
    }

    try {
      const row = await formRef.current.validateFields();
      await axios.post('http://127.0.0.1:8000/student/UpdateSinhVien/', { MaSinhVien, ...row }, {
        headers: { Authorization: `Token ${token}` }
      });
      message.success('Student successfully updated.');
      fetchData();
      setEditingKey('');
    } catch (error) {
      message.error('Failed to save student');
    }
  };

  const handleAddColumn = () => {
    const newColumnIndex = columns.length - 1;
    const newColumn = {
      title: `New Column ${newColumnIndex}`,
      dataIndex: `newColumn${newColumnIndex}`,
      editable: true,
      render: text => <Input defaultValue={text} />
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
      setColumns([...newColumns, columns[columns.length - 1]]);
    } else if (modalContent === 'renameColumn') {
      const newColumns = columns.map((col) => {
        if (col.dataIndex === selectedColumns[0]) {
          return { ...col, title: newColumnName };
        }
        return col;
      });
      setColumns([...newColumns.slice(0, -1), columns[columns.length - 1]]);
    }
    setIsModalVisible(false);
    setSelectedColumns([]);
    setNewColumnName('');
  };

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('authToken');
    if (!token) {
      message.error('No token found. Please log in.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/student/AddSinhVienByFile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`
        }
      });
      message.success(`${file.name} file uploaded successfully`);
      console.log('Response data:', response.data); // Log the response data
      setDataSource(response.data.class_students.map((item, index) => ({ ...item, STT: index + 1 })));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        message.error('Unauthorized. Please log in again.');
      } else {
        message.error(`${file.name} file upload failed`);
      }
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Transcript</h1>
      <Button type='primary' onClick={handleAddColumn} style={{ marginBottom: 16, marginLeft: "20px" }}>Add Column</Button>
      <Button type='primary' onClick={() => showModal('deleteColumn')} style={{ marginBottom: 16, marginLeft: "20px" }}>Delete Column</Button>
      <Button type='primary' onClick={() => showModal('renameColumn')} style={{ marginBottom: 16, marginLeft: "20px" }}>Rename Column</Button>
      <Upload customRequest={handleUpload} beforeUpload={() => false} accept=".csv, .xml">
        <Button type='primary' icon={<UploadOutlined />} style={{ marginBottom: 16, marginLeft: "20px" }}>Upload CSV</Button>
      </Upload>
      <Modal title={`${modalContent} Column`} visible={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)}>
        {modalContent === 'deleteColumn' && <Select mode="multiple" style={{ width: '100%' }} onChange={setSelectedColumns}>{columns.map(col => <Option key={col.dataIndex}>{col.title}</Option>)}</Select>}
        {modalContent === 'renameColumn' && (
          <>
            <Select style={{ width: '100%' }} onChange={setSelectedColumns}>{columns.map(col => <Option key={col.dataIndex}>{col.title}</Option>)}</Select>
            <Input style={{ marginTop: '5%' }} placeholder="New column name" value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} />
          </>
        )}
      </Modal>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="MaSinhVien"
        pagination={false}
        style={{ marginLeft: "20px", marginRight: "250px", width: "auto" }}
        scroll={{ x: 1000, y: 450 }} />
    </div>
  );
};

export default Transcript;
