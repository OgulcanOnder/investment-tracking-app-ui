import apiClient from "../data/apiClient";

export const createInvestment = async (data: any) => {
  const rest = await apiClient.post("/v1/investment", data);
  return rest.data;
};

export const getAllInvestment = async () => {
  const rest = await apiClient.get("/v1/investment");
  return rest.data;
};

export const getAllTotalInvestment = async () => {
  const rest = await apiClient.get("/v1/investment/totalassets");
  return rest.data;
};

export const updateInvestment = async (id: number, data: any) => {
  const rest = await apiClient.put(`/v1/investment/${id}`, data);
  return rest.data;
};

export const deleteInvestment = async (id: number) => {
  const rest = await apiClient.delete(`/v1/investment/${id}`);
  return rest;
};
