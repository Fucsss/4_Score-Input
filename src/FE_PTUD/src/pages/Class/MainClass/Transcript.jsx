import React, { useEffect, useState } from "react";
import { Button, Form, Input, Table, Modal, Select, Checkbox } from "antd";
import { CSVLink } from "react-csv";
import { useMaLopHoc } from "../../../provider/authContext";
import { useGetStudents } from "../../service/student";
import { useGetScore, useUpdateFormula, useUpdateScore } from "../../service/score";
import { useDeleteColumn, useRenameColumn } from "../../service/column";

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
      <Input id="number" type="number" min="0" max="10" step="0.5" />
    </Form.Item>
  ) : (
    <div>{value}</div>
  );
};

const columnsTemp = [
  {
    title: "STT",
    dataIndex: "STT",
    width: "4%",
    align: "center",
    editable: false,
  },
  {
    title: "Ma Sinh Vien",
    dataIndex: "MaSinhVien",
    width: "6%",
    editable: false,
    render: (_, prop) => {
      return (
        <Form.Item name={"MaSinhVien"} style={{ margin: 0 }}>
          {prop.MaSinhVien}
        </Form.Item>
      );
    },
  },
  {
    title: "Ho Va Ten",
    dataIndex: "HoVaTen",
    width: "10%",
    editable: true,
  },
  {
    title: "Ten Khoa",
    dataIndex: "TenKhoa",
    width: "10%",
    editable: true,
  },
];

const Transcript = () => {
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState(columnsTemp);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState();
  const [isSummary, setIsSummary] = useState(false);
  const [formular, setFormular] = useState("");
  const [newColumnName, setNewColumnName] = useState("");
  const [oldColumnName, setOldColumnName] = useState("");
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const [csv, setCSV] = useState([]);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const { maLopHoc } = useMaLopHoc();
  const { data: students } = useGetStudents(maLopHoc);
  const { data: scores, refetch } = useGetScore(maLopHoc);
  const { mutate: updateScore } = useUpdateScore(maLopHoc);
  const { mutate: renameColumn } = useRenameColumn();
  const { mutate: deleteColumn } = useDeleteColumn();
  const { mutate: updateFormula } = useUpdateFormula();

  const isEditing = (record) => record.key === editingKey;

  const edit = (key) => {
    setEditingKey(key);
    form.setFieldsValue({
      ...dataSource.find((item) => item.key === key),
    });
  };

  const cancel = () => {
    setEditingKey("");
  };

  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
    if (!e.target.checked) {
      setFormular("(CK+TH+TK1+TH1)/5"); // Set to default formular
    }
  };

  const handleSave = (data) => {
    let arr = Object.entries(data);
    const [_, msv] = arr[0];
    arr = arr.slice(1, arr.length);
    const sc = arr.map(([key, value]) => {
      return {
        MaSinhVien: msv,
        TenThanhPhanDiem: key,
        Diem: value,
      };
    });
    updateScore(
      {
        MaLopHoc: maLopHoc,
        scores: sc,
      },
      {
        onSuccess: () => {
          refetch();
          setEditingKey("");
        },
        onError: () => {
          refetch();
          setEditingKey("");
        },
      }
    );
  };

  const handleDeleteColumn = () => {
    deleteColumn(
      {
        MaLopHoc: maLopHoc,
        column_name: oldColumnName,
      },
      {
        onSuccess: () => {
          refetch();
          setIsRenameModalVisible(false);
          setOldColumnName("");
          setNewColumnName("");
        },
      }
    );
  };

  const handleAddColumn = () => {
    const newColumn = {
      title: `Column ${columns.length + 1}`,
      dataIndex: `column${columns.length + 1}`,
      width: "10%",
      editable: true,
    };
    setColumns([
      ...columns.slice(0, columns.length - 2),
      newColumn,
      ...columns.slice(columns.length - 2),
    ]);
  };

  const handleRenameColumn = () => {
    if (isSummary) {
      updateFormula(
        {
          MaLopHoc: maLopHoc,
          formular: formular,
          use_default: isCheckboxChecked ? "True" : "False",
        },
        {
          onSuccess: () => {
            refetch();
            setIsSummary(false);
            setIsRenameModalVisible(false);
          },
          onError: () => {
            refetch();
            setIsSummary(false);
            setIsRenameModalVisible(false);
          },
        }
      );
    } else {
      renameColumn(
        {
          MaLopHoc: maLopHoc,
          old_column_name: oldColumnName,
          new_column_name: newColumnName,
        },
        {
          onSuccess: () => {
            refetch();
            setIsRenameModalVisible(false);
            setOldColumnName("");
            setNewColumnName("");
          },
        }
      );
    }
  };

  const showRenameModal = (index) => {
    setSelectedColumnIndex(index);
    setIsRenameModalVisible(true);
  };

  const handleCancel = () => {
    setOldColumnName("");
    setNewColumnName("");
    setIsSummary(false);
    setIsDeleteModalVisible(false);
    setIsRenameModalVisible(false);
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
        if (col.title === scores?.TongKet?.TenCot) {
          setIsSummary(true);
        } else {
          setOldColumnName(col.title);
        }
        showRenameModal(index);
      },
    }),
  }));

  const getCSVFile = () => {
    const data = dataSource.map((d, index) => {
      if (scores) {
        return [
          d.MaSinhVien,
          ...Object.values(scores.student_scores[index]?.Scores ?? { a: 0, b: 0 }).map((a) => a),
          scores.TongKet.Scores[index].Final_score ?? 0,
        ];
      } else {
        return [d.MaSinhVien];
      }
    });
    if (scores) {
      return [["MaSinhVien", ...Object.keys(scores.score_columns), "TK"], ...data];
    }
    return [];
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    try {
      await uploadScore(file, maLopHoc);
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      e.target.value = null;
    }
  };

  useEffect(() => {
    if (students && scores) {
      setFormular(scores.TongKet.Formula);
      setColumns([
        ...columnsTemp,
        ...Object.keys(scores.score_columns).map((key) => {
          return {
            title: key,
            dataIndex: key,
            width: "20%",
            editable: true,
            render: (_, record) => {
              const editable = isEditing(record);
              return editable ? (
                <EditableCell
                  title={key}
                  value={record[key] ?? 0}
                  dataIndex={key}
                  editing={editable}
                />
              ) : (
                <div>{record[key] ?? 0}</div>
              );
            },
          };
        }),
        {
          title: scores.TongKet.TenCot,
          dataIndex: "Final_score",
          width: "10%",
          editable: false,
        },
        {
          title: "Action",
          dataIndex: "action",
          render: (_, record) => {
            const editable = isEditing(record);
            return editable ? (
              <span style={{ display: "flex", gap: "10px" }}>
                <Form.Item style={{ margin: 0 }}>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
                <Button onClick={cancel}>Cancel</Button>
              </span>
            ) : (
              <span style={{ display: "flex", gap: "10px" }}>
                <Button onClick={() => edit(record.key)}>Edit</Button>
              </span>
            );
          },
        },
      ]);
      setDataSource(
        students.class_students.map((student, index) => ({
          key: index.toString(),
          STT: (index + 1).toString(),
          MaSinhVien: student.MaSinhVien,
          HoVaTen: student.HoVaTen,
          TenKhoa: student.TenKhoa,
          Email: student.Email,
          ...scores.student_scores[index].Scores,
          Final_score: scores.TongKet.Scores[index].Final_score,
        }))
      );
    }
  }, [students, scores, editingKey]);

  useEffect(() => {
    const data = getCSVFile();
    setCSV(data);
  }, [dataSource]);

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>Transcript</h1>
      <Button
        onClick={handleAddColumn}
        type="primary"
        style={{ marginBottom: 16, marginLeft: "20px" }}
      >
        Add a column
      </Button>
      <Modal
        title="Delete a Column"
        visible={isDeleteModalVisible}
        onOk={handleDeleteColumn}
        onCancel={handleCancel}
      >
        <Select
          style={{ width: 120 }}
          onChange={setSelectedColumnIndex}
          placeholder="Select a column"
        >
          {columns.map((col, index) => (
            <Select.Option key={index} value={index}>
              {col.title}
            </Select.Option>
          ))}
        </Select>
      </Modal>
      <Button
        type="primary"
        style={{ marginBottom: 16, marginLeft: "20px" }}
      >
        <label htmlFor={"fileSelect"}>Upload</label>
        <input
          onChange={handleUpload}
          hidden
          id="fileSelect"
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
      </Button>
      <Button type="primary" style={{ marginBottom: 16, marginLeft: "20px" }}>
        <CSVLink target="_blank" filename={"transcript.csv"} data={csv}>
          {" "}
          Download
        </CSVLink>
      </Button>
      <Modal
        title="Column Action"
        visible={isRenameModalVisible}
        onOk={handleRenameColumn}
        onCancel={handleCancel}
      >
        <Input
          placeholder={isSummary ? "Formular" : "New column name"}
          value={isSummary ? formular : newColumnName}
          onChange={(e) => {
            if (isSummary) {
              setFormular(e.target.value);
            } else {
              setNewColumnName(e.target.value);
            }
          }}
        />
        {isSummary && (
          <Checkbox checked={isCheckboxChecked} onChange={handleCheckboxChange}>
            Use default formula
          </Checkbox>
        )}
        {!isSummary && (
          <>
            <p style={{ margin: "10px 0" }}>Or</p>
            <Button onClick={handleDeleteColumn}>Delete column</Button>
          </>
        )}
      </Modal>
      <Form
        form={form}
        onFinish={(data) => {
          handleSave(data);
        }}
      >
        <Table
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={mergedColumns}
          style={{ marginLeft: "20px", marginRight: "20px" }}
          pagination={false}
        />
      </Form>
    </div>
  );
};

export default Transcript;
