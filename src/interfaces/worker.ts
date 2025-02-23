export interface WorkerFilters {
  name?: string;
  fishFarmId?: number;
  positionId?: number;
  certifiedUntil?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateWorkerDTO {
  name: string;
  picture: File;
  age: number;
  email: string;
  positionId: number;
  certifiedUntil: string;
  fishFarmId: number;
}

export interface UpdateWorkerDTO {
  name?: string;
  age?: number;
  email?: string;
  positionId?: number;
  certifiedUntil?: string;
  fishFarmId?: number;
}

export interface Worker {
  id: number;
  name: string;
  age: number;
  email: string;
  positionId: number;
  certifiedUntil: string;
  fishFarmId: number;
  pictureUrl: string;
}
export interface WorkerFilterResponse {
  workers: Worker[];
  totalCount: number;
}

export interface HandleWorkerFilterChangeProps {
  name: keyof WorkerFilters;
  value: string | number | boolean;
}

export const getDefaultWorkerFilters = (): WorkerFilters => {
  return {
    name: "",
    fishFarmId: undefined,
    positionId: undefined,
    certifiedUntil: undefined,
    pageNumber: 1,
    pageSize: 10,
  };
};

export type Mode = "view" | "create" | "update";

export interface OptionsPaneProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  handleFilterChange: (props: HandleWorkerFilterChangeProps) => void;
}

export interface WorkerFormProps {
  setMode: (mode: Mode) => void;
}
