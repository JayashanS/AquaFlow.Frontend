import React, { useState } from "react";
import Button from "@mui/material/Button";
import { OptionsPaneProps } from "../interfaces/fishFarm";
import {
  Grid2,
  Paper,
  IconButton,
  InputBase,
  Slider,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";

const OptionsPane: React.FC<OptionsPaneProps> = ({
  mode,
  setMode,
  handleFilterChange,
}) => {
  const [cages, setCages] = useState<number>(0);

  const handleCageChange = (_event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setCages(value);
    handleFilterChange({ name: "numberOfCages", value });
  };

  return (
    <Grid2
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "60px",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px",
      }}
    >
      <Grid2 sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        {mode === "create" && (
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => setMode("view")}
          >
            Back
          </Button>
        )}
        {mode === "view" && (
          <>
            <Paper
              component="form"
              sx={{
                marginLeft: "10px",
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: "50%",
                height: 40,
                boxShadow: "none",
                backgroundColor: "transparent",
                border: "1px solid #26b0ff",
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1, fontSize: "0.8rem" }}
                placeholder="Search Fish Farms"
                name="name"
                onChange={(e) =>
                  handleFilterChange({ name: "name", value: e.target.value })
                }
              />
              <IconButton size="small" type="button" sx={{ p: "5px" }}>
                <SearchIcon fontSize="small" />
              </IconButton>
            </Paper>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                  Number of Cages:
                </Typography>
                <Slider
                  size="small"
                  value={cages}
                  min={0}
                  max={100}
                  step={1}
                  valueLabelDisplay="auto"
                  onChange={handleCageChange}
                  sx={{ width: "100px", mx: 2 }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                  Has Barge:
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      name="hasBarge"
                      defaultChecked
                      onChange={(e) =>
                        handleFilterChange({
                          name: "hasBarge",
                          value: e.target.checked,
                        })
                      }
                    />
                  }
                  label=""
                  sx={{ m: 0, ml: 1 }}
                />
              </Box>
            </Box>
          </>
        )}
      </Grid2>

      <Grid2>
        {mode === "view" && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setMode("create")}
          >
            New Fish Farm
          </Button>
        )}
      </Grid2>
    </Grid2>
  );
};

export default OptionsPane;
