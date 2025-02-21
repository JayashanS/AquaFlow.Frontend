import React, { useState, useEffect } from "react";
import { useFishFarms } from "../hooks/useFishFarms";
import { FishFarmFilters, LeftPaneProps } from "../interfaces/fishFarm";
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  InputBase,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ListItemText from "@mui/material/ListItemText";
import DirectionsBoatFilledIcon from "@mui/icons-material/DirectionsBoatFilled";
import Pagination from "@mui/material/Pagination";

const LeftPane: React.FC<LeftPaneProps> = ({
  selectedFarmId,
  setSelectedFarmId,
}) => {
  const [filters, setFilters] = useState<FishFarmFilters>({
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

  const { data, isLoading, error, refetch } = useFishFarms(filters);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setFilters((prev) => ({ ...prev, pageNumber: value }));
  };

  const handleFarmClick = (farmId: number) => {
    setSelectedFarmId(farmId);
  };

  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  useEffect(() => {
    setSelectedFarmId(data?.fishFarms?.[0]?.id);
  }, [data]);

  return (
    <Box
      sx={{
        bgcolor: "transparent",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "relative",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: 35,
            boxShadow: "none",
            backgroundColor: "transparent",
            border: "1px solid #a503fc",
          }}
        >
          <InputBase
            name="name"
            sx={{ ml: 1, flex: 1, fontSize: "0.8rem" }}
            placeholder="Search Fish Farms"
            onChange={handleFilterChange}
            value={filters.name}
          />
          <IconButton size="small" type="button" sx={{ p: "5px" }}>
            <SearchIcon fontSize="small" />
          </IconButton>
        </Paper>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <Box sx={{ flex: 1, overflow: "auto", pb: 2 }}>
          <List>
            {isLoading ? (
              <ListItem>
                <Typography>Loading...</Typography>
              </ListItem>
            ) : error ? (
              <ListItem>
                <Typography color="error">Error: {error.message}</Typography>
              </ListItem>
            ) : (
              data?.fishFarms?.map((farm: any) => (
                <ListItem
                  key={farm.id}
                  sx={{
                    backgroundColor:
                      farm.id === selectedFarmId ? "#f6e6ff" : "transparent",
                    cursor: "pointer",
                  }}
                  disablePadding
                >
                  <ListItemButton onClick={() => handleFarmClick(farm.id)}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <DirectionsBoatFilledIcon sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "0.9rem",
                            ml: 0,
                          }}
                        >
                          {farm.name}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Box>
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            borderTop: "1px solid rgba(0, 0, 0, 0.12)",
            padding: "10px 0",
            mt: "auto",
          }}
        >
          <Pagination
            count={Math.ceil((data?.totalCount || 0) / (filters.pageSize || 1))}
            page={filters.pageNumber}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default LeftPane;
