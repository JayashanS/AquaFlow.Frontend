export interface FishFarm {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  numberOfCages: number;
  hasBarge: boolean;
  pictureUrl: string;
}

export interface CreateFishFarm {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  numberOfCages: number;
  hasBarge: boolean;
  picture: File | null;
}

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

export const getDefaultFilters = (): FishFarmFilters => ({
  name: "",
  topRightLat: undefined,
  topRightLng: undefined,
  bottomLeftLat: undefined,
  bottomLeftLng: undefined,
  numberOfCages: undefined,
  hasBarge: undefined,
  pageNumber: 1,
  pageSize: 10,
});

export const getDefaultFishFarm = (): FishFarm => ({
  id: 0,
  name: "",
  latitude: 0,
  longitude: 0,
  numberOfCages: 0,
  hasBarge: false,
  pictureUrl: "",
});

export interface RightPaneProps {
  farm: FishFarm;
}

export interface HandleFishFarmFilterChangeProps {
  name: keyof FishFarmFilters;
  value: string | number | boolean | undefined;
}

export interface LeftPaneProps {
  selectedFarmId: number;
  setSelectedFarmId: (id: number) => void;
  seteSelectedFarmData: (farm: FishFarm | undefined) => void;
  filters: FishFarmFilters;
  handleFilterChange: ({
    name,
    value,
  }: HandleFishFarmFilterChangeProps) => void;
  data: {
    fishFarms: FishFarm[];
    totalCount: number;
    isLoading: boolean;
    error: Error | null;
  };
}

export type Mode = "view" | "create" | "update";

export interface OptionsPaneProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  handleFilterChange: (props: HandleFishFarmFilterChangeProps) => void;
}

export interface ImageCropperProps {
  onPictureChange: (croppedImage: File | null) => void;
}

export interface FishFarmFormProps {
  setMode: (mode: Mode) => void;
}

export interface FishFarmFormData {
  name: string;
  latitude: number;
  longitude: number;
  numberOfCages: number;
  hasBarge: boolean;
  picture: File | null;
}

export interface FishFarmLocationPickerProps {
  open: boolean;
  onClose: () => void;
  onCoordinatesSelect: (coordinates: [number, number]) => void;
}

export interface FishFarmEditFormProps {
  open: boolean;
  onClose: () => void;
  fishFarm: FishFarm | null;
}
