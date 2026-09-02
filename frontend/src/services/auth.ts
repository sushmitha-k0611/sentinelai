import api from "./api";

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Register User
export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// Login User
export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};