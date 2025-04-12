// src/components/Reports/UsageReports.js
/**
 * UsageReports.js
 *
 * This component renders usage reports (charts) for inventory items.
 * It allows the user to select an item and a chart type (bar, line, stacked, combo)
 * and then aggregates and displays quantity updates over time.
 * Data is fetched from Firestore via helper functions from UsageHelper.js.
 */

import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { fetchQuantityTimeline, fetchAllUpdatesForItem } from "./UsageHelper";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Paper,
} from "@mui/material";

// Register Chart.js components for proper chart rendering
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const UsageReports = () => {
  // Local states to hold the inventory items, selected item, chart type, chart data, and limit of logs to display.
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [chartType, setChartType] = useState("bar"); // Options: "bar", "line", "stacked", "combo"
  const [chartData, setChartData] = useState(null);
  const [limit, setLimit] = useState(10);

  // Fetch inventory items from Firestore to populate the dropdown.
  useEffect(() => {
    const fetchItems = async () => {
      const snap = await getDocs(collection(db, "inventory"));
      const itemList = [];
      snap.forEach((docSnap) => {
        itemList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setItems(itemList);
    };
    fetchItems();
  }, []);

  // When the selected item, chart type, items list, or limit changes, fetch the appropriate chart data.
  useEffect(() => {
    if (!selectedItemId) {
      setChartData(null);
      return;
    }
    const fetchData = async () => {
      // Find the selected item and determine an identifier and display name.
      const selectedItem = items.find((itm) => itm.id === selectedItemId);
      const itemBarcode = selectedItem?.barcode || selectedItemId;
      const itemName = selectedItem ? selectedItem.name : itemBarcode;

      // If using "combo" chart type, fetch update logs with full before/after data.
      if (chartType === "combo") {
        const logs = await fetchAllUpdatesForItem(itemBarcode);
        const displayedLogs = logs.slice(-limit);
        const labels = displayedLogs.map((entry) => entry.dateStr);
        const originalValues = displayedLogs.map((entry) => entry.oldQty);
        const newValues = displayedLogs.map((entry) => entry.newQty);
        const combined = [...originalValues, ...newValues];
        const maxQty = combined.length > 0 ? Math.max(...combined) : 0;
        const minQty = combined.length > 0 ? Math.min(...combined) : 0;

        setChartData({
          labels,
          datasets: [
            {
              type: "bar",
              label: "Original Quantity",
              data: originalValues,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
              type: "line",
              label: "New Quantity",
              data: newValues,
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              fill: false,
            },
          ],
          minQty,
          maxQty,
          itemName,
        });
      } else if (chartType === "stacked") {
        // For stacked charts, display the original quantity and the change (delta) stacked.
        const logs = await fetchAllUpdatesForItem(itemBarcode);
        const displayedLogs = logs.slice(-limit);
        const labels = displayedLogs.map((entry) => entry.dateStr);
        const originalValues = displayedLogs.map((entry) => entry.oldQty);
        const changes = displayedLogs.map((entry) => entry.newQty - entry.oldQty);
        const combined = [
          ...originalValues,
          ...displayedLogs.map((entry) => entry.newQty),
        ];
        const maxQty = combined.length > 0 ? Math.max(...combined) : 0;
        const minQty = combined.length > 0 ? Math.min(...combined) : 0;

        setChartData({
          labels,
          datasets: [
            {
              label: "Original Quantity",
              data: originalValues,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              type: "bar",
            },
            {
              label: "Change",
              data: changes,
              backgroundColor: changes.map((change) =>
                change >= 0 ? "rgba(0,200,0,0.6)" : "rgba(200,0,0,0.6)"
              ),
              type: "bar",
            },
          ],
          minQty,
          maxQty,
          itemName,
        });
      } else {
        // For "bar" or "line" chart types, use timeline data from audit logs.
        const timeline = await fetchQuantityTimeline(itemBarcode);
        const displayedUpdates = timeline.slice(-limit);
        const labels = displayedUpdates.map((entry) => entry.dateStr);
        const data = displayedUpdates.map((entry) => entry.newQty);
        const maxQty = data.length > 0 ? Math.max(...data) : 0;
        const minQty = data.length > 0 ? Math.min(...data) : 0;

        setChartData({
          labels,
          datasets: [
            {
              label: `Quantity Over Time for ${itemName} (Last ${limit} updates)`,
              data,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 2,
              fill: chartType === "line",
            },
          ],
          minQty,
          maxQty,
          itemName,
        });
      }
    };

    fetchData();
  }, [selectedItemId, chartType, items, limit]);

  // If no chartData is available, display a placeholder with dropdowns to select item and chart type.
  if (!chartData) {
    return (
      <Box
        sx={{
          p: 4,
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: 2,
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          maxWidth: "90%",
          margin: "2rem auto",
        }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 3,
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "2rem",
          }}
        >
          Quantity Timeline Reports
        </Typography>
  
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mb: 2 }}
        >
          <FormControl
            variant="outlined"
            sx={{ minWidth: 180, backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <InputLabel sx={{ color: "#ccc" }}>Select Item</InputLabel>
            <Select
              label="Select Item"
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              sx={{
                color: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                },
              }}
            >
              <MenuItem value="">
                <em>-- Choose an item --</em>
              </MenuItem>
              {items.map((itm) => (
                <MenuItem key={itm.id} value={itm.id}>
                  {itm.name || itm.barcode || itm.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <FormControl
            variant="outlined"
            sx={{ minWidth: 140, backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <InputLabel sx={{ color: "#ccc" }}>Chart Type</InputLabel>
            <Select
              label="Chart Type"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              sx={{
                color: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                },
              }}
            >
              <MenuItem value="bar">Bar</MenuItem>
              <MenuItem value="line">Line</MenuItem>
              <MenuItem value="stacked">Stacked</MenuItem>
              <MenuItem value="combo">Combo</MenuItem>
            </Select>
          </FormControl>
        </Stack>
  
        {!selectedItemId && (
          <Typography align="center">
            Please select an item to see quantity timeline.
          </Typography>
        )}
      </Box>
    );
  }
  
  // Determine the chart title based on selected chart type and item name.
  const chartTitle =
    chartType === "stacked"
      ? `Stacked Chart for ${chartData.itemName}`
      : chartType === "combo"
      ? `Old vs New Quantity for ${chartData.itemName}`
      : chartData.datasets[0].label;
  
  return (
    <Box
      sx={{
        p: 4,
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: 2,
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        maxWidth: "90%",
        margin: "2rem auto",
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{
          mb: 3,
          fontFamily: '"Press Start 2P", cursive',
          fontSize: "2rem",
        }}
      >
        Quantity Timeline Reports
      </Typography>
  
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <FormControl
          variant="outlined"
          sx={{ minWidth: 180, backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <InputLabel sx={{ color: "#ccc" }}>Select Item</InputLabel>
          <Select
            label="Select Item"
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            sx={{
              color: "#fff",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.3)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#fff",
              },
            }}
          >
            <MenuItem value="">
              <em>-- Choose an item --</em>
            </MenuItem>
            {items.map((itm) => (
              <MenuItem key={itm.id} value={itm.id}>
                {itm.name || itm.barcode || itm.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  
        <FormControl
          variant="outlined"
          sx={{ minWidth: 140, backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <InputLabel sx={{ color: "#ccc" }}>Chart Type</InputLabel>
          <Select
            label="Chart Type"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            sx={{
              color: "#fff",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.3)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#fff",
              },
            }}
          >
            <MenuItem value="bar">Bar</MenuItem>
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="stacked">Stacked</MenuItem>
            <MenuItem value="combo">Combo</MenuItem>
          </Select>
        </FormControl>
      </Stack>
  
      {/* Chart container with fixed height */}
      <Box sx={{ p: 2, height: "400px" }}>
        {chartType === "bar" || chartType === "line" ? (
          chartType === "bar" ? (
            <Bar
              data={{
                labels: chartData.labels,
                datasets: chartData.datasets,
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: chartTitle },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    min: chartData.minQty - 5,
                    max: chartData.maxQty + 5,
                  },
                },
              }}
            />
          ) : (
            <Line
              data={{
                labels: chartData.labels,
                datasets: chartData.datasets,
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: chartTitle },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    min: chartData.minQty - 5,
                    max: chartData.maxQty + 5,
                  },
                },
              }}
            />
          )
        ) : chartType === "stacked" ? (
          <Bar
            data={{
              labels: chartData.labels,
              datasets: chartData.datasets,
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: chartTitle },
              },
              scales: {
                x: { stacked: true },
                y: {
                  stacked: true,
                  beginAtZero: false,
                  min: chartData.minQty - 5,
                  max: chartData.maxQty + 5,
                },
              },
            }}
          />
        ) : chartType === "combo" ? (
          <Bar
            data={{
              labels: chartData.labels,
              datasets: chartData.datasets,
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: chartTitle },
              },
              scales: {
                x: { stacked: true },
                y: {
                  stacked: false,
                  beginAtZero: false,
                  min: chartData.minQty - 5,
                  max: chartData.maxQty + 5,
                },
              },
            }}
          />
        ) : null}
      </Box>
  
      <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
        {chartType === "combo"
          ? "Blue bars represent the original quantity; the line shows the new quantity."
          : `Each data point represents an update log's new quantity at that timestamp (last ${limit} updates).`}
      </Typography>
  
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => setLimit(limit + 10)}>
          Show 10 More
        </Button>
        <Button variant="outlined" onClick={() => setLimit(9999)}>
          Show All
        </Button>
      </Stack>
    </Box>
  );
};

export default UsageReports;