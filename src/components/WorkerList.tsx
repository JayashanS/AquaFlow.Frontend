import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Divider,
  List,
  ListItem,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import { useGetWorkersByFilter } from "../hooks/useWorker";
import { WorkerFilters } from "../interfaces/worker";

interface WorkersListProps {
  selectedFarmId: number;
}

const WorkerList: React.FC<WorkersListProps> = ({ selectedFarmId }) => {
  const [filters, setFilters] = useState<WorkerFilters>({
    pageNumber: 1,
    pageSize: 10,
    name: "",
    fishFarmId: undefined,
  });

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      fishFarmId: selectedFarmId,
    }));
  }, [selectedFarmId]);

  const { data, isLoading, error } = useGetWorkersByFilter(filters);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setFilters({ ...filters, pageNumber: page });
  };

  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {isLoading && <p>Loading workers...</p>}
        {error && <p>Error fetching workers: {error.message}</p>}

        {data && data.workers.length > 0 ? (
          data.workers.map((worker) => (
            <React.Fragment key={worker.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    alt={worker.name}
                    src={`http://localhost:5082/${worker.pictureUrl}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={worker.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: "text.primary", display: "inline" }}
                      >
                        {worker.positionName}
                      </Typography>
                      {" — Certified Until: " +
                        new Date(worker.certifiedUntil).toLocaleDateString()}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              width: "20vw",
              opacity: 0.6,
            }}
          >
            <Typography
              component="span"
              variant="body2"
              sx={{ color: "gray", fontSize: 18 }}
            >
              No workers found.
            </Typography>
          </Box>
        )}
      </List>

      {data && data.totalCount > 0 && (
        <Pagination
          count={Math.ceil(data.totalCount / (filters.pageSize || 1))}
          page={filters.pageNumber}
          color="primary"
          shape="rounded"
          onChange={handlePageChange}
          sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
        />
      )}
    </div>
  );
};

export default WorkerList;
