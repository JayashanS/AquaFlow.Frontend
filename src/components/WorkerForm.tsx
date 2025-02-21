import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";

const WorkerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    picture: null,
    age: "",
    email: "",
    position: "",
    certifiedUntil: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? e.target.files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Typography variant="h5">Worker Registration</Typography>

      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
      />

      <input type="file" name="picture" onChange={handleChange} />

      <TextField
        label="Age"
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>Worker Position</InputLabel>
        <Select
          name="position"
          value={formData.position}
          onChange={handleChange}
        >
          <MenuItem value="CEO">CEO</MenuItem>
          <MenuItem value="Worker">Worker</MenuItem>
          <MenuItem value="Captain">Captain</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Certified Until"
        type="date"
        name="certifiedUntil"
        value={formData.certifiedUntil}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
      />

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Submit
      </Button>
    </form>
  );
};

export default WorkerForm;
