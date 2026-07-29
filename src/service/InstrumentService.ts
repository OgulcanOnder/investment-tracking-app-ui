import apiClient from "../data/apiClient";

export const getAllInstruments = async () => {
  const rest = await apiClient.get("/v1/instruments");
  return rest.data;
};
