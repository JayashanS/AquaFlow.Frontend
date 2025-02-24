import axios from "axios";
import { WorkerFilters, WorkerFilterResponse } from "../interfaces/worker";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getWorkersByFilter = async (
  filters: WorkerFilters
): Promise<WorkerFilterResponse> => {
  try {
    const { data } = await axios.get(`${API_URL}/worker/getByFilter`, {
      params: filters,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch workers.");
  }
};

export const createWorker = async (newWorkerData: FormData): Promise<void> => {
  try {
    await axios.post(`${API_URL}/worker/create`, newWorkerData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create worker.");
  }
};

export const deleteWorkerById = async (workerId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/worker/deleteById/${workerId}`);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete worker.");
  }
};

export const updateWorkerById = async (
  workerId: number,
  updatedWorkerData: FormData
): Promise<void> => {
  try {
    await axios.put(
      `${API_URL}/worker/updateById/${workerId}`,
      updatedWorkerData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update worker.");
  }
};
