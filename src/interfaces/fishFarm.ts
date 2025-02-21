export interface FishFarmFilters {
  name?: string;
  topRightLat?: number;
  topRightLng?: number;
  bottomLeftLat?: number;
  bottomLeftLng?: number;
  numberOfCages?: number;
  hasBarge?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface LeftPaneProps {
  selectedFarmId: number;
  setSelectedFarmId: (id: number) => void;
}
