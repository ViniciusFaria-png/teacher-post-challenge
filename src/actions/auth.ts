import axiosInstance, { endpoints } from "../lib/axios";

export async function signUp(data: {
  email: string;
  senha: string;
  professorName?: string;
}) {
  const res = await axiosInstance.post(endpoints.user, data);
  return res.data;
}

export async function signIn(data: { email: string; senha: string }) {
  const res = await axiosInstance.post(`${endpoints.user}/signin`, data);
  // salva o token no localStorage
  localStorage.setItem("token", res.data.token);
  return res.data;
}

export async function getCurrentUser() {
  const res = await axiosInstance.get(`${endpoints.user}/me`);
  return res.data;
}

export async function validateToken() {
  try {
    const res = await axiosInstance.get(`${endpoints.user}/me`);
    return res.data;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    throw error;
  }
}
