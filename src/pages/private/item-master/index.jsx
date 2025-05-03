// src/pages/ItemMasterPage.jsx
import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import ItemTable from "./components/ItemMaster/ItemTable";
import AddItemModal from "./components/ItemMaster/AddItemModal";

const ItemMasterPage = () => {
  // Dummy items data (would come from API in a real application)
  const [items, setItems] = useState([
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
  ]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editItem, setEditItem] = useState(null);

  // Filter items based on search term
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handler for adding a new item
  const handleAddItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1,
    };
    setItems([...items, newItem]);
  };

  // Handler for editing an item
  const handleEditItem = (item) => {
    setEditItem(item);
    setOpenAddModal(true);
  };

  // Handler for saving edited item
  const handleSaveItem = (itemData) => {
    if (editItem) {
      setItems(
        items.map((item) =>
          item.id === editItem.id ? { ...itemData, id: item.id } : item,
        ),
      );
      setEditItem(null);
    } else {
      handleAddItem(itemData);
    }
  };

  // Handler for deleting an item
  const handleDeleteItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Item Master
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => {
              setEditItem(null);
              setOpenAddModal(true);
            }}
          >
            Add Item
          </Button>
        </Box>

        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by item name or code"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <ItemTable
          items={filteredItems}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
        />
      </Paper>

      <AddItemModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSubmit={handleSaveItem}
        defaultValues={editItem}
      />
    </Container>
  );
};

export default ItemMasterPage;
