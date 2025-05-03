// src/components/ItemMaster/UnitConversionsTab.jsx
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";

const UnitConversionForm = ({
  onSubmit,
  onCancel,
  defaultValues,
  units,
  baseUnitId,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      fromUnitId: "",
      toUnitId: "",
      conversionFactor: 1,
      isActive: true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ mt: 2 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>From Unit</InputLabel>
          <Controller
            name="fromUnitId"
            control={control}
            rules={{ required: "From unit is required" }}
            render={({ field }) => (
              <Select {...field} label="From Unit" error={!!errors.fromUnitId}>
                {units?.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.fromUnitId && (
            <Typography color="error" variant="caption">
              {errors.fromUnitId.message}
            </Typography>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>To Unit</InputLabel>
          <Controller
            name="toUnitId"
            control={control}
            rules={{ required: "To unit is required" }}
            render={({ field }) => (
              <Select {...field} label="To Unit" error={!!errors.toUnitId}>
                {units?.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.toUnitId && (
            <Typography color="error" variant="caption">
              {errors.toUnitId.message}
            </Typography>
          )}
        </FormControl>

        <Controller
          name="conversionFactor"
          control={control}
          rules={{
            required: "Conversion factor is required",
            min: {
              value: 0.000001,
              message: "Conversion factor must be greater than zero",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Conversion Factor"
              fullWidth
              margin="normal"
              error={!!errors.conversionFactor}
              helperText={errors.conversionFactor?.message}
              inputProps={{ step: "0.000001" }}
            />
          )}
        />
      </Box>

      <DialogActions sx={{ mt: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </form>
  );
};

const UnitConversionsTab = ({
  unitConversions,
  onUnitConversionsChange,
  units,
  baseUnitId,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingConversion, setEditingConversion] = useState(null);

  const handleAddConversion = () => {
    setEditingConversion(null);
    setOpenDialog(true);
  };

  const handleEditConversion = (conversion) => {
    setEditingConversion(conversion);
    setOpenDialog(true);
  };

  const handleDeleteConversion = (id) => {
    const updatedConversions = unitConversions.filter((conv) => conv.id !== id);
    onUnitConversionsChange(updatedConversions);
  };

  const handleSaveConversion = (data) => {
    if (editingConversion) {
      // Edit existing conversion
      const updatedConversions = unitConversions.map((conv) =>
        conv.id === editingConversion.id ? { ...conv, ...data } : conv,
      );
      onUnitConversionsChange(updatedConversions);
    } else {
      // Add new conversion
      const newConversion = {
        ...data,
        id: Date.now(), // Temporary ID until saved to backend
        isActive: true,
      };
      onUnitConversionsChange([...unitConversions, newConversion]);
    }
    setOpenDialog(false);
  };

  const getUnitNameById = (id) => {
    const unit = units?.find((u) => u.id === id);
    return unit ? unit.name : "Unknown Unit";
  };

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddConversion}
        >
          Add Conversion
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>From Unit</TableCell>
              <TableCell>To Unit</TableCell>
              <TableCell align="right">Conversion Factor</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unitConversions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No unit conversions added
                </TableCell>
              </TableRow>
            ) : (
              unitConversions.map((conversion) => (
                <TableRow key={conversion.id}>
                  <TableCell>
                    {conversion.fromUnitName ||
                      getUnitNameById(conversion.fromUnitId)}
                  </TableCell>
                  <TableCell>
                    {conversion.toUnitName ||
                      getUnitNameById(conversion.toUnitId)}
                  </TableCell>
                  <TableCell align="right">
                    {conversion.conversionFactor}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleEditConversion(conversion)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteConversion(conversion.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingConversion ? "Edit Unit Conversion" : "Add Unit Conversion"}
        </DialogTitle>
        <DialogContent>
          <UnitConversionForm
            onSubmit={handleSaveConversion}
            onCancel={() => setOpenDialog(false)}
            defaultValues={editingConversion}
            units={units}
            baseUnitId={baseUnitId}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UnitConversionsTab;
