// src/components/ItemMaster/AddItemModal.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import ItemForm from "./ItemForm";

const AddItemModal = ({ open, onClose, onSubmit }) => {
  const handleSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Add New Item
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ItemForm onSubmit={handleSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
