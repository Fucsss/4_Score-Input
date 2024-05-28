import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../configs/axios-conf";

export const useUpdateFormula = () => {
  return useMutation({
    mutationFn: async (props: {
      MaLopHoc: string;
      formular: string;
      use_default: string;
    }) => {
      const token = localStorage.getItem("token");

      return (
        await axiosInstance.post(`score/UpdateFormular`, props, {
          headers: {
            Authorization: `Token ${token}`, // Add token to header
          },
        })
      ).data;
    },
  });
};

export const useUpdateScore = () => {
  return useMutation({
    mutationFn: async (props: {
      MaLopHoc: string;
      scores: [{ MaSinhVien: string; TenThanhPhanDiem: string; Diem: number }];
    }) => {
      const token = localStorage.getItem("token");

      return (
        await axiosInstance.post(`score/UpdateDiem/`, props, {
          headers: {
            Authorization: `Token ${token}`, // Add token to header
          },
        })
      ).data;
    },
  });
};

export const useGetScore = (MaLopHoc: string) => {
  const url = `score/GetDanhSachDiem/?MaLopHoc=${MaLopHoc}`;
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      return (
        await axiosInstance.get(url, {
          headers: {
            Authorization: `Token ${token}`, // Add token to header
          },
        })
      ).data;
    },
  });
};

export const useAddScore = () => {
  return useMutation({
    mutationFn: async (props: {
      MaLopHoc: string;
      scores: [{ MaSinhVien: string; TenThanhPhanDiem: string; Diem: number }];
    }) => {
      const token = localStorage.getItem("token");

      return (
        await axiosInstance.post(`score/AddDiem/`, props, {
          headers: {
            Authorization: `Token ${token}`, // Add token to header
          },
        })
      ).data;
    },
  });
};