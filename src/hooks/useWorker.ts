import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWorkersByFilter,
  deleteWorkerById,
  updateWorker,
  createWorker,
} from "../services/workerService";
import { WorkerFilters, WorkerFilterResponse } from "../interfaces/worker";

export const useGetWorkersByFilter = (filters: WorkerFilters) => {
  return useQuery<WorkerFilterResponse>({
    queryKey: ["workers", filters],
    queryFn: () => getWorkersByFilter(filters),
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
      workerData,
    }: {
      workerId: number;
      workerData: FormData;
    }) => updateWorker(workerId, workerData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workers"] }),
  });
};

export const useCreateWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createWorker(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workers"] }),
  });
};
