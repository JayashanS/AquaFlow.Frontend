import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWorkersByFilter,
  deleteWorkerById,
  updateWorkerById,
  createWorker,
} from "../services/workerService";
import { WorkerFilters, WorkerFilterResponse } from "../interfaces/worker";

export const useGetWorkersByFilter = (filters: WorkerFilters) => {
  return useQuery<WorkerFilterResponse>({
    queryKey: ["workers", filters],
    queryFn: () => getWorkersByFilter(filters),
  });
};

export const useCreateWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newWorkerData: FormData) => createWorker(newWorkerData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workers"] }),
  });
};

export const useDeleteWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workerId: number) => deleteWorkerById(workerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workers"] }),
  });
};

export const useUpdateWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workerId,
      updatedWorkerData,
    }: {
      workerId: number;
      updatedWorkerData: FormData;
    }) => updateWorkerById(workerId, updatedWorkerData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workers"] }),
  });
};
