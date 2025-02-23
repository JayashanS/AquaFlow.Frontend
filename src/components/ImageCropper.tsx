import React, { useState, useRef } from "react";
import Cropper from "react-cropper";
import type { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button, Box, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { ImageCropperProps } from "../interfaces/fishFarm";

interface CropperRef {
  cropper: ReactCropperElement["cropper"];
}

const ImageCropper: React.FC<ImageCropperProps> = ({ onPictureChange }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const cropperRef = useRef<CropperRef | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          setImageSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const cropImage = (): void => {
    if (cropperRef.current?.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();

      if (croppedCanvas) {
        croppedCanvas.toBlob((blob: Blob | null) => {
          if (blob) {
            const file = new File([blob], "cropped-image.png", {
              type: "image/png",
            });
            onPictureChange(file);
            const croppedImageUrl = URL.createObjectURL(blob);
            setCroppedImage(croppedImageUrl);
          }
        }, "image/png");
      }
    }
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <IconButton
        onClick={handleFileInputClick}
        sx={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          backgroundColor: "#1976d2",
          color: "white",
          "&:hover": {
            backgroundColor: "#1565c0",
          },
        }}
      >
        <PhotoCamera fontSize="large" />
      </IconButton>
      <input
        type="file"
        onChange={onFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
      />

      {imageSrc && !croppedImage && (
        <Box sx={{ mb: 2, width: "100%", maxWidth: "500px" }}>
          <Cropper
            ref={cropperRef as React.RefObject<ReactCropperElement>}
            src={imageSrc}
            style={{ height: 400, width: "100%" }}
            aspectRatio={16 / 9}
            guides={true}
            viewMode={1}
            background={false}
          />
          <Button
            onClick={cropImage}
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: "100%" }}
          >
            Crop Image
          </Button>
        </Box>
      )}

      {croppedImage && (
        <Box
          sx={{
            mt: 2,
            width: "100%",
            maxWidth: "500px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <img
            src={croppedImage}
            alt="Cropped"
            style={{ width: "100%", height: "auto" }}
          />
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={() => setCroppedImage(null)}
          >
            Clear Cropped Image
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ImageCropper;
