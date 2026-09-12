import apiClient from "../data/apiClient";

export const createDebt = async (data: any) => {
  const rest = await apiClient.post("/v1/debts", data);
  return rest.data;
};

export const getAllDebt = async () => {
  const rest = await apiClient.get("/v1/debts");
  return rest.data;
};

export const getTotalDebt = async () => {
  const rest = await apiClient.get("/v1/debts/totaldebts");
  return rest.data;
};

export const deleteDebt = async (id: number) => {
  const rest = await apiClient.delete(`/v1/debts/${id}`);
  return rest;
};

export const updateDebt = async (id: number, data: any) => {
  const rest = await apiClient.put(`/v1/debts/${id}`, data);
  return rest;
};
