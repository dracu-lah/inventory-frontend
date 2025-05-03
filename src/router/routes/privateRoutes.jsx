import { lazy } from "react";
import routePath from "../routePath";
import { ProtectedRoute } from "../ProtectedRoute";
import { Navigate } from "react-router";

// Lazy load private route components
const DashBoardPage = lazy(() => import("@/pages/private/dashboard"));
const CounterSalesPage = lazy(() => import("@/pages/private/counter-sales"));
const ItemMasterPage = lazy(() => import("@/pages/private/item-master"));
export const privateRoutes = [
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <DashBoardPage />,
      },

      {
        path: routePath.itemMaster,
        element: <ItemMasterPage />,
      },
      {
        path: routePath.counterSales,
        element: <CounterSalesPage />,
      },
    ],
  },
];
