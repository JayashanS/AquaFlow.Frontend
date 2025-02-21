import { useQuery } from "@tanstack/react-query";
import { FishFarmFilters } from "../interfaces/fishFarm";
import { fetchFishFarms } from "../services/fishFarmService";

export const useFishFarms = (filters: FishFarmFilters) => {
  return useQuery({
    queryKey: ["fishFarms", filters],
    queryFn: () => fetchFishFarms(filters),
    refetchOnWindowFocus: false,
    enabled: !!filters,
  });
};
