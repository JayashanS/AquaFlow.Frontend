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

  try {
    const response = await axios.get(
      `${API_BASE_URL}/FishFarm/getByFilter?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching fish farms.");
  }
};

export const createFishFarm = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/FishFarm/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create fish farm");
  }
};
