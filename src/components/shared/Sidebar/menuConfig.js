import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import routePath from "@/router/routePath";

export const menuConfig = [
  {
    icon: DashboardIcon,
    label: "Dashboard",
    route: routePath.dashboard,
  },
  {
    icon: CategoryIcon,
    label: "Categories",
    route: routePath.categories, // Define route for Categories
  },
  {
    icon: InventoryIcon,
    label: "Products",
    route: routePath.products, // Define route for Products
  },
  {
    icon: LocalOfferIcon,
    label: "Stock Management",
    subMenu: [
      {
        label: "Add New Stock",
        route: routePath.addStock, // Define route for Add Stock
        icon: InventoryIcon,
      },
      {
        label: "Manage Stock",
        route: routePath.manageStock, // Define route for Manage Stock
        icon: InventoryIcon,
      },
    ],
  },
];
