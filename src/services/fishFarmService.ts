import axios from "axios";
import { FishFarmFilters } from "../interfaces/fishFarm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchFishFarms = async (filters: FishFarmFilters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  console.log(`${API_BASE_URL}/FishFarm/getByFilter?${params.toString()}`);
  const response = await axios.get(
    `${API_BASE_URL}/FishFarm/getByFilter?${params.toString()}`
  );
  return response.data;
};
