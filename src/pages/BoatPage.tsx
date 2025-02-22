import React, { useState, useEffect } from "react";
import { useFishFarms } from "../hooks/useFishFarms";
import Grid2 from "@mui/material/Grid2";
import LeftPane from "../layout/LeftPane2";
import RightPane from "../layout/RightPane";
import WorkerForm from "../components/FishFarmForm";
import OptionsPane from "../components/OptionsPane";
import {
  FishFarm,
  getDefaultFishFarm,
  FishFarmFilters,
  getDefaultFilters,
  HandleFilterChangeProps,
} from "../interfaces/fishFarm";
import { Mode } from "../interfaces/global";

const Dashboard: React.FC = () => {
  const [mode, setMode] = useState<Mode>("view");
  const [selectedFarmId, setSelectedFarmId] = useState<number>(1);
  const [selectedFarmData, setSelectedFarmData] =
    useState<FishFarm>(getDefaultFishFarm());
  const [filters, setFilters] = useState<FishFarmFilters>(getDefaultFilters());

  const { data, isLoading, error, refetch } = useFishFarms(filters);

  const handleFilterChange = ({ name, value }: HandleFilterChangeProps) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (data && data.fishFarms && data.fishFarms.length > 0) {
      setSelectedFarmId(data.fishFarms[0].id);
      setSelectedFarmData(data.fishFarms[0]);
    }
  }, [data]);

  return (
    <Grid2
      container
      sx={{
        width: "93vw",
        height: "90vh",
        margin: "20px",
        overflow: "hidden",
        border: "solid 1px #dedede",
        borderRadius: "4px",
      }}
    >
      <Grid2
        size={{ md: 12 }}
        sx={{
          borderBottom: "solid 1px #dedede",
          height: "60px",
        }}
      >
        <OptionsPane
          mode={mode}
          setMode={setMode}
          handleFilterChange={handleFilterChange}
        />
      </Grid2>
      {mode === "view" && (
        <>
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
              seteSelectedFarmData={setSelectedFarmData}
              filters={filters}
              handleFilterChange={handleFilterChange}
              data={data}
            />
          </Grid2>
          <Grid2
            size={{ md: 9 }}
            sx={{
              backgroundColor: "#ffffff",
              overflow: "auto",
              maxHeight: "95vh",
              padding: { xs: "0 0 20px 20px", md: "40px" },
              flexGrow: 1,
            }}
          >
            {selectedFarmData && <RightPane farm={selectedFarmData} />}
          </Grid2>
        </>
      )}
      {mode === "create" && (
        <Grid2
          sx={{
            height: "70vh",
            overflow: "auto",
          }}
          size={{ xs: 12, md: 12 }}
        >
          <WorkerForm setMode={setMode} />
        </Grid2>
      )}
    </Grid2>
  );
};

export default Dashboard;
