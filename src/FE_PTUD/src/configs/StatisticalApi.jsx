import axiosInstance from "./axios-conf";

const StatisticalApi = {
  async getAll(maLopHoc) {
    const url = `/score/Statistic/?MaLopHoc=${maLopHoc}`;
    const token = localStorage.getItem("token"); // Get token from localStorage

    const config = {
      headers: {
        Authorization: `Token ${token}`, // Add token to header
      },
    };

    return await axiosInstance.get(url, config);
  },
};

export default StatisticalApi;