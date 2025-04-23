import { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  IconButton,
  Button,
  Divider,
  Tab,
  Tabs,
  LinearProgress,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import {
  Inventory,
  Add,
  Refresh,
  Warning,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Notifications,
  LocalShipping,
  PriceCheck,
  Archive,
} from "@mui/icons-material";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

// Mock data
const inventoryStats = [
  {
    id: 1,
    title: "Total Items",
    value: 2476,
    icon: Inventory,
    color: "#1976d2",
  },
  { id: 2, title: "Low Stock", value: 23, icon: Warning, color: "#ed6c02" },
  {
    id: 3,
    title: "Incoming",
    value: 156,
    icon: LocalShipping,
    color: "#2e7d32",
  },
  {
    id: 4,
    title: "Value",
    value: "$143,250",
    icon: PriceCheck,
    color: "#9c27b0",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "Received",
    item: "Dell XPS 13 Laptop",
    quantity: 25,
    date: "2 hours ago",
    user: "John Smith",
  },
  {
    id: 2,
    type: "Shipped",
    item: "HP Printer Ink",
    quantity: 50,
    date: "5 hours ago",
    user: "Sara Johnson",
  },
  {
    id: 3,
    type: "Adjustment",
    item: "Logitech Mouse",
    quantity: -3,
    date: "Yesterday",
    user: "Mike Chen",
  },
  {
    id: 4,
    type: "Transferred",
    item: "USB Cables",
    quantity: 100,
    date: "Yesterday",
    user: "Lisa Wong",
  },
  {
    id: 5,
    type: "Received",
    item: "Monitor Stands",
    quantity: 30,
    date: "2 days ago",
    user: "John Smith",
  },
];

const lowStockItems = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "Electronics",
    inStock: 5,
    minRequired: 10,
    status: "Critical",
  },
  {
    id: 2,
    name: "HP Toner Cartridge",
    category: "Office Supplies",
    inStock: 8,
    minRequired: 15,
    status: "Low",
  },
  {
    id: 3,
    name: "Wireless Keyboard",
    category: "Accessories",
    inStock: 3,
    minRequired: 10,
    status: "Critical",
  },
  {
    id: 4,
    name: "HDMI Cables",
    category: "Accessories",
    inStock: 12,
    minRequired: 20,
    status: "Low",
  },
];

const pieChartData = [
  { id: 0, value: 35, label: "Electronics", color: "#1976d2" },
  { id: 1, value: 25, label: "Furniture", color: "#9c27b0" },
  { id: 2, value: 20, label: "Office Supplies", color: "#ed6c02" },
  { id: 3, value: 15, label: "Accessories", color: "#2e7d32" },
  { id: 4, value: 5, label: "Other", color: "#d32f2f" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Critical":
      return "error";
    case "Low":
      return "warning";
    default:
      return "default";
  }
};

const DashboardPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Inventory Dashboard
        </Typography>
        <Box>
          <Button variant="contained" startIcon={<Add />} sx={{ mr: 2 }}>
            Add Inventory
          </Button>
          <IconButton>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {inventoryStats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.id}>
            <Paper sx={{ height: "100%", overflow: "hidden" }}>
              <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                  <stat.icon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stat.value}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: "100%" }}>
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight="medium">
                Recent Activity
              </Typography>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>
            <Divider />
            <Box sx={{ p: 0 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <Tab label="All Activities" />
                <Tab label="Received" />
                <Tab label="Shipped" />
              </Tabs>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>User</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivities.map((activity) => (
                      <TableRow hover key={activity.id}>
                        <TableCell>
                          <Chip
                            label={activity.type}
                            size="small"
                            color={
                              activity.type === "Shipped"
                                ? "primary"
                                : activity.type === "Received"
                                  ? "success"
                                  : "default"
                            }
                          />
                        </TableCell>
                        <TableCell>{activity.item}</TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            {activity.quantity > 0 ? (
                              <ArrowUpward fontSize="small" color="success" />
                            ) : (
                              <ArrowDownward fontSize="small" color="error" />
                            )}
                            {Math.abs(activity.quantity)}
                          </Box>
                        </TableCell>
                        <TableCell>{activity.date}</TableCell>
                        <TableCell>{activity.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {recentActivities.length > 5 && (
                <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                  <Button color="primary">View All Activities</Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right Column with Inventory Distribution & Low Stock */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3} direction="column">
            {/* Inventory Distribution Chart */}
            <Grid item>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Inventory Distribution
                </Typography>
                <Box
                  sx={{
                    height: 200,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <PieChart
                    series={[
                      {
                        data: pieChartData,
                        highlightScope: {
                          faded: "global",
                          highlighted: "item",
                        },
                        faded: {
                          innerRadius: 30,
                          additionalRadius: -30,
                          color: "gray",
                        },
                      },
                    ]}
                    height={200}
                    width={300}
                    slotProps={{
                      legend: { hidden: true },
                    }}
                  />
                </Box>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  justifyContent="center"
                  sx={{ mt: 1 }}
                >
                  {pieChartData.map((item) => (
                    <Chip
                      key={item.id}
                      label={`${item.label}: ${item.value}%`}
                      size="small"
                      sx={{ mb: 1, bgcolor: item.color, color: "white" }}
                    />
                  ))}
                </Stack>
              </Paper>
            </Grid>

            {/* Low Stock Alert */}
            <Grid item>
              <Paper sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Low Stock Items</Typography>
                  <Chip
                    icon={<Warning fontSize="small" />}
                    label={`${lowStockItems.length} Items`}
                    color="warning"
                    size="small"
                  />
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>In Stock</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lowStockItems.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell>
                            <Typography variant="body2" noWrap>
                              {item.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.category}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>
                                {item.inStock}/{item.minRequired}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={(item.inStock / item.minRequired) * 100}
                              color={
                                item.status === "Critical" ? "error" : "warning"
                              }
                              sx={{ height: 4, borderRadius: 2 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.status}
                              size="small"
                              color={getStatusColor(item.status)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Button startIcon={<Archive />} color="primary">
                    View All Low Stock
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
