import React, { useEffect } from "react";
import { FishFarm, LeftPaneProps } from "../interfaces/fishFarm";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  Pagination,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DirectionsBoatFilledIcon from "@mui/icons-material/DirectionsBoatFilled";

const LeftPane: React.FC<LeftPaneProps> = ({
  selectedFarmId,
  setSelectedFarmId,
  seteSelectedFarmData,
  filters,
  handleFilterChange,
  data,
}) => {
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    handleFilterChange({ name: "pageNumber", value });
  };

  const theme = useTheme();

  useEffect(() => {
    if (data?.fishFarms?.length) {
      seteSelectedFarmData(
        data.fishFarms.find((farm: FishFarm) => farm.id === selectedFarmId)
      );
    }
  }, [data, filters.pageNumber, selectedFarmId, seteSelectedFarmData]);

  return (
    <Box
      sx={{
        bgcolor: "transparent",
        display: "flex",
        flexDirection: "column",
        height: "75vh",
        position: "relative",
      }}
    >
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
            {data?.isLoading ? (
              <ListItem>
                <Typography>Loading...</Typography>
              </ListItem>
            ) : data?.error ? (
              <ListItem>
                <Typography color="error">
                  Error: {data.error.message}
                </Typography>
              </ListItem>
            ) : (
              data?.fishFarms?.map((farm: any) => (
                <ListItem
                  key={farm.id}
                  sx={{
                    backgroundColor:
                      farm.id === selectedFarmId
                        ? theme.palette.mode === "dark"
                          ? "#666666"
                          : "#c9eaff"
                        : "transparent",
                    cursor: "pointer",
                  }}
                  disablePadding
                >
                  <ListItemButton onClick={() => setSelectedFarmId(farm.id)}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <DirectionsBoatFilledIcon sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "0.9rem",
                        ml: 0,
                      }}
                    >
                      {farm.name}
                    </Typography>
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
