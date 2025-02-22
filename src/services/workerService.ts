import axios from "axios";
import {
  WorkerFilterOptions,
  CreateWorkerDTO,
  UpdateWorkerDTO,
  WorkerFilterResponse,
} from "../interfaces/worker";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getWorkersByFilter = async (
  filters: WorkerFilterOptions
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
    await axios.delete(`${API_URL}/${workerId}`);
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

export const createWorker = async (
  workerData: CreateWorkerDTO
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("name", workerData.name);
    formData.append("picture", workerData.picture);
    formData.append("age", workerData.age.toString());
    formData.append("email", workerData.email);
    formData.append("positionId", workerData.positionId.toString());
    formData.append("certifiedUntil", workerData.certifiedUntil);
    formData.append("fishFarmId", workerData.fishFarmId.toString());

    await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create worker.");
  }
};
