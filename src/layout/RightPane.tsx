import React, { useEffect, useRef, useState } from "react";
import { Typography, Grid } from "@mui/material";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";

interface FarmData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  numberOfCages: number;
  hasBarge: boolean;
  pictureUrl: string;
}

interface RightPaneProps {
  farm: FarmData;
}

const RightPane: React.FC<RightPaneProps> = ({ farm }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let map: Map | null = null;

    try {
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
  }, [farm.latitude, farm.longitude]);

  return (
    <div style={{ padding: "16px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <img
            src={`http://localhost:5082${farm.pictureUrl}`}
            alt={farm.name}
            style={{ width: "100%", height: "auto" }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6">{farm.name}</Typography>
          <Typography variant="body1">
            <strong>Number of Cages:</strong> {farm.numberOfCages}
          </Typography>
          <Typography variant="body1">
            <strong>Has Barge:</strong> {farm.hasBarge ? "Yes" : "No"}
          </Typography>
          {mapError && (
            <Typography color="error">Map Error: {mapError}</Typography>
          )}
        </Grid>
      </Grid>

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
    </div>
  );
};

export default RightPane;
