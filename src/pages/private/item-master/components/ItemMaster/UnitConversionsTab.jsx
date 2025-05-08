// src/components/ItemMaster/UnitConversionsTab.jsx
import React, { useState } from "react";
import {
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const UnitConversionsTab = ({
  unitConversions = [],
  onUnitConversionsChange,
  units = [],
}) => {
  // Sample dummy units if none are provided
  const displayUnits =
    units.length > 0
      ? units
      : [
          { id: "unit1", name: "Piece (Pcs)" },
          { id: "unit2", name: "Kilogram (Kg)" },
          { id: "unit3", name: "Liter (L)" },
          { id: "unit4", name: "Box" },
          { id: "unit5", name: "Meter (m)" },
          { id: "unit6", name: "Carton" },
        ];

  const [fromUnitId, setFromUnitId] = useState("");
  const [toUnitId, setToUnitId] = useState("");
  const [conversionFactor, setConversionFactor] = useState(1);
  const [error, setError] = useState("");

  const handleAddConversion = () => {
    // Validate inputs
    if (!fromUnitId) {
      setError("Please select a 'From Unit'");
      return;
    }
    if (!toUnitId) {
      setError("Please select a 'To Unit'");
      return;
    }
    if (fromUnitId === toUnitId) {
      setError("From Unit and To Unit cannot be the same");
      return;
    }
    if (conversionFactor <= 0) {
      setError("Conversion factor must be greater than 0");
      return;
    }

    // Check if this conversion already exists
    const existingConversion = unitConversions.find(
      (uc) => uc.fromUnitId === fromUnitId && uc.toUnitId === toUnitId,
    );

    if (existingConversion) {
      setError("This unit conversion already exists");
      return;
    }

    // Add the new conversion
    const newConversions = [
      ...unitConversions,
      {
        id: `conv_${Date.now()}`, // Generate a temporary ID
        fromUnitId,
        toUnitId,
        conversionFactor: parseFloat(conversionFactor),
      },
    ];

    onUnitConversionsChange(newConversions);

    // Reset form
    setFromUnitId("");
    setToUnitId("");
    setConversionFactor(1);
    setError("");
  };

  const handleDeleteConversion = (id) => {
    const updatedConversions = unitConversions.filter((uc) => uc.id !== id);
    onUnitConversionsChange(updatedConversions);
  };

  // Function to get unit name by ID
  const getUnitName = (unitId) => {
    const unit = displayUnits.find((u) => u.id === unitId);
    return unit ? unit.name : unitId;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Add Unit Conversion
        </Typography>
        <Box sx={{ mb: 3, mt: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>From Unit</InputLabel>
                <Select
                  value={fromUnitId}
                  onChange={(e) => setFromUnitId(e.target.value)}
                  label="From Unit"
                >
                  {displayUnits.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>To Unit</InputLabel>
                <Select
                  value={toUnitId}
                  onChange={(e) => setToUnitId(e.target.value)}
                  label="To Unit"
                >
                  {displayUnits.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Conversion Factor"
                type="number"
                variant="outlined"
                value={conversionFactor}
                onChange={(e) => setConversionFactor(e.target.value)}
                inputProps={{ min: "0.0000001", step: "0.0000001" }}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddConversion}
                startIcon={<AddIcon />}
                fullWidth
                sx={{ height: "56px" }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Unit Conversions
        </Typography>

        {unitConversions.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                {unitConversions.map((conversion) => (
                  <TableRow key={conversion.id}>
                    <TableCell>{getUnitName(conversion.fromUnitId)}</TableCell>
                    <TableCell>{getUnitName(conversion.toUnitId)}</TableCell>
                    <TableCell align="right">
                      {conversion.conversionFactor}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteConversion(conversion.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            No unit conversions added yet. Add your first conversion above.
          </Typography>
        )}

        {/* Sample data example */}
        {unitConversions.length === 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Example:
            </Typography>
            <TableContainer component={Paper} sx={{ opacity: 0.7 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>From Unit</TableCell>
                    <TableCell>To Unit</TableCell>
                    <TableCell align="right">Conversion Factor</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Kilogram (Kg)</TableCell>
                    <TableCell>Gram (g)</TableCell>
                    <TableCell align="right">1000</TableCell>
                    <TableCell align="center">
                      <IconButton color="error" size="small" disabled>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Box</TableCell>
                    <TableCell>Piece (Pcs)</TableCell>
                    <TableCell align="right">24</TableCell>
                    <TableCell align="center">
                      <IconButton color="error" size="small" disabled>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default UnitConversionsTab;
