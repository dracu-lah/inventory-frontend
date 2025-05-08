import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { Edit, Delete, Check, Close } from "@mui/icons-material";
import { useDebouncedCallback } from "use-debounce";

// Dummy items data
const dummyItems = [
  {
    id: 1,
    code: "ITEM001",
    name: "Laptop",
    cgst: 9,
    sgst: 9,
    igst: 0,
    cess: 0,
    price: 50000,
  },
  {
    id: 2,
    code: "ITEM002",
    name: "Mouse",
    cgst: 9,
    sgst: 9,
    igst: 0,
    cess: 0,
    price: 500,
  },
  {
    id: 3,
    code: "ITEM003",
    name: "Keyboard",
    cgst: 9,
    sgst: 9,
    igst: 0,
    cess: 0,
    price: 1500,
  },
];

// Schemas
const itemSchema = z.object({
  itemId: z.number().min(1, "Select an item"),
  itemCode: z.string().min(1),
  itemName: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  discountType: z.enum(["PERCENTAGE", "AMOUNT"]),
  discountValue: z.number().min(0),
  cgstRate: z.number().min(0).max(100),
  sgstRate: z.number().min(0).max(100),
  igstRate: z.number().min(0).max(100),
  cessRate: z.number().min(0).max(100),
});

const formSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  orderDate: z.string(),
  paymentMethod: z.enum(["CASH", "CARD", "UPI"]),
  items: z.array(itemSchema).min(1, "Add at least one item"),
  roundOffAmount: z.number().optional(),
});

const defaultItemValues = {
  itemId: 0,
  itemCode: "",
  itemName: "",
  quantity: 1,
  unitPrice: 0,
  discountType: "PERCENTAGE",
  discountValue: 0,
  cgstRate: 0,
  sgstRate: 0,
  igstRate: 0,
  cessRate: 0,
};

const defaultValues = {
  customerName: "",
  orderDate: new Date().toISOString().split("T")[0],
  paymentMethod: "CASH",
  items: [],
  roundOffAmount: 0,
};

export default function CreateCounterSales() {
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "items",
  });
  const items = watch("items");
  const roundOffAmount = watch("roundOffAmount") || 0;
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    totalDiscount: 0,
    totalTaxableAmount: 0,
    totalCgst: 0,
    totalSgst: 0,
    totalIgst: 0,
    totalCess: 0,
    totalTax: 0,
    grandTotal: 0,
  });
  const [newItem, setNewItem] = useState(defaultItemValues);
  const inputRefs = useRef([]);

  // Calculate totals for each item with proper tax calculation
  const calculateItemTotals = (item) => {
    const lineTotal = item.quantity * item.unitPrice;
    const discount =
      item.discountType === "PERCENTAGE"
        ? (lineTotal * item.discountValue) / 100
        : item.discountValue;

    // Apply the formula: (discounted amount * 100) / (100 + CGST% + SGST%)
    const discountedAmount = Math.max(lineTotal - discount, 0);
    const taxableAmount =
      (discountedAmount * 100) / (100 + item.cgstRate + item.sgstRate);

    // Calculate taxes based on the taxable amount
    const cgst = (taxableAmount * item.cgstRate) / 100;
    const sgst = (taxableAmount * item.sgstRate) / 100;
    const igst = (taxableAmount * item.igstRate) / 100;
    const cess = (taxableAmount * item.cessRate) / 100;

    return {
      lineTotal,
      discount,
      taxableAmount,
      cgst,
      sgst,
      igst,
      cess,
    };
  };

  // Debounced update for totals
  const debouncedUpdate = useDebouncedCallback(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTaxableAmount = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let totalCess = 0;

    items.forEach((item) => {
      const { lineTotal, discount, taxableAmount, cgst, sgst, igst, cess } =
        calculateItemTotals(item);
      subtotal += lineTotal;
      totalDiscount += discount;
      totalTaxableAmount += taxableAmount;
      totalCgst += cgst;
      totalSgst += sgst;
      totalIgst += igst;
      totalCess += cess;
    });

    const totalTax = totalCgst + totalSgst + totalIgst + totalCess;
    const grandTotal = totalTaxableAmount + totalTax + roundOffAmount;

    setCalculations({
      subtotal,
      totalDiscount,
      totalTaxableAmount,
      totalCgst,
      totalSgst,
      totalIgst,
      totalCess,
      totalTax,
      grandTotal,
    });
  }, 300);

  useEffect(() => {
    debouncedUpdate();
  }, [items, roundOffAmount, debouncedUpdate]);

  // Handle item selection for add
  const handleItemChange = (event, selected) => {
    if (selected) {
      const itemData = selected.data;
      setNewItem({
        ...newItem,
        itemId: itemData.id,
        itemCode: itemData.code,
        itemName: itemData.name,
        unitPrice: itemData.price,
        cgstRate: itemData.cgst,
        sgstRate: itemData.sgst,
        igstRate: itemData.igst,
        cessRate: itemData.cess,
      });
    } else {
      setNewItem({
        ...defaultItemValues,
        quantity: newItem.quantity,
        discountType: newItem.discountType,
        discountValue: newItem.discountValue,
      });
    }
  };

  // Add new item
  const handleAddItem = () => {
    if (newItem.itemId === 0) return;
    append(newItem);
    setNewItem(defaultItemValues);
    inputRefs.current[3]?.focus();
  };

  // Debounced field update for direct editing
  const debouncedFieldUpdate = useDebouncedCallback((index, field, value) => {
    const updatedItem = { ...items[index], [field]: value };
    update(index, updatedItem);
  }, 300);

  // Handle Enter key navigation
  const handleKeyDown = (e, index, rowIndex = null) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < inputRefs.current.length) {
        inputRefs.current[nextIndex]?.focus();
      }
      if (index === 7 && newItem.itemId !== 0) {
        handleAddItem();
      }
    }
  };

  return (
    <Box
      sx={{
        padding: { xs: "8px", sm: "16px" },
        maxWidth: "1200px",
        margin: "auto",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        fontFamily: "monospace",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          marginBottom: "16px",
          color: "#333",
          borderBottom: "2px solid #ccc",
          paddingBottom: "4px",
        }}
      >
        Counter Sale Voucher
      </Typography>

      {/* Customer Details */}
      <Grid
        container
        spacing={1}
        sx={{
          marginBottom: "16px",
          backgroundColor: "#fff",
          padding: "12px",
          border: "1px solid #ccc",
        }}
      >
        <Grid item xs={12} sm={4}>
          <TextField
            {...register("customerName")}
            label="Customer Name"
            fullWidth
            required
            error={!!errors.customerName}
            helperText={errors.customerName?.message}
            inputRef={(el) => (inputRefs.current[0] = el)}
            onKeyDown={(e) => handleKeyDown(e, 0)}
            size="small"
            variant="outlined"
            sx={{ backgroundColor: "#fff" }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            {...register("orderDate")}
            label="Date"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            inputRef={(el) => (inputRefs.current[1] = el)}
            onKeyDown={(e) => handleKeyDown(e, 1)}
            size="small"
            variant="outlined"
            sx={{ backgroundColor: "#fff" }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            {...register("paymentMethod")}
            select
            label="Payment Mode"
            fullWidth
            required
            inputRef={(el) => (inputRefs.current[2] = el)}
            onKeyDown={(e) => handleKeyDown(e, 2)}
            size="small"
            variant="outlined"
            sx={{ backgroundColor: "#fff" }}
          >
            <MenuItem value="CASH">Cash</MenuItem>
            <MenuItem value="CARD">Card</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Items Table */}
      <TableContainer
        component={Paper}
        sx={{ marginBottom: "16px", border: "1px solid #ccc" }}
      >
        <Table size="small" sx={{ backgroundColor: "#fff" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
              <TableCell
                sx={{
                  minWidth: { xs: "120px", sm: "200px" },
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Item
              </TableCell>
              <TableCell
                align="right"
                sx={{ minWidth: "80px", fontWeight: "bold", color: "#333" }}
              >
                Price (₹)
              </TableCell>
              <TableCell
                align="right"
                sx={{ minWidth: "60px", fontWeight: "bold", color: "#333" }}
              >
                Qty
              </TableCell>
              <TableCell
                align="center"
                sx={{ minWidth: "100px", fontWeight: "bold", color: "#333" }}
              >
                Discount
              </TableCell>
              <TableCell
                align="right"
                sx={{ minWidth: "80px", fontWeight: "bold", color: "#333" }}
              >
                Taxable (₹)
              </TableCell>
              <TableCell
                align="right"
                sx={{ minWidth: "60px", fontWeight: "bold", color: "#333" }}
              >
                CGST (₹)
              </TableCell>
              <TableCell
                align="right"
                sx={{ minWidth: "60px", fontWeight: "bold", color: "#333" }}
              >
                SGST (₹)
              </TableCell>
              <TableCell
                align="right"
                sx={{ minWidth: "80px", fontWeight: "bold", color: "#333" }}
              >
                Total (₹)
              </TableCell>
              <TableCell
                align="center"
                sx={{ minWidth: "80px", fontWeight: "bold", color: "#333" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Add Item Row */}
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell>
                <Autocomplete
                  options={dummyItems.map((item) => ({
                    value: item.id,
                    label: `${item.code} - ${item.name}`,
                    data: item,
                  }))}
                  getOptionLabel={(option) => option.label}
                  onChange={handleItemChange}
                  value={
                    newItem.itemId
                      ? {
                          value: newItem.itemId,
                          label: `${newItem.itemCode} - ${newItem.itemName}`,
                        }
                      : null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select item..."
                      size="small"
                      variant="outlined"
                      sx={{ backgroundColor: "#fff" }}
                      inputRef={(el) => (inputRefs.current[3] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 3)}
                    />
                  )}
                  sx={{
                    ".MuiOutlinedInput-root": {
                      padding: "4px",
                    },
                    ".MuiAutocomplete-input": {
                      padding: "0px",
                    },
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={newItem.unitPrice}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      unitPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  inputProps={{
                    min: 0,
                    step: "any",
                    style: { textAlign: "right" },
                  }}
                  variant="outlined"
                  sx={{ backgroundColor: "#fff", width: "80px" }}
                  inputRef={(el) => (inputRefs.current[4] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 4)}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      quantity: parseInt(e.target.value) || 1,
                    })
                  }
                  inputProps={{
                    min: 1,
                    step: 1,
                    style: { textAlign: "right" },
                  }}
                  variant="outlined"
                  sx={{ backgroundColor: "#fff", width: "60px" }}
                  inputRef={(el) => (inputRefs.current[5] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 5)}
                />
              </TableCell>
              <TableCell align="center">
                <Grid container spacing={1}>
                  <Grid item xs={5}>
                    <TextField
                      select
                      size="small"
                      value={newItem.discountType}
                      onChange={(e) =>
                        setNewItem({ ...newItem, discountType: e.target.value })
                      }
                      variant="outlined"
                      sx={{ backgroundColor: "#fff", width: "100%" }}
                      inputRef={(el) => (inputRefs.current[6] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 6)}
                    >
                      <MenuItem value="PERCENTAGE">%</MenuItem>
                      <MenuItem value="AMOUNT">₹</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={7}>
                    <TextField
                      size="small"
                      type="number"
                      value={newItem.discountValue}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          discountValue: parseFloat(e.target.value) || 0,
                        })
                      }
                      inputProps={{
                        min: 0,
                        step: "any",
                        style: { textAlign: "right" },
                      }}
                      variant="outlined"
                      sx={{ backgroundColor: "#fff", width: "100%" }}
                      inputRef={(el) => (inputRefs.current[7] = el)}
                      onKeyDown={(e) => handleKeyDown(e, 7)}
                    />
                  </Grid>
                </Grid>
              </TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="center">
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleAddItem}
                  disabled={newItem.itemId === 0}
                  sx={{
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#115293" },
                  }}
                >
                  Add
                </Button>
              </TableCell>
            </TableRow>

            {/* Existing Items */}
            {fields.map((item, index) => {
              const totals = calculateItemTotals(items[index]);
              const baseRefIndex = 8 + index * 4; // Each row has 4 editable fields: quantity, unitPrice, discountType, discountValue
              return (
                <TableRow
                  key={item.id}
                  sx={{ backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa" }}
                >
                  <TableCell
                    sx={{ color: "#333" }}
                  >{`${items[index].itemCode} - ${items[index].itemName}`}</TableCell>
                  <TableCell align="right">
                    <TextField
                      size="small"
                      type="number"
                      value={items[index].unitPrice}
                      onChange={(e) =>
                        debouncedFieldUpdate(
                          index,
                          "unitPrice",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      inputProps={{
                        min: 0,
                        step: "any",
                        style: { textAlign: "right" },
                      }}
                      variant="outlined"
                      sx={{ backgroundColor: "#fff", width: "80px" }}
                      inputRef={(el) => (inputRefs.current[baseRefIndex] = el)}
                      onKeyDown={(e) => handleKeyDown(e, baseRefIndex, index)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      size="small"
                      type="number"
                      value={items[index].quantity}
                      onChange={(e) =>
                        debouncedFieldUpdate(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 1,
                        )
                      }
                      inputProps={{
                        min: 1,
                        step: 1,
                        style: { textAlign: "right" },
                      }}
                      variant="outlined"
                      sx={{ backgroundColor: "#fff", width: "60px" }}
                      inputRef={(el) =>
                        (inputRefs.current[baseRefIndex + 1] = el)
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, baseRefIndex + 1, index)
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Grid container spacing={1}>
                      <Grid item xs={5}>
                        <TextField
                          select
                          size="small"
                          value={items[index].discountType}
                          onChange={(e) =>
                            debouncedFieldUpdate(
                              index,
                              "discountType",
                              e.target.value,
                            )
                          }
                          variant="outlined"
                          sx={{ backgroundColor: "#fff", width: "100%" }}
                          inputRef={(el) =>
                            (inputRefs.current[baseRefIndex + 2] = el)
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(e, baseRefIndex + 2, index)
                          }
                        >
                          <MenuItem value="PERCENTAGE">%</MenuItem>
                          <MenuItem value="AMOUNT">₹</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          size="small"
                          type="number"
                          value={items[index].discountValue}
                          onChange={(e) =>
                            debouncedFieldUpdate(
                              index,
                              "discountValue",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          inputProps={{
                            min: 0,
                            step: "any",
                            style: { textAlign: "right" },
                          }}
                          variant="outlined"
                          sx={{ backgroundColor: "#fff", width: "100%" }}
                          inputRef={(el) =>
                            (inputRefs.current[baseRefIndex + 3] = el)
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(e, baseRefIndex + 3, index)
                          }
                        />
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#333" }}>
                    {totals.taxableAmount.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#333" }}>
                    {totals.cgst.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#333" }}>
                    {totals.sgst.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#333" }}>
                    {(totals.taxableAmount + totals.cgst + totals.sgst).toFixed(
                      2,
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => remove(index)}>
                      <Delete sx={{ color: "#d32f2f", fontSize: "18px" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Totals Section */}
      <Grid
        container
        spacing={1}
        sx={{
          maxWidth: "400px",
          marginLeft: "auto",
          backgroundColor: "#fff",
          padding: "12px",
          border: "1px solid #ccc",
        }}
      >
        <Grid item xs={6}>
          <Typography sx={{ color: "#333" }}>Subtotal:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography sx={{ color: "#333" }}>
            ₹{calculations.subtotal.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ color: "#333" }}>Discounts:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography sx={{ color: "#d32f2f" }}>
            -₹{calculations.totalDiscount.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ color: "#333" }}>Taxable Amount:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography sx={{ color: "#333" }}>
            ₹{calculations.totalTaxableAmount.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ color: "#333" }}>CGST:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography sx={{ color: "#333" }}>
            ₹{calculations.totalCgst.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ color: "#333" }}>SGST:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography sx={{ color: "#333" }}>
            ₹{calculations.totalSgst.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ color: "#333" }}>IGST:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography sx={{ color: "#333" }}>
            ₹{calculations.totalIgst.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ color: "#333" }}>Cess:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography sx={{ color: "#333" }}>
            ₹{calculations.totalCess.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ color: "#333" }}>Total Tax:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography sx={{ color: "#333" }}>
            ₹{calculations.totalTax.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ color: "#333" }}>Round Off:</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <TextField
            size="small"
            type="number"
            value={roundOffAmount}
            onChange={(e) =>
              setValue("roundOffAmount", parseFloat(e.target.value) || 0, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            inputProps={{ style: { textAlign: "right" } }}
            variant="outlined"
            sx={{ backgroundColor: "#fff", width: "100px" }}
            inputRef={(el) => (inputRefs.current[8 + fields.length * 4] = el)}
            onKeyDown={(e) => handleKeyDown(e, 8 + fields.length * 4)}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="subtitle1"
            sx={{ color: "#333", fontWeight: "bold" }}
          >
            Grand Total:
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography
            variant="subtitle1"
            sx={{ color: "#1976d2", fontWeight: "bold" }}
          >
            ₹{calculations.grandTotal.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: "16px", textAlign: "right" }}>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit(console.log)}
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#115293" },
          }}
        >
          Save Voucher
        </Button>
      </Box>
    </Box>
  );
}
