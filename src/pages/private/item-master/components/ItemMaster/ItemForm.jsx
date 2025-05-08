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
  Paper,
  Container,
} from "@mui/material";
import UnitConversionsTab from "./UnitConversionsTab";

// Sample dummy data for dropdowns
const DUMMY_CATEGORIES = [
  { id: "cat1", name: "Raw Materials" },
  { id: "cat2", name: "Finished Goods" },
  { id: "cat3", name: "Packaging" },
  { id: "cat4", name: "Services" },
  { id: "cat5", name: "Office Supplies" },
];

const DUMMY_UNITS = [
  { id: "unit1", name: "Piece (Pcs)" },
  { id: "unit2", name: "Kilogram (Kg)" },
  { id: "unit3", name: "Liter (L)" },
  { id: "unit4", name: "Box" },
  { id: "unit5", name: "Meter (m)" },
  { id: "unit6", name: "Carton" },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`item-tabpanel-${index}`}
      aria-labelledby={`item-tab-${index}`}
      {...other}
      style={{ minHeight: "400px" }} // Ensure consistent height
    >
      {value === index && (
        <Box sx={{ pt: 3, pb: 2 }}>
          <Paper sx={{ p: 2 }}>{children}</Paper>
        </Box>
      )}
    </div>
  );
}

const ItemForm = ({
  onSubmit,
  defaultValues,
  onCancel,
  categories = [],
  units = [],
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [unitConversions, setUnitConversions] = useState(
    defaultValues?.unitConversions || [],
  );

  // Use dummy data if no real data is provided
  const displayCategories =
    categories.length > 0 ? categories : DUMMY_CATEGORIES;
  const displayUnits = units.length > 0 ? units : DUMMY_UNITS;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      code: "ITM001",
      name: "Sample Item",
      description: "This is a sample item description",
      categoryId: displayCategories[0]?.id || "",
      hsnCode: "8471",
      baseUnitId: displayUnits[0]?.id || "",
      purchaseUnitId: displayUnits[0]?.id || "",
      salesUnitId: displayUnits[0]?.id || "",
      minStockLevel: 10,
      maxStockLevel: 100,
      reorderLevel: 20,
      batchEnabled: false,
      isTaxable: true,
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 18,
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
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="item form tabs"
          variant="fullWidth"
          sx={{ backgroundColor: "background.paper" }}
        >
          <Tab label="Basic Information" sx={{ py: 2 }} />
          <Tab label="Inventory" sx={{ py: 2 }} />
          <Tab label="Tax" sx={{ py: 2 }} />
          <Tab label="Unit Conversions" sx={{ py: 2 }} />
        </Tabs>
      </Box>

      {/* Basic Information Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
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
                  variant="outlined"
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
                  variant="outlined"
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
                  variant="outlined"
                  multiline
                  rows={3}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-label">Category</InputLabel>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="category-label"
                    label="Category"
                    error={!!errors.categoryId}
                  >
                    {displayCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.categoryId && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{ mt: 0.5, ml: 1.5 }}
                >
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
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="base-unit-label">Base Unit</InputLabel>
              <Controller
                name="baseUnitId"
                control={control}
                rules={{ required: "Base unit is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="base-unit-label"
                    label="Base Unit"
                    error={!!errors.baseUnitId}
                  >
                    {displayUnits.map((unit) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.baseUnitId && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{ mt: 0.5, ml: 1.5 }}
                >
                  {errors.baseUnitId.message}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="purchase-unit-label">Purchase Unit</InputLabel>
              <Controller
                name="purchaseUnitId"
                control={control}
                rules={{ required: "Purchase unit is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="purchase-unit-label"
                    label="Purchase Unit"
                    error={!!errors.purchaseUnitId}
                  >
                    {displayUnits.map((unit) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.purchaseUnitId && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{ mt: 0.5, ml: 1.5 }}
                >
                  {errors.purchaseUnitId.message}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="sales-unit-label">Sales Unit</InputLabel>
              <Controller
                name="salesUnitId"
                control={control}
                rules={{ required: "Sales unit is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="sales-unit-label"
                    label="Sales Unit"
                    error={!!errors.salesUnitId}
                  >
                    {displayUnits.map((unit) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.salesUnitId && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{ mt: 0.5, ml: 1.5 }}
                >
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Controller
              name="minStockLevel"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: "Minimum stock cannot be negative",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Minimum Stock Level"
                  type="number"
                  fullWidth
                  variant="outlined"
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
                min: {
                  value: 0,
                  message: "Maximum stock cannot be negative",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Maximum Stock Level"
                  type="number"
                  fullWidth
                  variant="outlined"
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
                min: {
                  value: 0,
                  message: "Reorder level cannot be negative",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Reorder Level"
                  type="number"
                  fullWidth
                  variant="outlined"
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
        <Grid container spacing={3}>
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
              <Grid item xs={12} sm={6} md={3}>
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
                      variant="outlined"
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
              <Grid item xs={12} sm={6} md={3}>
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
                      variant="outlined"
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
              <Grid item xs={12} sm={6} md={3}>
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
                      variant="outlined"
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
              <Grid item xs={12} sm={6} md={3}>
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
                      variant="outlined"
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
          units={displayUnits}
        />
      </TabPanel>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          onClick={onCancel}
          sx={{ mr: 2 }}
          variant="outlined"
          size="large"
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" size="large">
          Save
        </Button>
      </Box>
    </form>
  );
};

export default ItemForm;
