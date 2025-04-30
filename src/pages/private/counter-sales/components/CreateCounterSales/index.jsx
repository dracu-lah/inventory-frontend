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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useRef } from "react";

const itemSchema = z.object({
  itemId: z.number(),
  itemCode: z.string(),
  itemName: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number(),
});

const formSchema = z.object({
  customerName: z.string().min(1),
  orderDate: z.string(),
  referenceNumber: z.string().optional(),
  remarks: z.string().optional(),
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
  amountReceived: z.number(),
  paymentMethod: z.enum(["CASH", "CARD", "UPI"]),
  items: z.array(itemSchema).min(1),
});

const defaultValues = {
  customerName: "string",
  orderDate: new Date().toISOString().split("T")[0],
  referenceNumber: "string",
  remarks: "string",
  billingAddress: "string",
  shippingAddress: "string",
  amountReceived: 0,
  paymentMethod: "CASH",
  items: [
    {
      itemId: 9007199254740991,
      itemCode: "string",
      itemName: "string",
      quantity: 0.00001,
      unitPrice: 0,
    },
  ],
};

export default function CreateCounterSales() {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  const inputRefs = useRef([]);

  const handleEnterAsTab = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = inputRefs.current[index + 1];
      if (next) next.focus();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Typography variant="h5" mb={2}>
        Counter Sale Entry
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Customer Name"
            fullWidth
            {...register("customerName")}
            error={!!errors.customerName}
            helperText={errors.customerName?.message}
            inputRef={(el) => (inputRefs.current[0] = el)}
            onKeyDown={(e) => handleEnterAsTab(e, 0)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Order Date"
            type="date"
            fullWidth
            {...register("orderDate")}
            InputLabelProps={{ shrink: true }}
            inputRef={(el) => (inputRefs.current[1] = el)}
            onKeyDown={(e) => handleEnterAsTab(e, 1)}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Amount Received"
            type="number"
            fullWidth
            {...register("amountReceived", { valueAsNumber: true })}
            inputRef={(el) => (inputRefs.current[2] = el)}
            onKeyDown={(e) => handleEnterAsTab(e, 2)}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Payment Method"
            select
            fullWidth
            defaultValue="CASH"
            {...register("paymentMethod")}
            inputRef={(el) => (inputRefs.current[3] = el)}
            onKeyDown={(e) => handleEnterAsTab(e, 3)}
          >
            <MenuItem value="CASH">Cash</MenuItem>
            <MenuItem value="CARD">Card</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Items</Typography>
        </Grid>

        {fields.map((item, index) => (
          <Grid container spacing={2} key={item.id} alignItems="center">
            <Grid item xs={3}>
              <Controller
                name={`items.${index}.itemCode`}
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Item Code"
                    fullWidth
                    {...field}
                    inputRef={(el) => (inputRefs.current[4 + index * 2] = el)}
                    onKeyDown={(e) => handleEnterAsTab(e, 4 + index * 2)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <Controller
                name={`items.${index}.itemName`}
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Item Name"
                    fullWidth
                    {...field}
                    inputRef={(el) => (inputRefs.current[5 + index * 2] = el)}
                    onKeyDown={(e) => handleEnterAsTab(e, 5 + index * 2)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name={`items.${index}.quantity`}
                control={control}
                render={({ field }) => (
                  <TextField label="Qty" type="number" fullWidth {...field} />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name={`items.${index}.unitPrice`}
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Unit Price"
                    type="number"
                    fullWidth
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Button color="error" onClick={() => remove(index)}>
                Remove
              </Button>
            </Grid>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={() =>
              append({
                itemId: 0,
                itemCode: "",
                itemName: "",
                quantity: 1,
                unitPrice: 0,
              })
            }
          >
            Add Item
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
