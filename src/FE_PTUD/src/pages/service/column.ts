import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../configs/axios-conf";

export const useAddColumn = () => {
  return useMutation({
    mutationFn: async (data: {
      MaLopHoc: string;
      scores: {
        MaSinhVien: string;
        TenThanhPhanDiem: string;
        Diem: string;
      }[];
    }) => {
      const token = localStorage.getItem("token");
      return await axiosInstance.post(`score/UpdateDiem`, data, {
        headers: {
          Authorization: `Token ${token}`, // Add token to header
        },
      });
    },
  });
};

export const useRenameColumn = () => {
  return useMutation({
    mutationFn: async (data: {
      MaLopHoc: string;
      old_column_name: string;
      new_column_name: string;
    }) => {
      const token = localStorage.getItem("token");
      return await axiosInstance.post(`score/RenameColumn/`, data, {
        headers: {
          Authorization: `Token ${token}`, // Add token to header
        },
      });
    },
  });
};

export const useDeleteColumn = () => {
  return useMutation({
    mutationFn: async (data: { MaLopHoc: string; column_name: string }) => {
      const token = localStorage.getItem("token");
      return await axiosInstance.post(`score/DeleteColumn/`, data, {
        headers: {
          Authorization: `Token ${token}`, // Add token to header
        },
      });
    },
  });
};