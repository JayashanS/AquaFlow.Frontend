import { useQuery } from "@tanstack/react-query";
import { getWorkerPositions } from "../services/workerPositionService";
import { WorkerPosition } from "../interfaces/workerPosition";

export const useWorkerPositions = () => {
  return useQuery<WorkerPosition[], Error>({
    queryKey: ["workerPositions"],
    queryFn: getWorkerPositions,
  });
};
