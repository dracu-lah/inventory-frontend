// src/components/ItemMaster/AddItemModal.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import ItemForm from "./ItemForm";
import { useQuery } from "@tanstack/react-query";
import { GetCategoriesAPI, GetUnitsAPI } from "@/services/api";

const AddItemModal = ({ open, onClose, onSubmit }) => {
  const handleSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["GetCategoriesAPI"],
    queryFn: () => GetCategoriesAPI(),
  });

  // Fetch units using react-query
  const { data: unitsData, isLoading: isLoadingUnits } = useQuery({
    queryKey: ["GetUnitsAPI"],
    queryFn: () => GetUnitsAPI(),
  });
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
        <ItemForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          categories={categoriesData?.data?.content || []}
          units={unitsData?.data?.content || []}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
