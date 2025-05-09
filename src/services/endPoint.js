export default {
  // ========================= Auth APIS =========================
  login: "/api/auth/login",
  logout: "/api/auth/logout",
  refresh: "/api/auth/refresh-token",

  // ========================= DASHBOARD APIS =========================
  getDashboardData: "/api/Admin/Reports/GetDashboardDisplayData",

  // ========================= ITEM MASTER APIS =========================
  createItem: "/api/inventory/items",
  getItems: "/api/inventory/items",

  // ========================= CATEGORIES APIS =========================
  getCategories: "/api/inventory/categories",

  // ========================= UNITS APIS =========================
  getUnits: "/api/inventory/units",
  // ========================= COUNTERSALES APIS =========================
  createCounterSales: "/api/Admin/Reports/GetDashboardDisplayData",
  // ========================= PRICELIST APIS =========================
  getItemPriceDetail: ({ priceListId, itemId }) =>
    `/price-list/${priceListId}/item/${itemId}/v2`,
};
