import api from "./api";

export interface ReportData {
  user_id: number;
  victim_name: string;
  phone: string;
  email: string;
  fraud_type: string;
  amount: number;
  incident_date: string;
  description: string;
  evidence: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export const submitReport = async (data: ReportData) => {
  const response = await api.post("/reports/create", data);
  return response.data;
};

export const getReportHistory = async (userId: number) => {
  const response = await api.get(`/reports/history/${userId}`);
  return response.data;
};