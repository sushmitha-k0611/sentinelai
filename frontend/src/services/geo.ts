import api from "./api";

export const getGeoReports = async () => {

    const response = await api.get("/geo/reports");

    return response.data;

};