import axios from "axios";
import { FishFarmFilters } from "../interfaces/fishFarm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getFishFarmsById = async (filters: FishFarmFilters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  try {
    const response = await axios.get(
      `${API_BASE_URL}/fishFarm/getByFilter?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching fish farms.");
  }
};

export const createFishFarm = async (newFishFarmData: FormData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/fishFarm/create`,
      newFishFarmData,
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

export const deleteFishFarmById = async (fishFarmId: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/fishFarm/deleteById/${fishFarmId}`);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete fish farm");
  }
};

export const updateFishFarmById = async (
  fishfarmID: number,
  updatedFishFarm: FormData
): Promise<void> => {
  try {
    await axios.put(
      `${API_BASE_URL}/fishFarm/updateById/${fishfarmID}`,
      updatedFishFarm,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update fishfarm");
  }
};
