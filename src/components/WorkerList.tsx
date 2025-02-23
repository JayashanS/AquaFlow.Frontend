import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
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
    <div>
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
          <p>No workers found</p>
        )}
      </List>

      {data && data.totalCount > 0 && (
        <Pagination
          count={Math.ceil(data.totalCount / (filters.pageSize || 1))}
          page={filters.pageNumber}
          onChange={handlePageChange}
          sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
        />
      )}
    </div>
  );
};

export default WorkerList;
