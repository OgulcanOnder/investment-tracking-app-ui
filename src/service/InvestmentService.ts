import apiClient from "../data/apiClient";

export const createInvestment = async (data: any) => {
  const rest = await apiClient.post("/investment/v1", data);
  return rest.data;
};

export const getAllInvestment = async () => {
  const rest = await apiClient.get("/investment/v1");
  return rest.data;
};

export const getAllTotalInvestment = async () => {
  const rest = await apiClient.get("/investment/v1/totalassets");
  return rest.data;
};

export const updateInvestment = async (id: number, data: any) => {
  const rest = await apiClient.put(`/investment/v1/${id}`, data);
  return rest.data;
};

export const deleteInvestment = async (id: number) => {
  const rest = await apiClient.delete(`/investment/v1/${id}`);
  return rest;
};
