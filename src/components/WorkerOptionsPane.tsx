import React from "react";
import Button from "@mui/material/Button";
import { OptionsPaneProps } from "../interfaces/worker";
import { Grid2, Paper, IconButton, InputBase, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";

const OptionsPane: React.FC<OptionsPaneProps> = ({
  mode,
  setMode,
  handleFilterChange,
}) => {
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
                width: "100%",
                height: 40,
                boxShadow: "none",
                backgroundColor: "transparent",
                border: "1px solid #26b0ff",
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1, fontSize: "0.8rem" }}
                placeholder="Search Workers"
                name="name"
                onChange={(e) =>
                  handleFilterChange({ name: "name", value: e.target.value })
                }
              />
              <IconButton size="small" type="button" sx={{ p: "5px" }}>
                <SearchIcon fontSize="small" />
              </IconButton>
            </Paper>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}></Box>
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
            New Worker
          </Button>
        )}
      </Grid2>
    </Grid2>
  );
};

export default OptionsPane;
