import React, { useState, useEffect } from "react";
import { useFishFarms } from "../hooks/useFishFarms";
import Grid2 from "@mui/material/Grid2";
import LeftPane from "../components/FishFarmLeftPane";
import RightPane from "../components/FishFarmRightPane";
import FishFarmForm from "../components/FishFarmForm";
import OptionsPane from "../components/FishFarmOptionsPane";
import {
  FishFarm,
  getDefaultFishFarm,
  FishFarmFilters,
  getDefaultFilters,
  HandleFishFarmFilterChangeProps,
} from "../interfaces/fishFarm";
import { Mode } from "../interfaces/fishFarm";
import NoDataPage from "../components/NoData";

const Dashboard: React.FC = () => {
  const [mode, setMode] = useState<Mode>("view");
  const [selectedFarmId, setSelectedFarmId] = useState<number>(1);
  const [selectedFarmData, setSelectedFarmData] = useState<
    FishFarm | undefined
  >(getDefaultFishFarm());
  const [filters, setFilters] = useState<FishFarmFilters>(getDefaultFilters());

  const { data, isError, isLoading } = useFishFarms(filters);

  const handleFilterChange = ({
    name,
    value,
  }: HandleFishFarmFilterChangeProps) => {
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
          {isLoading ? (
            <Grid2
              size={{ md: 12 }}
              sx={{
                backgroundColor: "#f7f6f9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              Loading...
            </Grid2>
          ) : isError ? (
            <Grid2
              size={{ md: 12 }}
              sx={{
                backgroundColor: "#f7f6f9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <NoDataPage />
            </Grid2>
          ) : data?.fishFarms && data.fishFarms.length > 0 ? (
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
          ) : (
            <Grid2
              size={{ md: 12 }}
              sx={{
                backgroundColor: "#f7f6f9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <NoDataPage />
            </Grid2>
          )}
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
          <FishFarmForm setMode={setMode} />
        </Grid2>
      )}
    </Grid2>
  );
};

export default Dashboard;
