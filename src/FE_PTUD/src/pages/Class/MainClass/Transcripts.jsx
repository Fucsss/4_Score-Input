import React, { useState, useEffect } from 'react';
import { Button, Input, Popconfirm, Table, Modal, Select, Upload, message } from 'antd';
import { useMaLopHoc } from "../../../provider/authContext";
import DS_DiemSinhVienAPI from "../../../configs/DS_DiemSinhVienApi";
import DS_SinhVienApi from "../../../configs/DS_SinhVienApi";
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const Transcript = () => {
  const { maLopHoc } = useMaLopHoc();
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([
    { title: 'STT', dataIndex: 'STT', width: '4%' },
    { title: 'MaSinhVien', dataIndex: 'MaSinhVien', width: '8%' },
    { title: 'HoVaTen', dataIndex: 'HoVaTen', width: 'auto' },
    { title: 'TenKhoa', dataIndex: 'TenKhoa', width: 'auto' },
    { title: 'ThuongKy', dataIndex: 'TK', width: 'auto' },
    { title: 'ThucHanh', dataIndex: 'TH', width: 'auto' },
    { title: 'GiuaKy', dataIndex: 'GK', width: 'auto' },
    { title: 'CuoiKy', dataIndex: 'CK', width: 'auto' },
    {
      title: 'Operation',
      dataIndex: 'operation',
      fixed: 'right',
      width: 'auto',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button type="primary" onClick={() => save(record.key)}>
              Save
            </Button>
          </span>
        ) : (
          <span>
            <Button onClick={() => edit(record.key)}>Edit</Button>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
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

  useEffect(() => {
    console.log(maLopHoc);

    const fetchDSSV = async () => {
      const token = localStorage.getItem("token");
      console.log(`Token: ${token}`);
      try {
        const response = await DS_DiemSinhVienAPI.getAll(maLopHoc);
        console.log(response.data);

        const LopHocList = response.data;
        // console.log(LopHocList);

        if (response.status === 200 && Array.isArray(response.data)) {
          setDataSource(
            response.data.map((student, score_columns, index) => ({
              key: index.toString(),
              STT: (index + 1).toString(),
              MaSinhVien: student.MaSinhVien,
              HoVaTen: student.HoVaTen,
              TenKhoa: student.TenKhoa,
              ThuongKy: score_columns.TK,
              ThucHanh: score_columns.TH,
              GiuaKy: score_columns.GK,
              CuoiKy: score_columns.CK,

            }))
          );
        }
      } catch (error) {
        console.error(error);

      }
    };
    fetchDSSV();
  }, [maLopHoc]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (key) => {
    setEditingKey(key);
  };

  const handleDelete = async (key) => {
    const studentToDelete = dataSource.find((item) => item.key === key);
    try {
      const response = await DS_DiemSinhVienAPI.remove({
        MaSinhVien: studentToDelete.MaSinhVien,
      });
      if (response.status === 200) {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
        setEditingKey('');
        message.success('Delete successful');
      } else {
        message.error('Delete failed');
      }
    } catch (error) {
      console.error(error);
      message.error('Delete failed');
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

  const save = () => {
    handleSave(record.key, dataIndex, inputValue);
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

  const getDanhsachDiem = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('MaLopHoc', maLopHoc);

    try {
      const response = await DS_DiemSinhVienAPI.addDiemByFile({ MaLopHoc: maLopHoc }, file);
      if (response.status === 200) {
        message.success('File uploaded successfully');
        const updatedData = response.data;
        if (updatedData && updatedData.student_scores) {
          setDataSource(updatedData.student_scores.map((item, index) => ({ key: index, ...item })));
          updateColumnsBasedOnData(updatedData.student_scores[0]);
        }
      } else {
        message.error('File upload failed: ' + response.statusText);
      }
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
      message.error('Error uploading file');
    }
  };

  // Function to dynamically update columns based on data keys
  const updateColumnsBasedOnData = (data) => {
    const newColumns = Object.keys(data).map(key => ({
      title: key,
      dataIndex: key,
      render: text => <span>{text}</span>
    }));
    setColumns(newColumns);
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
        customRequest={getDanhsachDiem} // Thay đổi ở đây
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
            <div onDoubleClick={() => handleHeaderDoubleClick(col.dataIndex, col.title)}>
              {col.title}
            </div>
          ) : col.title,
        }))}
        pagination={{ position: ['bottomCenter'] }}
        style={{ marginRight: '250px', marginLeft: '20px' }}
        scroll={{ y: 565 }}
      />
    </div>
  );
};

export default Transcript;
