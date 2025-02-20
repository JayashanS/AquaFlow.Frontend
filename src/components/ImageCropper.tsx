import React, { useState, useRef } from "react";
import Cropper from "react-cropper";
import type { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface CropperRef {
  cropper: ReactCropperElement["cropper"];
}

const ImageCropper: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const cropperRef = useRef<CropperRef | null>(null);

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
            const croppedImageUrl = URL.createObjectURL(blob);
            setCroppedImage(croppedImageUrl);
          }
        }, "image/png");
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="mb-4"
      />

      {imageSrc && (
        <div className="space-y-4">
          <Cropper
            ref={cropperRef as React.RefObject<ReactCropperElement>}
            src={imageSrc}
            style={{ height: 400, width: "100%" }}
            aspectRatio={1}
            guides={true}
            viewMode={1}
            background={false}
          />

          <button
            onClick={cropImage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Crop Image
          </button>
        </div>
      )}

      {croppedImage && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Cropped Result:</h3>
          <img src={croppedImage} alt="Cropped" className="max-w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
