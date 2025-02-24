import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FishFarmFilters } from "../interfaces/fishFarm";
import {
  getFishFarmsById,
  createFishFarm,
  deleteFishFarmById,
  updateFishFarmById,
} from "../services/fishFarmService";

export const useFishFarms = (filters: FishFarmFilters) => {
  return useQuery({
    queryKey: ["fishFarms", filters],
    queryFn: () => getFishFarmsById(filters),
    refetchOnWindowFocus: false,
    enabled: !!filters,
  });
};

export const useCreateFishFarm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newFishFarmData: FormData) => createFishFarm(newFishFarmData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fishFarms"] });
    },
    onError: (error) => {
      console.error("Error creating fish farm:", error);
    },
  });
};

export const useDeleteFishFarm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fishFarmId: number) => deleteFishFarmById(fishFarmId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fishFarms"] });
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
    onError: () => {
      console.error("Faild to delete user");
    },
  });
};

export const useUpdateFishFarms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fishfarmId,
      updatedFishFarm,
    }: {
      fishfarmId: number;
      updatedFishFarm: FormData;
    }) => updateFishFarmById(fishfarmId, updatedFishFarm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fishFarms"] });
    },
    onError: () => {
      console.log("Failed to update fish farm");
    },
  });
};
