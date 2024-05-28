import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../configs/axios-conf";

export const useGetStudents = (maLopHoc: string) => {
  const url = `/student/GetDanhSachSinhVien/?MaLopHoc=${maLopHoc}`;

  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage

      const config = {
        headers: {
          Authorization: `Token ${token}`, // Add token to header
        },
      };

      return (await axiosInstance.get(url, config)).data;
    },
  });
};
