import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid2,
  IconButton,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ImageCropper from "./ImageCropper";
import OpenLayersMap from "./OpenLayersMap";
import { useCreateFishFarm } from "../hooks/useFishFarms";
import { FishFarmFormProps } from "../interfaces/global";

interface FishFarmFormData {
  name: string;
  latitude: number;
  longitude: number;
  numberOfCages: number;
  hasBarge: boolean;
  picture: File | null;
}

const FishFarmForm: React.FC<FishFarmFormProps> = ({ setMode }) => {
  const { control, handleSubmit, setValue } = useForm<FishFarmFormData>();
  const [openMap, setOpenMap] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);
  const createFishFarmMutation = useCreateFishFarm();

  const onSubmit = async (data: FishFarmFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("latitude", data.latitude.toString());
    formData.append("longitude", data.longitude.toString());
    formData.append("numberOfCages", data.numberOfCages.toString());
    formData.append("hasBarge", data.hasBarge.toString());

    if (selectedPicture) {
      formData.append("picture", selectedPicture);
    }

    console.log("Form fields:", {
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      numberOfCages: data.numberOfCages,
      hasBarge: data.hasBarge,
      picture: selectedPicture
        ? {
            name: selectedPicture.name,
            type: selectedPicture.type,
            size: selectedPicture.size,
          }
        : null,
    });
    createFishFarmMutation.mutate(formData, {
      onSuccess: () => {
        alert("Fish farm created successfully!");
      },
      onError: (error) => {
        alert("Failed to create fish farm: " + error.message);
      },
    });
    setMode("view");
  };

  const handleCoordinatesSelect = (coordinates: [number, number]) => {
    setValue("latitude", coordinates[0]);
    setValue("longitude", coordinates[1]);
  };

  const handlePictureChange = (croppedImage: File | null) => {
    if (croppedImage) {
      setValue("picture", croppedImage);
      setSelectedPicture(croppedImage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid2
        container
        spacing={2}
        sx={{
          overflowY: "auto",

          marginTop: "20px",
          paddingLeft: "20vw",
          paddingRight: "20vw",
        }}
      >
        <Grid2 size={{ xs: 12 }}>
          <ImageCropper onPictureChange={handlePictureChange} />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 12 }}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Fish Farm Name"
                fullWidth
                size="small"
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 5 }}>
          <Controller
            name="latitude"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField {...field} label="Latitude" fullWidth size="small" />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 5 }}>
          <Controller
            name="longitude"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField {...field} label="Longitude" fullWidth size="small" />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 2 }}>
          <IconButton onClick={() => setOpenMap(true)}>
            <MyLocationIcon />
          </IconButton>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Controller
            name="numberOfCages"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                label="Number of Cages"
                type="number"
                fullWidth
                size="small"
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Controller
            name="hasBarge"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Has Barge"
              />
            )}
          />
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Button type="submit" variant="outlined" color="primary" fullWidth>
            Submit
          </Button>
        </Grid2>
      </Grid2>

      <OpenLayersMap
        open={openMap}
        onClose={() => setOpenMap(false)}
        onCoordinatesSelect={handleCoordinatesSelect}
      />
    </form>
  );
};

export default FishFarmForm;
