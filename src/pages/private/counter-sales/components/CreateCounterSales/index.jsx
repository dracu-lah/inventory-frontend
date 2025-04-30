import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import AsyncSelect from "react-select/async";
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

const defaultValues = {
  customerName: "",
  orderDate: new Date().toISOString().split("T")[0],
  paymentMethod: "CASH",
  items: [
    {
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
    },
  ],
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

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
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

  // Calculate totals for each item
  const calculateItemTotals = (item) => {
    const lineTotal = item.quantity * item.unitPrice;
    const discount =
      item.discountType === "PERCENTAGE"
        ? (lineTotal * item.discountValue) / 100
        : item.discountValue;
    const taxableAmount = Math.max(lineTotal - discount, 0);

    return {
      lineTotal,
      discount,
      taxableAmount,
      cgst: (taxableAmount * item.cgstRate) / 100,
      sgst: (taxableAmount * item.sgstRate) / 100,
      igst: (taxableAmount * item.igstRate) / 100,
      cess: (taxableAmount * item.cessRate) / 100,
    };
  };

  // Debounced update for totals calculation
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
  }, [items, roundOffAmount]);

  // Async load items for select dropdown
  const loadItems = (inputValue) => {
    return new Promise((resolve) => {
      const filtered = dummyItems
        .filter(
          (item) =>
            item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            item.code.toLowerCase().includes(inputValue.toLowerCase()),
        )
        .map((item) => ({
          value: item.id,
          label: `${item.code} - ${item.name}`,
          data: item,
        }));
      resolve(filtered);
    });
  };

  // Handle item selection change
  const handleItemChange = (selected, index) => {
    if (selected) {
      const itemData = selected.data;
      setValue(`items.${index}`, {
        ...items[index],
        itemId: itemData.id,
        itemCode: itemData.code,
        itemName: itemData.name,
        unitPrice: itemData.price,
        cgstRate: itemData.cgst,
        sgstRate: itemData.sgst,
        igstRate: itemData.igst,
        cessRate: itemData.cess,
        quantity: items[index].quantity || 1,
        discountType: items[index].discountType || "PERCENTAGE",
        discountValue: items[index].discountValue || 0,
      });
    }
  };

  // Handle manual update of item fields (quantity, price, discount, etc.)
  const handleFieldChange = (index, field, value) => {
    const updatedItem = { ...items[index], [field]: value };
    setValue(`items.${index}`, updatedItem, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(console.log)} p={4}>
      <Typography variant="h5" mb={4}>
        Counter Sale Invoice
      </Typography>

      {/* Customer Details */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <TextField
            {...register("customerName")}
            label="Customer Name"
            fullWidth
            required
            error={!!errors.customerName}
            helperText={errors.customerName?.message}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            {...register("orderDate")}
            label="Date"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            {...register("paymentMethod")}
            select
            label="Payment Mode"
            fullWidth
            required
          >
            <MenuItem value="CASH">Cash</MenuItem>
            <MenuItem value="CARD">Card</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Items Table */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 250 }}>Item</TableCell>
              <TableCell align="right" sx={{ minWidth: 100 }}>
                Price (₹)
              </TableCell>
              <TableCell align="right" sx={{ minWidth: 80 }}>
                Qty
              </TableCell>
              <TableCell align="center" sx={{ minWidth: 140 }}>
                Discount
              </TableCell>
              <TableCell align="right" sx={{ minWidth: 100 }}>
                Taxable (₹)
              </TableCell>
              <TableCell align="right" sx={{ minWidth: 80 }}>
                CGST (₹)
              </TableCell>
              <TableCell align="right" sx={{ minWidth: 80 }}>
                SGST (₹)
              </TableCell>
              <TableCell align="right" sx={{ minWidth: 100 }}>
                Total (₹)
              </TableCell>
              <TableCell align="center" sx={{ minWidth: 50 }}>
                &nbsp;
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((item, index) => {
              const totals = calculateItemTotals(items[index]);
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Controller
                      name={`items.${index}.itemCode`}
                      control={control}
                      render={() => (
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          loadOptions={loadItems}
                          onChange={(selected) =>
                            handleItemChange(selected, index)
                          }
                          value={
                            items[index].itemId
                              ? {
                                  value: items[index].itemId,
                                  label: `${items[index].itemCode} - ${items[index].itemName}`,
                                }
                              : null
                          }
                          placeholder="Select item..."
                          styles={{
                            container: (base) => ({ ...base, width: 250 }),
                            menu: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          isClearable
                        />
                      )}
                    />
                    {/* Show validation error if item not selected */}
                    {errors.items?.[index]?.itemId && (
                      <Typography color="error" variant="caption">
                        {errors.items[index].itemId.message}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell align="right">
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ min: 0, step: "any" }}
                      value={items[index].unitPrice}
                      onChange={(e) =>
                        handleFieldChange(
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
                    />
                  </TableCell>

                  <TableCell align="right">
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ min: 1, step: 1 }}
                      value={items[index].quantity}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 1,
                        )
                      }
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Grid
                      container
                      spacing={1}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid item xs={5}>
                        <TextField
                          select
                          size="small"
                          value={items[index].discountType}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "discountType",
                              e.target.value,
                            )
                          }
                          fullWidth
                        >
                          <MenuItem value="PERCENTAGE">%</MenuItem>
                          <MenuItem value="AMOUNT">₹</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          size="small"
                          type="number"
                          inputProps={{ min: 0, step: "any" }}
                          value={items[index].discountValue}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "discountValue",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </TableCell>

                  <TableCell align="right">
                    {totals.taxableAmount.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">{totals.cgst.toFixed(2)}</TableCell>
                  <TableCell align="right">{totals.sgst.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    {(totals.taxableAmount + totals.cgst + totals.sgst).toFixed(
                      2,
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => remove(index)}
                      sx={{ minWidth: 32 }}
                      aria-label="Remove item"
                    >
                      ×
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        onClick={() => append(defaultValues.items[0])}
        variant="outlined"
        sx={{ mb: 4 }}
      >
        + Add Item
      </Button>

      {/* Totals Section */}
      <Grid
        container
        spacing={2}
        justifyContent="flex-end"
        sx={{ maxWidth: 400, ml: "auto" }}
      >
        <Grid item xs={6}>
          <Typography>Subtotal:</Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Typography>₹{calculations.subtotal.toFixed(2)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>Discounts:</Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Typography color="error">
            -₹{calculations.totalDiscount.toFixed(2)}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>Taxable Amount:</Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Typography>₹{calculations.totalTaxableAmount.toFixed(2)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>CGST:</Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Typography>₹{calculations.totalCgst.toFixed(2)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>SGST:</Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Typography>₹{calculations.totalSgst.toFixed(2)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>IGST:</Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Typography>₹{calculations.totalIgst.toFixed(2)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>Cess:</Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Typography>₹{calculations.totalCess.toFixed(2)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>Round Off:</Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <TextField
            {...register("roundOffAmount", { valueAsNumber: true })}
            size="small"
            type="number"
            sx={{ width: 100 }}
            inputProps={{ step: "any" }}
          />
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6">Grand Total:</Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <Typography variant="h6">
            ₹{calculations.grandTotal.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>

      <Box mt={4} textAlign="right">
        <Button type="submit" variant="contained" size="large" color="success">
          Save Invoice
        </Button>
      </Box>
    </Box>
  );
}
