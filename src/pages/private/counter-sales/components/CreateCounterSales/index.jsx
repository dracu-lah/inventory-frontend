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
import { useEffect, useMemo, useState } from "react";
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
  itemId: z.number(),
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
  customerName: z.string().min(1),
  orderDate: z.string(),
  paymentMethod: z.enum(["CASH", "CARD", "UPI"]),
  items: z.array(itemSchema).min(1),
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
  const { control, handleSubmit, register, watch, setValue } = useForm({
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

  const calculateItemTotals = (item) => {
    const lineTotal = item.quantity * item.unitPrice;
    const discount =
      item.discountType === "PERCENTAGE"
        ? (lineTotal * item.discountValue) / 100
        : item.discountValue;
    const taxableAmount = lineTotal - discount;

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
    const grandTotal =
      totalTaxableAmount + totalTax + (watch("roundOffAmount") || 0);

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

  useEffect(() => debouncedUpdate(), [items, watch("roundOffAmount")]);

  const loadItems = (inputValue) => {
    return new Promise((resolve) => {
      resolve(
        dummyItems
          .filter(
            (item) =>
              item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
              item.code.toLowerCase().includes(inputValue.toLowerCase()),
          )
          .map((item) => ({
            value: item.id,
            label: `${item.code} - ${item.name}`,
            data: item,
          })),
      );
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
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            {...register("orderDate")}
            label="Date"
            type="date"
            fullWidth
            required
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
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Discount</TableCell>
              <TableCell align="right">Taxable</TableCell>
              <TableCell align="right">CGST</TableCell>
              <TableCell align="right">SGST</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell width={50}></TableCell>
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
                      render={({ field }) => (
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          loadOptions={loadItems}
                          onChange={(selected) => {
                            if (selected) {
                              setValue(`items.${index}`, {
                                ...items[index],
                                itemId: selected.data.id,
                                itemCode: selected.data.code,
                                itemName: selected.data.name,
                                unitPrice: selected.data.price,
                                cgstRate: selected.data.cgst,
                                sgstRate: selected.data.sgst,
                              });
                            }
                          }}
                          value={{
                            value: items[index].itemId,
                            label: `${items[index].itemCode} - ${items[index].itemName}`,
                          }}
                          styles={{
                            container: (base) => ({ ...base, width: 250 }),
                          }}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      {...register(`items.${index}.unitPrice`, {
                        valueAsNumber: true,
                      })}
                      size="small"
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      size="small"
                      type="number"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <TextField
                          {...register(`items.${index}.discountType`)}
                          select
                          size="small"
                          defaultValue="PERCENTAGE"
                        >
                          <MenuItem value="PERCENTAGE">%</MenuItem>
                          <MenuItem value="AMOUNT">₹</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          {...register(`items.${index}.discountValue`, {
                            valueAsNumber: true,
                          })}
                          size="small"
                          type="number"
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
          <Typography>Round Off:</Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          <TextField
            {...register("roundOffAmount", { valueAsNumber: true })}
            size="small"
            type="number"
            sx={{ width: 100 }}
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
