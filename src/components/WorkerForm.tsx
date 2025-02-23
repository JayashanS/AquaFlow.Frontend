import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Grid2, Autocomplete } from "@mui/material";
import ImageCropper from "./ImageCropper";
import { useCreateWorker } from "../hooks/useWorker";
import { useFishFarms } from "../hooks/useFishFarms";
import { CreateWorkerDTO, WorkerFormProps } from "../interfaces/worker";
import {
  FishFarmFilters,
  getDefaultFilters,
  HandleFishFarmFilterChangeProps,
} from "../interfaces/fishFarm";

const WorkerForm: React.FC<WorkerFormProps> = ({ setMode }) => {
  const { control, handleSubmit, setValue } = useForm<CreateWorkerDTO>();
  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);
  const [filters, setFilters] = useState<FishFarmFilters>(getDefaultFilters());

  const createWorkerMutation = useCreateWorker();
  const { data } = useFishFarms(filters);

  const onSubmit = async (data: CreateWorkerDTO) => {
    if (!selectedPicture) {
      alert("Please upload an image for the worker.");
      return;
    }
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("age", data.age.toString());
    formData.append("email", data.email);
    formData.append("positionId", data.positionId.toString());
    formData.append("certifiedUntil", data.certifiedUntil);
    formData.append("fishFarmId", data.fishFarmId.toString());

    if (selectedPicture) {
      formData.append("picture", selectedPicture);
    }

    console.log("Form Data:", Object.fromEntries(formData));

    createWorkerMutation.mutate(formData, {
      onSuccess: () => {
        alert("Worker created successfully!");
        setMode("view");
      },
      onError: (error) => {
        alert("Failed to create worker: " + error.message);
      },
    });
  };

  const handleFilterChange = ({
    name,
    value,
  }: HandleFishFarmFilterChangeProps) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            rules={{ required: "Name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Worker Name"
                fullWidth
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 12 }}>
          <Controller
            name="age"
            control={control}
            rules={{
              required: "Age is required",
              min: { value: 18, message: "Minimum age is 18" },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                label="Age"
                fullWidth
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 12 }}>
          {" "}
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="email"
                label="Email"
                fullWidth
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 12 }}>
          <Controller
            name="positionId"
            control={control}
            rules={{ required: "Position ID is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                label="Position ID"
                fullWidth
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 12 }}>
          {" "}
          <Controller
            name="certifiedUntil"
            control={control}
            rules={{ required: "Certification date is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="date"
                label="Certified Until"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 12 }}>
          <Controller
            name="fishFarmId"
            control={control}
            rules={{ required: "Fish Farm ID is required" }}
            render={({ field, fieldState }) => (
              <Autocomplete
                {...field}
                options={data?.fishFarms || []}
                // @ts-expect-error - MUI
                getOptionLabel={(option) => option.name}
                onInputChange={(_, newInputValue) =>
                  handleFilterChange({ name: "name", value: newInputValue })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Fish Farm ID"
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
                onChange={(_, value) => {
                  // @ts-expect-error - MUI
                  setValue("fishFarmId", value?.id || "");
                }}
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
    </form>
  );
};

export default WorkerForm;
