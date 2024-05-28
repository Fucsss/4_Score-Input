import DS_SinhVienApi from "../../../configs/DS_SinhVienApi";

export const fetchDSSV = async (maLopHoc, callback) => {
  const token = localStorage.getItem("token");
  console.log(`Token: ${token}`);
  try {
    const response = await DS_SinhVienApi.getAll(maLopHoc);

    const LopHocList = response.data;

    if (response.status === 200) {
      callback(LopHocList);
    }
  } catch (error) {
    console.error(error);
  }
};
