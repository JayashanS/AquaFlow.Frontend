import React, { useEffect, useRef, useState } from "react";
import { RightPaneProps } from "../interfaces/fishFarm";
import { Typography, Grid2, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GridOnIcon from "@mui/icons-material/GridOn";
import CancelIcon from "@mui/icons-material/Cancel";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import WorkersPage from "../pages/WorkersPage";

const RightPane: React.FC<RightPaneProps> = ({ farm }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let map: Map | null = null;

    try {
      if (!farm) {
        return;
      }

      if (!mapContainerRef.current) {
        return;
      }

      if (!farm.latitude || !farm.longitude) {
        return;
      }

      const coordinates = fromLonLat([farm.longitude, farm.latitude]);

      map = new Map({
        target: mapContainerRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        controls: [],
        view: new View({
          center: coordinates,
          zoom: 14,
          projection: "EPSG:3857",
        }),
      });

      const marker = new Feature({
        geometry: new Point(coordinates),
      });

      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [marker],
        }),
      });

      map.addLayer(vectorLayer);
      map.renderSync();
      map.updateSize();
    } catch {
      setMapError("Error initializing map");
    }

    return () => {
      if (map) {
        map.setTarget(undefined);
        map = null;
      }
    };
  }, [farm]);

  return (
    <Grid2
      container
      direction={"column"}
      sx={{ border: "solid 1px #dedede", borderRadius: "4px" }}
    >
      <Grid2
        container
        size={{ xs: 12, md: 12 }}
        sx={{ borderBottom: "solid 1px #dedede" }}
      >
        <Typography sx={{ fontSize: "1.5rem", marginLeft: "10px" }}>
          {farm.name}
        </Typography>
      </Grid2>
      <Grid2 container size={{ xs: 12, md: 12 }}>
        <Grid2
          container
          size={{ xs: 12, md: 8 }}
          direction={"column"}
          sx={{ borderRight: "solid 1px #dedede" }}
        >
          <Grid2 size={{ xs: 12, md: 12 }}>
            <img
              src={`http://localhost:5082${farm.pictureUrl}`}
              alt={farm.name}
              style={{ width: "100%", height: "auto" }}
            />
          </Grid2>
          <Grid2
            container
            spacing={2}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  width: "100%",
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                {farm.hasBarge ? (
                  <CheckCircleIcon sx={{ color: "#03fc90", fontSize: 30 }} />
                ) : (
                  <>
                    <CancelIcon sx={{ color: "red", fontSize: 30 }} />
                  </>
                )}
                <Box sx={{ padding: 0, marginLeft: "8px" }}>
                  <Typography variant="body2">
                    {farm.hasBarge ? "Has Barge" : "No Barge"}
                  </Typography>
                </Box>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  width: "100%",
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <GridOnIcon sx={{ color: "#b963ff", fontSize: 30 }} />
                <Box sx={{ padding: 0, marginLeft: "8px" }}>
                  <Typography variant="body2">
                    {farm.numberOfCages} Cages
                  </Typography>
                </Box>
              </Box>
            </Grid2>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 12 }}>
            <Typography
              variant="body1"
              color="#ff2676"
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                zIndex: 10,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                padding: "5px 10px",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              GPS ({farm.longitude},{farm.latitude})
            </Typography>
            <div
              ref={mapContainerRef}
              style={{
                width: "100%",
                height: "400px",
                backgroundColor: "#f0f0f0",
                position: "relative",
                marginTop: "16px",
              }}
            />
          </Grid2>
        </Grid2>
        <Grid2 container size={{ xs: 12, md: 4 }}>
          <WorkersPage />
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default RightPane;
