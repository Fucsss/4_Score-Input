import axiosInstance from "./axios-conf";

const MonHocApi = {
  async getAll(config) {
    const url = "/subject/GetDanhSachMonHoc/";
    //console.log(config);
    return await axiosInstance.get(url, config);
  },
  get(id) {
    const url = `/subject/GetDanhSachMonHoc/${id}`;
    return axiosInstance.get(url);
  },
  add(data) {
    const url = "/subject/GetDanhSachMonHoc/";
    return axiosInstance.post(url, data);
  },
  remove(id) {
    const url = `/subject/GetDanhSachMonHoc/${id}`;
    return axiosInstance.delete(url);
  },
};

export default MonHocApi;
