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
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

const itemSchema = z.object({
  itemId: z.number(),
  itemCode: z.string().min(1),
  itemName: z.string().min(1),
  batchNumber: z.string().optional(),
  warehouseName: z.string().optional(),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  discountType: z.enum(["PERCENTAGE", "AMOUNT"]),
  discountPercentage: z.number().min(0).max(100).optional(),
  discountAmount: z.number().optional(),
  isTaxable: z.boolean(),
  cgstRate: z.number().min(0).max(100),
  sgstRate: z.number().min(0).max(100),
  igstRate: z.number().min(0).max(100),
  cessRate: z.number().min(0).max(100),
});

const formSchema = z.object({
  customerName: z.string().min(1),
  orderDate: z.string(),
  paymentMethod: z.enum(["CASH", "CARD", "UPI"]),
  referenceNumber: z.string().optional(),
  billingAddress: z.string().min(1),
  shippingAddress: z.string().min(1),
  items: z.array(itemSchema).min(1),
  additionalCharges: z.number().optional(),
  roundOffAmount: z.number().optional(),
});

const defaultValues = {
  customerName: "",
  orderDate: new Date().toISOString().split("T")[0],
  paymentMethod: "CASH",
  billingAddress: "",
  shippingAddress: "",
  items: [
    {
      itemId: 0,
      itemCode: "",
      itemName: "",
      quantity: 1,
      unitPrice: 0,
      discountType: "PERCENTAGE",
      discountPercentage: 0,
      isTaxable: true,
      cgstRate: 0,
      sgstRate: 0,
      igstRate: 0,
      cessRate: 0,
    },
  ],
};

export default function CreateCounterSales() {
  const { control, handleSubmit, register, watch } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");
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

  useEffect(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTaxableAmount = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let totalCess = 0;

    items.forEach((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      subtotal += lineTotal;

      const discount =
        item.discountType === "PERCENTAGE"
          ? (lineTotal * (item.discountPercentage || 0)) / 100
          : item.discountAmount || 0;
      totalDiscount += discount;

      const taxableAmount = lineTotal - discount;
      totalTaxableAmount += taxableAmount;

      totalCgst += taxableAmount * (item.cgstRate / 100);
      totalSgst += taxableAmount * (item.sgstRate / 100);
      totalIgst += taxableAmount * (item.igstRate / 100);
      totalCess += taxableAmount * (item.cessRate / 100);
    });

    const totalTax = totalCgst + totalSgst + totalIgst + totalCess;
    const grandTotal =
      totalTaxableAmount +
      totalTax +
      (watch("additionalCharges") || 0) +
      (watch("roundOffAmount") || 0);

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
  }, [items, watch("additionalCharges"), watch("roundOffAmount")]);

  return (
    <Box component="form" onSubmit={handleSubmit(console.log)} p={4}>
      <Typography variant="h5" mb={4}>
        Counter Sale Entry
      </Typography>

      {/* Order Details Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            {...register("customerName")}
            label="Customer Name"
            fullWidth
            required
          />
          <TextField
            {...register("orderDate")}
            label="Order Date"
            type="date"
            fullWidth
            required
            sx={{ mt: 2 }}
          />
          <TextField
            {...register("billingAddress")}
            label="Billing Address"
            fullWidth
            required
            sx={{ mt: 2 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            {...register("paymentMethod")}
            select
            label="Payment Method"
            fullWidth
            required
          >
            <MenuItem value="CASH">Cash</MenuItem>
            <MenuItem value="CARD">Card</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
          </TextField>
          <TextField
            {...register("referenceNumber")}
            label="Reference Number"
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            {...register("shippingAddress")}
            label="Shipping Address"
            fullWidth
            required
            sx={{ mt: 2 }}
          />
        </Grid>
      </Grid>

      {/* Items Section */}
      <Typography variant="h6" gutterBottom>
        Items
      </Typography>
      {fields.map((item, index) => (
        <Grid container spacing={2} key={item.id} sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <TextField
              {...register(`items.${index}.itemCode`)}
              label="Item Code"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              {...register(`items.${index}.itemName`)}
              label="Item Name"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6} md={1}>
            <TextField
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
              label="Qty"
              type="number"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6} md={1}>
            <TextField
              {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
              label="Price"
              type="number"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              {...register(`items.${index}.discountType`)}
              select
              label="Discount Type"
              fullWidth
            >
              <MenuItem value="PERCENTAGE">Percentage</MenuItem>
              <MenuItem value="AMOUNT">Amount</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={1}>
            <TextField
              {...register(`items.${index}.discountPercentage`, {
                valueAsNumber: true,
              })}
              label="Discount %"
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button onClick={() => remove(index)} color="error">
              Remove
            </Button>
          </Grid>
        </Grid>
      ))}
      <Button
        onClick={() => append(defaultValues.items[0])}
        variant="outlined"
        sx={{ mb: 4 }}
      >
        Add Item
      </Button>

      {/* Calculations Section */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>
                <strong>Order Summary</strong>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Subtotal</TableCell>
              <TableCell align="right">
                {calculations.subtotal.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Discount</TableCell>
              <TableCell align="right">
                ({calculations.totalDiscount.toFixed(2)})
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Taxable Amount</TableCell>
              <TableCell align="right">
                {calculations.totalTaxableAmount.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CGST ({calculations.totalCgst.toFixed(2)})</TableCell>
              <TableCell align="right">
                {calculations.totalCgst.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>SGST ({calculations.totalSgst.toFixed(2)})</TableCell>
              <TableCell align="right">
                {calculations.totalSgst.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IGST ({calculations.totalIgst.toFixed(2)})</TableCell>
              <TableCell align="right">
                {calculations.totalIgst.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Tax</TableCell>
              <TableCell align="right">
                {calculations.totalTax.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Grand Total</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{calculations.grandTotal.toFixed(2)}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Button type="submit" variant="contained" size="large">
        Submit Order
      </Button>
    </Box>
  );
}
