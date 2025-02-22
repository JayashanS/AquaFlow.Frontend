import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FishFarmFilters } from "../interfaces/fishFarm";
import { fetchFishFarms, createFishFarm } from "../services/fishFarmService";

export const useFishFarms = (filters: FishFarmFilters) => {
  return useQuery({
    queryKey: ["fishFarms", filters],
    queryFn: () => fetchFishFarms(filters),
    refetchOnWindowFocus: false,
    enabled: !!filters,
  });
};

export const useCreateFishFarm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFishFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fishFarms"] });
    },
    onError: (error) => {
      console.error("Error creating fish farm:", error);
    },
  });
};
