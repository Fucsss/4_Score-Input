import axiosInstance from "./axios-conf";


const DS_DiemSinhVienAPI = {
  async getAll(maLopHoc) {
    const url = `/score/GetDanhSachDiem/?MaLopHoc=${maLopHoc}`;
    return await axiosInstance.get(url, getAuthConfig());
  },

  async get(id) {
    const url = `/score/GetDanhSachDiem/${id}`;
    return await axiosInstance.get(url, getAuthConfig());
  },

  async addDiemByFile(data, file) {
    const url = "/score/AddDiemByFile/";
    const formData = new FormData();
    formData.append('file', file);
    formData.append('MaLopHoc', data.MaLopHoc);
  
    try {
      const response = await axiosInstance.get(url, formData, getAuthConfig("multipart/form-data"));
      console.log('Response:', response);
      return response;
    } catch (error) {
      console.error('Error uploading file:', error);
      return error.response;
    }
  },
  

  async createNewColumnByFormula(data) {
    const url = "/score/CreateNewColumnByFormula/";
    return await axiosInstance.post(url, JSON.stringify(data), getAuthConfig());
  },

  async updateDiem(data) {
    const url = "/score/UpdateDiem/";
    return await axiosInstance.post(url, JSON.stringify(data), getAuthConfig());
  },
};

export default DS_DiemSinhVienAPI;
