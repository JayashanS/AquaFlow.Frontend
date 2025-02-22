import React, { useState } from "react";
import Button from "@mui/material/Button";
import { OptionsPaneProps } from "../interfaces/global";
import {
  Grid2,
  Paper,
  IconButton,
  InputBase,
  Slider,
  Typography,
  Checkbox,
  FormControlLabel,
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

            <Grid2
              sx={{ display: "flex", alignItems: "center", width: "200px" }}
            >
              <Typography sx={{ fontSize: "0.8rem", minWidth: "100px" }}>
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
                sx={{ width: "100px" }}
              />
            </Grid2>

            <FormControlLabel
              control={
                <Checkbox
                  name="hasBarge"
                  onChange={(e) =>
                    handleFilterChange({
                      name: "hasBarge",
                      value: e.target.checked,
                    })
                  }
                />
              }
              label="Has Barge"
            />
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
