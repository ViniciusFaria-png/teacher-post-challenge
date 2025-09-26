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
