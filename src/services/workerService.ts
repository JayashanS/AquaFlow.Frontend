import axios from "axios";
import {
  WorkerFilters,
  UpdateWorkerDTO,
  WorkerFilterResponse,
} from "../interfaces/worker";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getWorkersByFilter = async (
  filters: WorkerFilters
): Promise<WorkerFilterResponse> => {
  try {
    const { data } = await axios.get(`${API_URL}/worker/getWorkersByFilter`, {
      params: filters,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch workers.");
  }
};

export const deleteWorkerById = async (workerId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/worker/deleteUserById/${workerId}`);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete worker.");
  }
};

export const updateWorker = async (
  workerId: number,
  workerData: UpdateWorkerDTO
): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${workerId}`, workerData);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update worker.");
  }
};

export const createWorker = async (formData: FormData): Promise<void> => {
  try {
    await axios.post(`${API_URL}/worker/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error creating worker:", error);
    throw new Error("Failed to create worker.");
  }
};
