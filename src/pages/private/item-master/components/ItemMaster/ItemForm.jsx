// src/components/ItemMaster/ItemForm.jsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Grid,
  Button,
  DialogActions,
  InputAdornment,
  FormControlLabel,
  Switch,
  MenuItem,
  Box,
  Tabs,
  Tab,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import UnitConversionsTab from "./UnitConversionsTab";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`item-tabpanel-${index}`}
      aria-labelledby={`item-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ItemForm = ({ onSubmit, defaultValues, onCancel, categories, units }) => {
  const [tabValue, setTabValue] = useState(0);
  const [unitConversions, setUnitConversions] = useState(
    defaultValues?.unitConversions || [],
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      code: "",
      name: "",
      description: "",
      categoryId: "",
      hsnCode: "",
      baseUnitId: "",
      purchaseUnitId: "",
      salesUnitId: "",
      minStockLevel: 0,
      maxStockLevel: 0,
      reorderLevel: 0,
      batchEnabled: false,
      isTaxable: true,
      cgstRate: 0,
      sgstRate: 0,
      igstRate: 0,
      cessRate: 0,
      isActive: true,
    },
  });

  const isTaxable = watch("isTaxable");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUnitConversionsChange = (updatedConversions) => {
    setUnitConversions(updatedConversions);
  };

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      unitConversions,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="item form tabs"
        >
          <Tab label="Basic Information" />
          <Tab label="Inventory" />
          <Tab label="Tax" />
          <Tab label="Unit Conversions" />
        </Tabs>
      </Box>

      {/* Basic Information Tab */}
      <TabPanel value={tabValue} index={0}>
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
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Category"
                    error={!!errors.categoryId}
                  >
                    {categories?.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.categoryId && (
                <Typography color="error" variant="caption">
                  {errors.categoryId.message}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="hsnCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="HSN Code"
                  fullWidth
                  margin="normal"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Base Unit</InputLabel>
              <Controller
                name="baseUnitId"
                control={control}
                rules={{ required: "Base unit is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Base Unit"
                    error={!!errors.baseUnitId}
                  >
                    {units?.map((unit) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.baseUnitId && (
                <Typography color="error" variant="caption">
                  {errors.baseUnitId.message}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Purchase Unit</InputLabel>
              <Controller
                name="purchaseUnitId"
                control={control}
                rules={{ required: "Purchase unit is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Purchase Unit"
                    error={!!errors.purchaseUnitId}
                  >
                    {units?.map((unit) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.purchaseUnitId && (
                <Typography color="error" variant="caption">
                  {errors.purchaseUnitId.message}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Sales Unit</InputLabel>
              <Controller
                name="salesUnitId"
                control={control}
                rules={{ required: "Sales unit is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Sales Unit"
                    error={!!errors.salesUnitId}
                  >
                    {units?.map((unit) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.salesUnitId && (
                <Typography color="error" variant="caption">
                  {errors.salesUnitId.message}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="isActive"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={onChange}
                      color="primary"
                    />
                  }
                  label="Active"
                />
              )}
            />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Inventory Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Controller
              name="minStockLevel"
              control={control}
              rules={{
                min: { value: 0, message: "Minimum stock cannot be negative" },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Minimum Stock Level"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.minStockLevel}
                  helperText={errors.minStockLevel?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller
              name="maxStockLevel"
              control={control}
              rules={{
                min: { value: 0, message: "Maximum stock cannot be negative" },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Maximum Stock Level"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.maxStockLevel}
                  helperText={errors.maxStockLevel?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller
              name="reorderLevel"
              control={control}
              rules={{
                min: { value: 0, message: "Reorder level cannot be negative" },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Reorder Level"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.reorderLevel}
                  helperText={errors.reorderLevel?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="batchEnabled"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={onChange}
                      color="primary"
                    />
                  }
                  label="Enable Batch Tracking"
                />
              )}
            />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tax Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="isTaxable"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={onChange}
                      color="primary"
                    />
                  }
                  label="Taxable Item"
                />
              )}
            />
          </Grid>
          {isTaxable && (
            <>
              <Grid item xs={12} md={3}>
                <Controller
                  name="cgstRate"
                  control={control}
                  rules={{
                    min: { value: 0, message: "CGST cannot be negative" },
                    max: { value: 100, message: "CGST cannot exceed 100%" },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="CGST Rate"
                      type="number"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      error={!!errors.cgstRate}
                      helperText={errors.cgstRate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="sgstRate"
                  control={control}
                  rules={{
                    min: { value: 0, message: "SGST cannot be negative" },
                    max: { value: 100, message: "SGST cannot exceed 100%" },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="SGST Rate"
                      type="number"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      error={!!errors.sgstRate}
                      helperText={errors.sgstRate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="igstRate"
                  control={control}
                  rules={{
                    min: { value: 0, message: "IGST cannot be negative" },
                    max: { value: 100, message: "IGST cannot exceed 100%" },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="IGST Rate"
                      type="number"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      error={!!errors.igstRate}
                      helperText={errors.igstRate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="cessRate"
                  control={control}
                  rules={{
                    min: { value: 0, message: "CESS cannot be negative" },
                    max: { value: 100, message: "CESS cannot exceed 100%" },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="CESS Rate"
                      type="number"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      error={!!errors.cessRate}
                      helperText={errors.cessRate?.message}
                    />
                  )}
                />
              </Grid>
            </>
          )}
        </Grid>
      </TabPanel>

      {/* Unit Conversions Tab */}
      <TabPanel value={tabValue} index={3}>
        <UnitConversionsTab
          unitConversions={unitConversions}
          onUnitConversionsChange={handleUnitConversionsChange}
          units={units}
        />
      </TabPanel>

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
