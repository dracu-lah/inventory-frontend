export default {
  // ========================= Auth APIS =========================
  login: "/api/auth/login",
  logout: "/api/auth/logout",
  refresh: "/api/auth/refresh-token",

  // ========================= DASHBOARD APIS =========================
  getDashboardData: "/api/Admin/Reports/GetDashboardDisplayData",

  // ========================= COUNTERSALES APIS =========================
  createCounterSales: "/api/Admin/Reports/GetDashboardDisplayData",
  getItemPriceDetails: ({ priceListId, itemId }) =>
    `/price-list/${priceListId}/item/${itemId}/v2`,

  // ========================= COUNTERSALES APIS =========================
  getProducts: "/api/inventory/items",
};
