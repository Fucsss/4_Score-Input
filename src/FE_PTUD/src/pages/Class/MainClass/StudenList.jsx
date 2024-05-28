import React, { useState, useEffect } from "react";
import { Button, Input, Popconfirm, Table, Form } from "antd";
import { useMaLopHoc } from "../../../provider/authContext";
import DS_SinhVienApi from "../../../configs/DS_SinhVienApi";
import { fetchDSSV } from "./fetchDSSV";
import { render } from "react-dom";
import { CSVDownload, CSVLink } from "react-csv";
import { upload } from "../../../configs/upload";

const EditableCell = ({
  title,
  value,
  dataIndex,
  editing,
}) => {

  return editing ? (
    <Form.Item
      name={dataIndex}
      style={{ margin: 0 }}
      rules={[
        {
          required: true,
          message: `Please input ${title}!`,
        },
      ]}
    >
      <Input
      />
    </Form.Item>
  ) : (
    <div>{value}</div>
  );
};

const StudentList = () => {
  const { maLopHoc } = useMaLopHoc();

  const [dataSource, setDataSource] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const [csv, setCSV] = useState([])
  const [f, setF] = useState(false)

  const isEditing = (record) => record.key === editingKey;

  const edit = (key) => {
    setEditingKey(key);
    form.setFieldsValue({
      MaSinhVien: '',
      HoVaTen: '',
      TenKhoa: '',
      Email: '',
      ...dataSource.find((item) => item.key === key),
    });
  };

  const cancel = () => {
    setEditingKey("");
  };

  const handleDelete = async (key) => {
    const studentToDelete = dataSource.find((item) => item.key === key);
    try {
      const response = await DS_SinhVienApi.remove({
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

  const handleSave = async (data) => {
    try {
      await form.validateFields();

      const newData = dataSource.map(d => {
        if (d.key === data.key) {
          return data
        }

        return d
      })
      setDataSource([...newData])
      setEditingKey("");

      // Call the update API
      try {
        const response = await DS_SinhVienApi.update(data);
        if (response.status !== 200) {
          console.error("Failed to update data on the server");
        }
      } catch (error) {
        console.error(error);
      }

    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      width: "4%",
      render: (_, record) => {
        return <Form.Item name={"key"} style={{ margin: 0, textAlign: "center" }}>{Number(record.key) + 1}</Form.Item>
      }
    },
    {
      title: "Ma Sinh Vien",
      dataIndex: "MaSinhVien",
      width: "15%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <EditableCell
            title="MaSinhVien"
            value={record.MaSinhVien}
            dataIndex="MaSinhVien"
            editing={editable}
          />
        ) : (
          <div>{record.MaSinhVien}</div>
        );
      },
    },
    {
      title: "Ho Va Ten",
      dataIndex: "HoVaTen",
      width: "20%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <EditableCell
            title="HoVaTen"
            value={record.HoVaTen}
            dataIndex="HoVaTen"
            editing={editable}
          />
        ) : (
          <div>{record.HoVaTen}</div>
        );
      },
    },
    {
      title: "Ten Khoa",
      dataIndex: "TenKhoa",
      width: "20%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <EditableCell
            title="TenKhoa"
            value={record.TenKhoa}
            dataIndex="TenKhoa"
            editing={editable}
          />
        ) : (
          <div>{record.TenKhoa}</div>
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
            title="Email"
            value={record.Email}
            dataIndex="Email"
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
          <span style={{ display: 'flex', gap: "10px" }}>
            <Form.Item style={{ margin: 0 }}>
              <Button type="primary" htmlType="submit"
              >
                Save
              </Button>
            </Form.Item>

            <Button onClick={cancel}>Cancel</Button>
          </span>
        ) : (
          <span style={{ display: 'flex', gap: "10px" }}>
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

  const getCSVFile = () => {
    const data = dataSource.map(d => {
      return [d.STT, d.MaSinhVien, d.HoVaTen, d.TenKhoa, d.Email]
    })


    return [["STT", "MaSinhVien", "HoVaTen", "TenKhoa", "Email"], ...data]
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    try {
      await upload(file, maLopHoc)
      setF(!f)
    } catch (error) {
      console.log(error)
    } finally {
      e.target.value = null
    }
  }

  useEffect(() => {
    fetchDSSV(maLopHoc, (response) => {
      setDataSource(
        response.class_students.map((student, index) => ({
          key: index.toString(),
          STT: (index + 1).toString(),
          MaSinhVien: student.MaSinhVien,
          HoVaTen: student.HoVaTen,
          TenKhoa: student.TenKhoa,
          Email: student.Email,
        }))
      );
    });
  }, [maLopHoc, f]);

  useEffect(() => {
    const data = getCSVFile()
    setCSV(data)
  }, [dataSource])


  return (
    <div style={{ marginLeft: "30px" }}>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Student List</h1>
      <div style={{ display: "flex", gap: "10px" }}>
        <Button
          onClick={async () => {
            const count = dataSource.length;
            const newData = {
              key: count.toString(),
              STT: (count + 1).toString(),
              MaLopHoc: maLopHoc,
              HoVaTen: `Nguyen Van A${count}`,
              Email: `NguyenVan${count}@gmail.com`,
              TenKhoa: `CNPM`,
              SDT: "0902705024",
              MaSinhVien: `SV201133${count}`,
            };
            try {
              const response = await DS_SinhVienApi.add(newData);
              if (response.status === 200) {
                setDataSource([...dataSource, newData]);
              }
            } catch (error) {
              console.error(error);
            }
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a row
        </Button>
        <Button type="primary" style={{ padding: 0 }}>
          <label htmlFor={"fileSelect"} style={{ margin: "4px 15px" }}>Upload</label>
          <input onChange={handleUpload} hidden id="fileSelect" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        </Button>
        <Button type="primary">
          <CSVLink
            target="_blank"
            filename={"student_list.csv"}
            data={csv}
          > Download</CSVLink>
        </Button>
      </div>

      <Form form={form} onFinish={(data) => {
        handleSave(data)
      }}>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          style={{ marginRight: "50px" }}
        />
      </Form>
    </div>
  );
};

export default StudentList;
