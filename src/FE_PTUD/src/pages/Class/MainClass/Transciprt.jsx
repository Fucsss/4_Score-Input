import React, { useState, useEffect } from "react";
import { Button, Input, Popconfirm, Table } from "antd";
import { useMaLopHoc } from "../../../provider/authContext";
import DS_DiemSinhVienAPI from "../../../configs/DS_DiemSinhVienApi";

const Transcript = () => {
    const { maLopHoc } = useMaLopHoc();
    
    useEffect(() => {
        console.log(maLopHoc);

        const fetchDSDSV = async () => {
            const token = localStorage.getItem("token");
            console.log(`Token: ${token}`);
            try {
                const response = await DS_DiemSinhVienAPI.getAll(maLopHoc);
                console.log(response.data);

                const DSDiemSV = response.data;
                console.log(DSDiemSV);

                if (response.status === 200) {
                    setDataSource(
                        response.data.class_students.map((student, index) => ({
                            key: index.toString(),
                            STT: (index + 1).toString(),
                            MaSinhVien: student.MaSinhVien,
                            HoVaTen: student.HoVaTen,
                            TenKhoa: student.TenKhoa,
                            
                        }))
                    );
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchDSDSV();
    }, [maLopHoc]);
}

