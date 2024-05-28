import axiosInstance from "./axios-conf";

export const upload = async (file, malophoc) => {
  const url = `/student/AddSinhVienByFile/`;
  const token = localStorage.getItem("token"); // Get token from localStorage

  const formData = new FormData();

  formData.append("file", file);
  formData.append("MaLopHoc", malophoc);
  formData.append("MaSinhVien", "123");
  formData.append("HoVaTen", "123");

  const config = {
    headers: {
      Authorization: `Token ${token}`, // Add token to header
      "Content-Type": "multipart/form-data",
    },
  };

  return await axiosInstance.post(url, formData, config);
};

export const uploadScore = async (file, malophoc) => {
  const url = `/score/AddDiemByFile/`;
  const token = localStorage.getItem("token"); // Get token from localStorage

  const formData = new FormData();

  formData.append("file", file);
  formData.append("MaLopHoc", malophoc);

  const config = {
    headers: {
      Authorization: `Token ${token}`, // Add token to header
      "Content-Type": "multipart/form-data",
    },
  };

  return await axiosInstance.post(url, formData, config);
};
