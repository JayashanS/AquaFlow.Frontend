import React from "react";
import { Box, Typography, SvgIcon } from "@mui/material";
import SearchIcon from "@mui/icons-material/SearchOutlined";

const NoDataPage: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      minHeight="100vh"
      textAlign="center"
    >
      <SvgIcon
        component={SearchIcon}
        sx={{ fontSize: 100, color: "lightgrey" }}
      />
      <Typography variant="h5" sx={{ marginTop: 2 }}>
        No Data Available
      </Typography>
      <Typography variant="body2" sx={{ marginTop: 1, color: "gray" }}>
        It looks like there's no data available at the moment.
      </Typography>
    </Box>
  );
};

export default NoDataPage;
