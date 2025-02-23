import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat, transform } from "ol/proj";
import { Modal, Box, Button } from "@mui/material";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Circle, Fill } from "ol/style";
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
  const vectorLayerRef = useRef<VectorLayer | null>(null);

  const initializeMap = () => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setTarget(undefined);
      mapInstanceRef.current = null;
    }

    const initialMap = new Map({
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}`,
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    const vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    initialMap.addLayer(vectorLayer);
    mapInstanceRef.current = initialMap;
    vectorLayerRef.current = vectorLayer;

    initialMap.setTarget(mapRef.current);

    initialMap.on("click", (event) => {
      const clickedCoord = initialMap.getCoordinateFromPixel(event.pixel);
      const transformedCoord = transform(
        clickedCoord,
        "EPSG:3857",
        "EPSG:4326"
      );
      setSelectedCoordinates([transformedCoord[0], transformedCoord[1]]);

      const marker = new Feature({
        geometry: new Point(clickedCoord),
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

      vectorSource.clear();
      vectorSource.addFeature(marker);
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
