import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import routePath from "@/router/routePath";
import { PointOfSale } from "@mui/icons-material";

export const menuConfig = [
  {
    icon: DashboardIcon,
    label: "Dashboard",
    route: routePath.dashboard,
  },

  {
    icon: PointOfSale,
    label: "Counter Sales",
    route: routePath.counterSales,
  },
  {
    icon: CategoryIcon,
    label: "Categories",
    route: routePath.categories,
  },
  {
    icon: InventoryIcon,
    label: "Products",
    route: routePath.products,
  },
  {
    icon: LocalOfferIcon,
    label: "Stock Management",
    subMenu: [
      {
        label: "Add New Stock",
        route: routePath.addStock,
        icon: InventoryIcon,
      },
      {
        label: "Manage Stock",
        route: routePath.manageStock,
        icon: InventoryIcon,
      },
    ],
  },
];
