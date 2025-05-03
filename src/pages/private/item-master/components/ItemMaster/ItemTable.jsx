// src/components/ItemMaster/ItemTable.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const ItemTable = ({ items, onEditItem, onDeleteItem }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">CGST (%)</TableCell>
            <TableCell align="right">SGST (%)</TableCell>
            <TableCell align="right">IGST (%)</TableCell>
            <TableCell align="right">CESS (%)</TableCell>
            <TableCell align="right">Price (₹)</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">{item.cgst}</TableCell>
              <TableCell align="right">{item.sgst}</TableCell>
              <TableCell align="right">{item.igst}</TableCell>
              <TableCell align="right">{item.cess}</TableCell>
              <TableCell align="right">
                {item.price.toLocaleString("en-IN")}
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Edit">
                  <IconButton onClick={() => onEditItem(item)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => onDeleteItem(item.id)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemTable;
