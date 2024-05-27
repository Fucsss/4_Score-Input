import axiosInstance from "./axios-conf";

const DS_DiemSinhVienAPI = {
  async getAll(maLopHoc) {
    const url = `/score/GetDanhSachDiem/?MaLopHoc=${maLopHoc}`;
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    return await axiosInstance.get(url, config);
  },
  get(id) {
    const url = `/score/GetDanhSachDiem/${id}`;
    return axiosInstance.get(url);
  },
  async add(data) {
    const url = `/score/AddDiem/`;
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    };
    return await axiosInstance.post(url, data, config);
  },
  async update(data) {
    const url = `/score/UpdateDiem/`;
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    };
    return await axiosInstance.post(url, data, config);
  },
  async getScoreComponentsByFile(formData) {
    const url = "/score/AddDiemByFille";
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await axiosInstance.post(url, formData, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching score components by file:", error);
      throw error;
    }
  },
};

export default DS_DiemSinhVienAPI;
