import axiosClient from "./axiosClient";

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/api/files/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const registerUser = (userData) => {
    return axiosClient.post("/api/auth/register", userData);
};

export const getPendingUsers = () => {
    return axiosClient.get("/api/admin/pending-users");
};

export const approveUser = (userId) => {
    return axiosClient.post(`/api/admin/users/${userId}/approve`);
};

export const rejectUser = (userId) => {
    return axiosClient.post(`/api/admin/users/${userId}/reject`);
};
