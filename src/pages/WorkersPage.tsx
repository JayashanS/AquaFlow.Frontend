import React, { useState } from "react";
import Grid2 from "@mui/material/Grid2";
import OptionsPane from "../components/WorkerOptionsPane";
import WorkerTable from "../components/WorkerTable";
import WorkerForm from "../components/WorkerForm";
import { useGetWorkersByFilter, useDeleteWorker } from "../hooks/useWorker";
import {
  WorkerFilters,
  HandleWorkerFilterChangeProps,
  getDefaultWorkerFilters,
} from "../interfaces/worker";
import { Mode } from "../interfaces/fishFarm";
import NoDataPage from "../components/NoData";

const WorkersPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>("view");
  const [filters, setFilters] = useState<WorkerFilters>(
    getDefaultWorkerFilters()
  );

  const { data, isLoading, isError } = useGetWorkersByFilter(filters);
  const deleteWorkerMutation = useDeleteWorker();

  const handleFilterChange = ({
    name,
    value,
  }: HandleWorkerFilterChangeProps) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteWorker = (id: number) => {
    deleteWorkerMutation.mutate(id, {
      onSuccess: () => {
        console.log("Worker deleted successfully");
      },
      onError: (error) => {
        console.error("Error deleting worker:", error);
      },
    });
  };

  return (
    <Grid2
      container
      sx={{
        width: "93vw",
        height: "90vh",
        margin: "20px",
        overflow: "hidden",
        border: "solid 1px #dedede",
        borderRadius: "4px",
      }}
    >
      <Grid2
        size={{ md: 12 }}
        sx={{
          borderBottom: "solid 1px #dedede",
          height: "60px",
        }}
      >
        <OptionsPane
          mode={mode}
          setMode={setMode}
          handleFilterChange={handleFilterChange}
        />
      </Grid2>
      {mode === "view" && (
        <Grid2
          size={{ md: 12 }}
          sx={{
            backgroundColor: "#f7f6f9",
            display: { xs: "none", md: "block" },
          }}
        >
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <NoDataPage />
          ) : data?.workers && data.workers.length > 0 ? (
            <WorkerTable
              workers={data.workers}
              onFilterChange={handleFilterChange}
              totalCount={data.totalCount}
              page={filters.pageNumber || 1}
              rowsPerPage={filters.pageSize || 10}
              onDelete={handleDeleteWorker}
            />
          ) : (
            <NoDataPage />
          )}
        </Grid2>
      )}
      {mode === "create" && (
        <Grid2
          sx={{
            height: "70vh",
            overflow: "auto",
          }}
          size={{ xs: 12, md: 12 }}
        >
          <WorkerForm setMode={setMode} />
        </Grid2>
      )}
    </Grid2>
  );
};

export default WorkersPage;
