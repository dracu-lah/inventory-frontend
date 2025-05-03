// src/components/ItemMaster/ItemForm.jsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Grid,
  Button,
  DialogActions,
  InputAdornment,
} from "@mui/material";

const ItemForm = ({ onSubmit, defaultValues, onCancel }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      code: "",
      name: "",
      cgst: 0,
      sgst: 0,
      igst: 0,
      cess: 0,
      price: 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Controller
            name="code"
            control={control}
            rules={{ required: "Item code is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Item Code"
                fullWidth
                margin="normal"
                error={!!errors.code}
                helperText={errors.code?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Item name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Item Name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="cgst"
            control={control}
            rules={{
              required: "CGST is required",
              min: { value: 0, message: "CGST cannot be negative" },
              max: { value: 100, message: "CGST cannot exceed 100%" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="CGST"
                type="number"
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                error={!!errors.cgst}
                helperText={errors.cgst?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="sgst"
            control={control}
            rules={{
              required: "SGST is required",
              min: { value: 0, message: "SGST cannot be negative" },
              max: { value: 100, message: "SGST cannot exceed 100%" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="SGST"
                type="number"
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                error={!!errors.sgst}
                helperText={errors.sgst?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="igst"
            control={control}
            rules={{
              required: "IGST is required",
              min: { value: 0, message: "IGST cannot be negative" },
              max: { value: 100, message: "IGST cannot exceed 100%" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="IGST"
                type="number"
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                error={!!errors.igst}
                helperText={errors.igst?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="cess"
            control={control}
            rules={{
              required: "CESS is required",
              min: { value: 0, message: "CESS cannot be negative" },
              max: { value: 100, message: "CESS cannot exceed 100%" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="CESS"
                type="number"
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                error={!!errors.cess}
                helperText={errors.cess?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="price"
            control={control}
            rules={{
              required: "Price is required",
              min: { value: 0, message: "Price cannot be negative" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Price"
                type="number"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            )}
          />
        </Grid>
      </Grid>
      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </form>
  );
};

export default ItemForm;
