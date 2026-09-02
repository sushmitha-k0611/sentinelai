import api from "./api";

export const getDashboardStats = async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
};

export const getFraudTypes = async () => {
    const response = await api.get("/dashboard/fraud-types");
    return response.data;
};

export const getStateAnalytics = async () => {
    const response = await api.get("/dashboard/state-analytics");
    return response.data;
};

export const getRecentReports = async () => {
    const response = await api.get("/dashboard/recent");
    return response.data;
};