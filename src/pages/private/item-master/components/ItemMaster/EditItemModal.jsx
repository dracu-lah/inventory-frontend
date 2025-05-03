// src/components/ItemMaster/EditItemModal.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import ItemForm from "./ItemForm";

const EditItemModal = ({ open, onClose, onSubmit, item }) => {
  const handleSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit Item
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
        <ItemForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          defaultValues={item}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditItemModal;
