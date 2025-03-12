import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat, transformExtent } from "ol/proj";
import { Modal, Box, Button } from "@mui/material";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Fill, Stroke } from "ol/style";
import { DragBox } from "ol/interaction";
import { platformModifierKeyOnly } from "ol/events/condition";
import "ol/ol.css";

export interface FishFarmLocationPickerProps {
  open: boolean;
  onClose: () => void;
  bounds: [number, number, number, number] | null;
  onCoordinatesSelect: (coordinates: [number, number, number, number]) => void;
}

const LocationPicker: React.FC<FishFarmLocationPickerProps> = ({
  open,
  onClose,
  bounds,
  onCoordinatesSelect,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const vectorSourceRef = useRef(new VectorSource());
  const [selectedExtent, setSelectedExtent] = useState<
    [number, number, number, number] | null
  >(bounds);

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

    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
      style: new Style({
        fill: new Fill({ color: "rgba(255, 0, 0, 0.3)" }),
        stroke: new Stroke({ color: "red", width: 2 }),
      }),
    });

    initialMap.addLayer(vectorLayer);
    mapInstanceRef.current = initialMap;
    vectorLayerRef.current = vectorLayer;

    initialMap.setTarget(mapRef.current);

    const dragBox = new DragBox({
      condition: platformModifierKeyOnly,
    });

    dragBox.on("boxend", () => {
      const extent = dragBox.getGeometry().getExtent();
      const transformedExtent = transformExtent(
        extent,
        "EPSG:3857",
        "EPSG:4326"
      );
      console.log("Selected area corners:", transformedExtent);
      setSelectedExtent(transformedExtent as [number, number, number, number]);
    });

    initialMap.addInteraction(dragBox);

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
    }
  }, [open]);

  const handleAddCoordinates = () => {
    if (selectedExtent) {
      onCoordinatesSelect(selectedExtent);
      onClose();
    }
  };

  const handleClear = () => {
    onCoordinatesSelect([0, 0, 0, 0]);
    setSelectedExtent(null);
    onClose();
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
    <Modal open={open} onClose={onClose} aria-labelledby="map-modal-title">
      <Box sx={modalStyle}>
        <div
          ref={mapRef}
          style={{ width: "100%", height: "400px", marginBottom: "1rem" }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button onClick={handleClear} variant="outlined">
            Clear
          </Button>
          <Button
            onClick={handleAddCoordinates}
            variant="contained"
            disabled={!selectedExtent}
          >
            Add Selected Area
          </Button>
        </Box>
        {selectedExtent && (
          <Box sx={{ mt: 2 }}>
            Selected area:{" "}
            {selectedExtent.map((coord) => coord.toFixed(4)).join(", ")}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default LocationPicker;
