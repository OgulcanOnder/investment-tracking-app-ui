import apiClient from "../data/apiClient";
import axios from "axios";
import { Register } from "../data/register";
import { Login } from "../data/login";
import { ForgotPassword } from "../data/ForgotPassword";
import { ResetPassword } from "../data/ResetPassword";
import { UpdatePassword } from "../data/UpdatePassword";

const BASE_URL = "http://192.168.1.108:8080/api";

export const register = async (data: Register) => {
  const rest = await apiClient.post("/v1/auth/register", data);
  return rest.data;
};

export const login = async (data: Login) => {
  const rest = await axios.post(`${BASE_URL}/v1/auth/login`, data);
  return rest.data;
};

export const logout = async () => {
  await apiClient.post("/v1/auth/logout");
};

export const forgotPassword = async (data: ForgotPassword) => {
  const rest = await apiClient.post("/v1/auth/forgot-password", data);
  return rest.data;
};

export const resetPassword = async (data: ResetPassword) => {
  const rest = await apiClient.post("/v1/auth/reset-password", data);
  return rest.data;
};

export const profile = async () => {
  const rest = await apiClient.get("/v1/auth/profile");
  return rest.data;
};

export const updatePassword = async (data: UpdatePassword) => {
  const rest = await apiClient.put("/v1/auth/update-password", data);
  return rest.data;
};
