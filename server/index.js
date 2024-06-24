const express = require("express");
const path = require("path");
const os = require("os");
const cors = require("cors");
const csvtojson = require("csvtojson");

const app = express();
require("dotenv").config();
const { CORS_ORIGIN, DATA_DIR } = process.env;

app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

// Express Routes
const dashboardRoutes = require("./routes/dashboard");
const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/products");
const retailersRoutes = require("./routes/retailers");
const dataRoutes = require("./routes/data");

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes); // Added /api prefix
app.use("/api/products", productsRoutes); // Added /api prefix
app.use("/api/retailers", retailersRoutes); // Added /api prefix
app.use("/api/data", dataRoutes);

app.use(express.static("public"));

// Function to get the current date in the desired format
function getCurrentDate() {
  const current_time = new Date();
  return `${current_time.getFullYear()}${String(current_time.getMonth() + 1).padStart(2, '0')}${String(current_time.getDate()).padStart(2, '0')}`;
}

// Endpoint to fetch combined product data
app.get("/api/data/products", (req, res) => {
  const date = getCurrentDate();
  const csvFilePath = path.join(DATA_DIR, `combined_product_data_${date}.csv`);

  csvtojson()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      res.json(jsonObj);
    })
    .catch((err) => {
      console.error(`Error reading CSV file: ${err.message}`);
      res.status(500).json({ message: 'Error reading CSV data', error: err });
    });
});

// New endpoint to fetch dashboard data
app.get("/api/data/dashboard", async (req, res) => {
  const date = getCurrentDate();
  try {
    const dellFilePath = path.join(DATA_DIR, `official_dell_monitor_${date}.csv`);
    const bestbuyFilePath = path.join(DATA_DIR, `bestbuy_comparison_${date}.csv`);
    const neweggFilePath = path.join(DATA_DIR, `newegg_comparison_${date}.csv`);

    console.log('Checking file paths:');
    console.log(`Dell: ${dellFilePath}`);
    console.log(`BestBuy: ${bestbuyFilePath}`);
    console.log(`Newegg: ${neweggFilePath}`);

    const [dellData, bestbuyData, neweggData] = await Promise.all([
      csvtojson().fromFile(dellFilePath),
      csvtojson().fromFile(bestbuyFilePath),
      csvtojson().fromFile(neweggFilePath)
    ]);

    const totalOffenders = 2; // Assuming monitoring BestBuy and Newegg
    const bestbuyTop5 = bestbuyData.sort((a, b) => a.Deviation - b.Deviation).slice(0, 5);
    const neweggTop5 = neweggData.sort((a, b) => a.Deviation - b.Deviation).slice(0, 5);
    const totalDeviatedProductsBestBuy = bestbuyData.filter(item => item.Deviation !== 0).length;
    const averageDeviationBestBuy = bestbuyData.reduce((sum, item) => sum + parseFloat(item.Deviation), 0) / bestbuyData.length;
    const averageDeviationNewegg = neweggData.reduce((sum, item) => sum + parseFloat(item.Deviation), 0) / neweggData.length;
    const complianceRateBestBuy = (bestbuyData.filter(item => item.Status === 'Green').length / bestbuyData.length) * 100;
    const complianceRateNewegg = (neweggData.filter(item => item.Status === 'Green').length / neweggData.length) * 100;

    const combinedTopOffenders = [...bestbuyTop5, ...neweggTop5].sort((a, b) => a.Deviation - b.Deviation).slice(0, 5);

    const dashboardData = {
      totalOffenders,
      bestbuyTop5,
      neweggTop5,
      totalDeviatedProductsBestBuy,
      averageDeviationBestBuy,
      averageDeviationNewegg,
      complianceRateBestBuy,
      complianceRateNewegg,
      combinedTopOffenders
    };

    res.json(dashboardData);
  } catch (error) {
    console.error(`Error fetching dashboard data: ${error.message}`);
    res.status(500).json({ message: 'Error fetching dashboard data', error });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});