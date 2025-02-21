import React, { useState } from "react";
import Grid2 from "@mui/material/Grid2";
import LeftPane from "./LeftPane";
import RightPane from "./RightPane";

const Dashboard: React.FC = () => {
  const [selectedFarmId, setSelectedFarmId] = useState<number>(1);

  return (
    <Grid2
      container
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Grid2
        size={{ md: 3 }}
        sx={{
          backgroundColor: "#f7f6f9",
          display: { xs: "none", md: "block" },
        }}
      >
        <LeftPane
          selectedFarmId={selectedFarmId}
          setSelectedFarmId={setSelectedFarmId}
        />
      </Grid2>
      <Grid2
        size={{ md: 9 }}
        sx={{
          backgroundColor: "#ffffff",
          overflow: "auto",
          maxHeight: "95vh",
          padding: { xs: "0 0 20px 20px", md: "0 0 60px 60px" },
          flexGrow: 1,
        }}
      >
        <RightPane
          farm={{
            id: 8,
            name: "asd",
            latitude: 40.7128,
            longitude: -74.006,
            numberOfCages: 0,
            hasBarge: true,
            pictureUrl:
              "/uploads/fishfarms/1adb5557-7a14-4164-8d43-3c134e543748.jpg",
          }}
        />
      </Grid2>
    </Grid2>
  );
};

export default Dashboard;
