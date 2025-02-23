import axios from "axios";
import { WorkerPosition } from "../interfaces/workerPosition";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getWorkerPositions = async (): Promise<WorkerPosition[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/workerPosition/getWorkerPositions`
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to fetch worker positions");
  }
};
