export interface WorkerFilterOptions {
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
