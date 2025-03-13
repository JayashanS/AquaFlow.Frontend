import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useUpdateWorker } from "../hooks/useWorker";
import { useFishFarms } from "../hooks/useFishFarms";
import { useWorkerPositions } from "../hooks/useWorkerPositions";
import {
  FishFarmFilters,
  getDefaultFilters,
  HandleFishFarmFilterChangeProps,
} from "../interfaces/fishFarm";
import ImageCropper from "./ImageCropper";
import { WorkerEditFormProps } from "../interfaces/worker";

type Value = { fishFaimId: number; fishFarmName: string } | null;
const WorkerEditForm: React.FC<WorkerEditFormProps> = ({
  open,
  onClose,
  worker,
}) => {
  const { control, handleSubmit, reset, setValue } = useForm();
  const updateWorkerMutation = useUpdateWorker();
  // @ts-expect-error - state
  const [filters, setFilters] = useState<FishFarmFilters>(getDefaultFilters());
  const { data } = useFishFarms(filters);
  const { data: workerPositions } = useWorkerPositions();
  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<Value>(
    worker
      ? { fishFaimId: worker.fishFarmId, fishFarmName: worker.fishFarmName }
      : null
  );

  const onSubmit = async (data: any) => {
    const updatedWorkerData = new FormData();
    updatedWorkerData.append("name", data.name);
    updatedWorkerData.append("age", data.age.toString());
    updatedWorkerData.append("email", data.email);
    updatedWorkerData.append("positionId", data.positionId.toString());
    updatedWorkerData.append("certifiedUntil", data.certifiedUntil);
    updatedWorkerData.append("fishFarmId", data.fishFarmId.toString());

    if (selectedPicture) {
      updatedWorkerData.append("picture", selectedPicture);
    }
    updateWorkerMutation.mutate(
      { workerId: data.id, updatedWorkerData: updatedWorkerData },
      {
        onSuccess: () => {
          alert("Worker updated successfully!");
          onClose();
        },
        onError: (error) => {
          alert("Failed to update worker: " + error.message);
        },
      }
    );
  };

  useEffect(() => {
    if (worker) {
      reset(worker);
    }
  }, [worker, reset]);

  useEffect(() => {
    if (worker) {
      reset(worker);
      setValue("certifiedUntil", worker.certifiedUntil.split("T")[0]);

      if (data?.fishFarms) {
        const selectedFarm = data.fishFarms.find(
          (farm: any) => farm.id === worker.fishFarmId
        );
        setValue("fishFarmId", selectedFarm || null);
      }
    }
  }, [worker, reset, data]);

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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Worker</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 size={{ xs: 12, md: 12 }} spacing={2}>
            <ImageCropper onPictureChange={handlePictureChange} />
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
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
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
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
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
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
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
                  value={field.value ? field.value.split("T")[0] : ""}
                  onChange={(e) => setValue("certifiedUntil", e.target.value)}
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.message}
                  sx={{ mb: 2, mt: 2 }}
                />
              )}
            />

            <Controller
              name="fishFarmId"
              control={control}
              rules={{ required: "Fish Farm is required" }}
              render={({ field, fieldState }) => (
                <Autocomplete
                  {...field}
                  options={data?.fishFarms || []}
                  getOptionLabel={(option) => option.name}
                  value={
                    data?.fishFarms?.find(
                      (farm: any) => farm.id === field.value
                    ) || null
                  }
                  onChange={(_, value) =>
                    setValue("fishFarmId", value ? value.id : null)
                  }
                  // onInputChange={(_, newInputValue) =>
                  //   handleFilterChange({ name: "name", value: newInputValue })
                  // }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Fish Farm"
                      fullWidth
                      size="small"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
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

export default WorkerEditForm;
