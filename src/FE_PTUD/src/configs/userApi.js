import axiosInstance from "./axios-conf";

const userApi = {
    register(data) {
        const url = '/teacher/signup/';
        return axiosInstance.post(url, data);
    },

    login(data) {
        const url = '/teacher/login/';
        return axiosInstance.post(url, data);
    },
};

export default userApi;