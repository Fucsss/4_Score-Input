import axiosInstance from "./axios-conf";

const LopHocApi = {
  async getAll(config) {
    const url = "/classroom/GetDanhSachLopHoc/";
    //console.log(config);
    return await axiosInstance.get(url, config);
  },
  get(id) {
    const url = `/classroom/GetDanhSachLopHoc/${id}`;
    return axiosInstance.get(url);
  },

  async add(data) {
    const url = "/classroom/AddLopHoc/";
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    const config = {
        headers: {
            Authorization: `Token ${token}` // Thêm token vào header
        }
    };
    return await axiosInstance.post(url, data, config);
},
  

  remove(id) {
    const url = `/classroom/GetDanhSachLopHoc/${id}`;
    return axiosInstance.delete(url);
  },
};

export default LopHocApi;
