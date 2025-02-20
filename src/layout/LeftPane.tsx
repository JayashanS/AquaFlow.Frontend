import React from "react";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DirectionsBoatFilledIcon from "@mui/icons-material/DirectionsBoatFilled";
import Pagination from "@mui/material/Pagination";

const LeftPane: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "transparent",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <DirectionsBoatFilledIcon sx={{ fontSize: 18 }} />{" "}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "0.8rem",
                    ml: 0,
                  }}
                >
                  Inbox
                </Typography>
              }
              sx={{ fontSize: "0.8rem" }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ marginTop: "auto", padding: "10px 0" }}>
        <Divider />
        <Pagination
          count={10}
          color="primary"
          shape="rounded"
          sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
        />
      </Box>
    </Box>
  );
};

export default LeftPane;
