import apiClient from "../data/apiClient";

export const getAllInstruments = async () => {
  const rest = await apiClient.get("/instruments/v1");
  return rest.data;
};
