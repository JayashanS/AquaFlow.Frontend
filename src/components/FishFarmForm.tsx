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
import OpenLayersMap from "./FishFarmLocationPicker";
import { useCreateFishFarm } from "../hooks/useFishFarms";
import { FishFarmFormProps, FishFarmFormData } from "../interfaces/fishFarm";

const FishFarmForm: React.FC<FishFarmFormProps> = ({ setMode }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FishFarmFormData>({
    defaultValues: {
      picture: null,
    },
  });
  const [openMap, setOpenMap] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);
  const createFishFarmMutation = useCreateFishFarm();

  const onSubmit = async (data: FishFarmFormData) => {
    if (!selectedPicture) {
      alert("Please upload a picture.");
      return;
    }
    const newFishFarmData = new FormData();
    newFishFarmData.append("name", data.name);
    newFishFarmData.append("latitude", data.latitude.toString());
    newFishFarmData.append("longitude", data.longitude.toString());
    newFishFarmData.append("numberOfCages", data.numberOfCages.toString());
    newFishFarmData.append("hasBarge", data.hasBarge.toString());

    if (selectedPicture) {
      newFishFarmData.append("picture", selectedPicture);
    }

    createFishFarmMutation.mutate(newFishFarmData, {
      onSuccess: () => {
        alert("Fish farm created successfully!");
        setMode("view");
      },
      onError: (error) => {
        alert("Failed to create fish farm: " + error.message);
      },
    });
  };

  const handleCoordinatesSelect = (coordinates: [number, number]) => {
    setValue("latitude", parseFloat(coordinates[0].toFixed(4)));
    setValue("longitude", parseFloat(coordinates[1].toFixed(4)));
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
          {errors.picture && <span>{errors.picture.message}</span>}
        </Grid2>
        <Grid2 size={{ xs: 12, md: 12 }}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: "Fish farm name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Fish Farm Name"
                fullWidth
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 5 }}>
          <Controller
            name="latitude"
            control={control}
            defaultValue={0}
            rules={{
              required: "Latitude is required",
              min: {
                value: -90,
                message: "Latitude must be between -90 and 90",
              },
              max: {
                value: 90,
                message: "Latitude must be between -90 and 90",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Latitude"
                fullWidth
                size="small"
                error={!!errors.latitude}
                helperText={errors.latitude?.message}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 5 }}>
          <Controller
            name="longitude"
            control={control}
            defaultValue={0}
            rules={{
              required: "Longitude is required",
              min: {
                value: -180,
                message: "Longitude must be between -180 and 180",
              },
              max: {
                value: 180,
                message: "Longitude must be between -180 and 180",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Longitude"
                fullWidth
                size="small"
                error={!!errors.longitude}
                helperText={errors.longitude?.message}
              />
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
            rules={{ required: "Number of cages is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Number of Cages"
                type="number"
                fullWidth
                size="small"
                error={!!errors.numberOfCages}
                helperText={errors.numberOfCages?.message}
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
