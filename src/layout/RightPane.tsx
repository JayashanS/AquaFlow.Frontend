import React, { useEffect, useRef, useState } from "react";
import { RightPaneProps } from "../interfaces/fishFarm";
import { Typography, Grid2 } from "@mui/material";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";

const RightPane: React.FC<RightPaneProps> = ({ farm }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let map: Map | null = null;

    try {
      if (!farm) {
        setMapError("Farm data is not available");
        return;
      }

      if (!mapContainerRef.current) {
        setMapError("Map container not found");
        return;
      }

      if (!farm.latitude || !farm.longitude) {
        setMapError("Invalid coordinates");
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
    <Grid2 container direction={"column"} sx={{ border: "solid 1px black" }}>
      <Grid2
        container
        size={{ xs: 12, md: 12 }}
        sx={{ borderBottom: "solid 1px black" }}
      >
        <Typography variant="h6">{farm.name}</Typography>
      </Grid2>
      <Grid2 container size={{ xs: 12, md: 12 }}>
        <Grid2
          container
          size={{ xs: 12, md: 8 }}
          direction={"column"}
          sx={{ borderRight: "solid 1px black" }}
        >
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Typography variant="body1">
              <strong>Number of Cages:</strong> {farm.numberOfCages}
            </Typography>
            <Typography variant="body1">
              <strong>Has Barge:</strong> {farm.hasBarge ? "Yes" : "No"}
            </Typography>
            {mapError && (
              <Typography color="error">Map Error: {mapError}</Typography>
            )}
          </Grid2>
          <Grid2 size={{ xs: 12, md: 12 }}>
            <img
              src={`http://localhost:5082${farm.pictureUrl}`}
              alt={farm.name}
              style={{ width: "100%", height: "auto" }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 12 }}>
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
        <Grid2 container size={{ xs: 12, md: 4 }}></Grid2>
      </Grid2>
    </Grid2>
  );
};

export default RightPane;
