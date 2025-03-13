import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid2,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useUpdateFishFarms } from "../hooks/useFishFarms";
import ImageCropper from "./ImageCropper";
import { FishFarmEditFormProps } from "../interfaces/fishFarm";

const WorkerModal: React.FC<FishFarmEditFormProps> = ({
  open,
  onClose,
  fishFarm,
}) => {
  const { control, handleSubmit, reset, setValue } = useForm();
  const updateFishFarmMutation = useUpdateFishFarms();
  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);

  const onSubmit = async (data: any) => {
    const updatedFishFarmData = new FormData();
    updatedFishFarmData.append("name", data.name);
    updatedFishFarmData.append("latitude", data.latitude.toString());
    updatedFishFarmData.append("longitude", data.longitude.toString());
    updatedFishFarmData.append("numberOfCages", data.numberOfCages.toString());
    updatedFishFarmData.append("hasBarge", data.hasBarge ? "true" : "false");

    if (selectedPicture) {
      updatedFishFarmData.append("picture", selectedPicture);
    }
    updateFishFarmMutation.mutate(
      { fishfarmId: data.id, updatedFishFarm: updatedFishFarmData },
      {
        onSuccess: () => {
          alert("FishFarm updated successfully!");
          onClose();
        },
        onError: (error: any) => {
          alert("Failed to update worker: " + error.message);
        },
      }
    );
  };

  useEffect(() => {
    if (fishFarm) {
      reset(fishFarm);
    }
  }, [fishFarm, reset]);

  const handlePictureChange = (croppedImage: File | null) => {
    if (croppedImage) {
      setValue("picture", croppedImage);
      setSelectedPicture(croppedImage);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Fish Farm</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 size={{ xs: 12, md: 12 }} spacing={2}>
            <ImageCropper onPictureChange={handlePictureChange} />
            <Controller
              name="name"
              control={control}
              rules={{ required: "Fish farm name is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Fish Farm Name"
                  fullWidth
                  size="small"
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Controller
              name="latitude"
              control={control}
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
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Latitude"
                  fullWidth
                  size="small"
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Controller
              name="longitude"
              control={control}
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
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Longitude"
                  fullWidth
                  size="small"
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Controller
              name="numberOfCages"
              control={control}
              rules={{ required: "Number of cages is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Number of Cages"
                  fullWidth
                  size="small"
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Controller
              name="hasBarge"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={Boolean(field.value)}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Has Barge"
                />
              )}
            />
          </Grid2>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Update
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerModal;
