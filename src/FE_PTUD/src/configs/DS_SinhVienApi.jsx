import axiosInstance from "./axios-conf";

const DS_SinhVienApi = {
    async getAll(maLopHoc) {
        const url = `/student/GetDanhSachSinhVien/?MaLopHoc=${maLopHoc}`;
        const token = localStorage.getItem("token"); // Get token from localStorage
    
        const config = {
            headers: {
                Authorization: `Token ${token}`, // Add token to header
            }
        };
    
        return await axiosInstance.get(url, config);
    },
  get(id) {
    const url = `/student/GetDanhSachSinhVien/${id}`;
    return axiosInstance.get(url);
  },

  async add(data) {
    const url = "/student/GetDanhSachSinhVien/";
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    const config = {
        headers: {
            Authorization: `Token ${token}` // Thêm token vào header
        }
    };
    return await axiosInstance.post(url, data, config);
},
  

  remove(id) {
    const url = `/student/GetDanhSachSinhVien/${id}`;
    return axiosInstance.delete(url);
  },
};

export default DS_SinhVienApi;
