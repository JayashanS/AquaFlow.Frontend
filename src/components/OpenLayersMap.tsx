import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, transform } from "ol/proj";
import { Modal, Box, Button } from "@mui/material";
import "ol/ol.css";

interface OpenLayersMapProps {
  open: boolean;
  onClose: () => void;
  onCoordinatesSelect: (coordinates: [number, number]) => void;
}

const OpenLayersMap: React.FC<OpenLayersMapProps> = ({
  open,
  onClose,
  onCoordinatesSelect,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);

  const initializeMap = () => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setTarget(undefined);
      mapInstanceRef.current = null;
    }

    const initialMap = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    initialMap.setTarget(mapRef.current);
    mapInstanceRef.current = initialMap;

    initialMap.on("click", (event) => {
      const clickedCoord = initialMap.getCoordinateFromPixel(event.pixel);
      const transformedCoord = transform(
        clickedCoord,
        "EPSG:3857",
        "EPSG:4326"
      );
      setSelectedCoordinates([transformedCoord[0], transformedCoord[1]]);
    });

    setTimeout(() => {
      initialMap.updateSize();
    }, 200);
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        initializeMap();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
      setSelectedCoordinates(null);
    }
  }, [open]);

  const handleAddCoordinates = () => {
    if (selectedCoordinates) {
      onCoordinatesSelect(selectedCoordinates);
      onClose();
    }
  };

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: 800,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="map-modal-title"
      keepMounted={false}
    >
      <Box sx={modalStyle}>
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "400px",
            marginBottom: "1rem",
            visibility: open ? "visible" : "hidden",
            backgroundColor: "#f0f0f0",
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleAddCoordinates}
            variant="contained"
            disabled={!selectedCoordinates}
          >
            Add Selected Location
          </Button>
        </Box>
        {selectedCoordinates && (
          <Box sx={{ mt: 2 }}>
            Selected coordinates: {selectedCoordinates[0].toFixed(6)},{" "}
            {selectedCoordinates[1].toFixed(6)}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default OpenLayersMap;
