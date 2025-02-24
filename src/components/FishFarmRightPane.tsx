import React, { useEffect, useRef, useState } from "react";
import { RightPaneProps } from "../interfaces/fishFarm";
import {
  Typography,
  Grid2,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GridOnIcon from "@mui/icons-material/GridOn";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Circle, Fill } from "ol/style";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import WorkersList from "./WorkerList";
import { useDeleteFishFarm } from "../hooks/useFishFarms";
import FishFarmEditForm from "./FishFarmEditForm";

const FishFarmRightPane: React.FC<RightPaneProps> = ({ farm }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState(0);
  const [openEditor, setOpenEditor] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const deleteFishFarmMutation = useDeleteFishFarm();

  const handleDeleteFishFarm = (id: number) => {
    deleteFishFarmMutation.mutate(id, {
      onSuccess: () => {
        console.log("Fish farm deleted successfully");
      },
      onError: (error) => {
        console.error("Error deleting fish farm:", error);
      },
    });
  };
  const onEditorClose = () => {
    setOpenEditor(false);
  };
  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setOpenDelete(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      handleDeleteFishFarm(selectedId);
    }
    setOpenDelete(false);
    setSelectedId(0);
  };

  useEffect(() => {
    let map: Map | null = null;
    console.log(mapError);
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

      const coordinates = fromLonLat([farm.latitude, farm.longitude]);

      map = new Map({
        target: mapContainerRef.current,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}`,
            }),
          }),
        ],
        controls: [],
        view: new View({
          center: coordinates,
          zoom: 8,
          projection: "EPSG:3857",
        }),
      });

      const marker = new Feature({
        geometry: new Point(coordinates),
      });

      marker.setStyle(
        new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({
              color: "red",
            }),
          }),
        })
      );
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
        sx={{
          borderBottom: "solid 1px #dedede",
          display: "flex",
          flesDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: "1.5rem", marginLeft: "10px" }}>
          {farm.name}
        </Typography>
        <Box>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => setOpenEditor(true)}
          >
            <EditIcon fontSize="inherit" color="primary" />
          </IconButton>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => handleDeleteClick(farm.id)}
          >
            <DeleteIcon fontSize="inherit" sx={{ color: "#f7347f" }} />
          </IconButton>
        </Box>
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
        <Grid2 container size={{ xs: 12, md: 4 }} sx={{ height: "100%" }}>
          <WorkersList selectedFarmId={farm.id} />
        </Grid2>
      </Grid2>
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this fish farm and all of its
            workers?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <FishFarmEditForm
        open={openEditor}
        onClose={onEditorClose}
        fishFarm={farm}
      />
    </Grid2>
  );
};

export default FishFarmRightPane;
