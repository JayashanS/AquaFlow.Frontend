import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid2,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ImageCropper from "./ImageCropper";
import { useCreateWorker } from "../hooks/useWorker";
import { useFishFarms } from "../hooks/useFishFarms";
import { useWorkerPositions } from "../hooks/useWorkerPositions";
import { CreateWorkerDTO, WorkerFormProps } from "../interfaces/worker";
import {
  FishFarmFilters,
  getDefaultFilters,
  HandleFishFarmFilterChangeProps,
} from "../interfaces/fishFarm";
import { checkEmail } from "../services/workerService";

const WorkerForm: React.FC<WorkerFormProps> = ({ setMode }) => {
  const { control, handleSubmit, setValue } = useForm<CreateWorkerDTO>();
  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);
  const [filters, setFilters] = useState<FishFarmFilters>(getDefaultFilters());

  const createWorkerMutation = useCreateWorker();
  const { data } = useFishFarms(filters);
  const { data: workerPositions } = useWorkerPositions();

  const onSubmit = async (data: CreateWorkerDTO) => {
    if (await checkEmail(data.email)) {
      window.alert("Email already in use");
      return;
    }
    const newWorkerData = new FormData();
    newWorkerData.append("name", data.name);
    newWorkerData.append("age", data.age.toString());
    newWorkerData.append("email", data.email);
    newWorkerData.append("positionId", data.positionId.toString());
    newWorkerData.append("certifiedUntil", data.certifiedUntil);
    newWorkerData.append("fishFarmId", data.fishFarmId.toString());

    if (selectedPicture) {
      newWorkerData.append("picture", selectedPicture);
    }

    createWorkerMutation.mutate(newWorkerData, {
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
            rules={{ required: "Position is required" }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth size="small" error={!!fieldState.error}>
                <InputLabel>Position</InputLabel>
                <Select
                  {...field}
                  label="Position"
                  value={String(field.value)}
                  onChange={(e) =>
                    setValue("positionId", Number(e.target.value))
                  }
                  defaultValue=""
                >
                  {workerPositions?.map((position) => (
                    <MenuItem key={position.id} value={position.id}>
                      {position.name}
                    </MenuItem>
                  ))}
                </Select>
                {fieldState.error && (
                  <div style={{ color: "red" }}>
                    {fieldState.error?.message}
                  </div>
                )}
              </FormControl>
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
