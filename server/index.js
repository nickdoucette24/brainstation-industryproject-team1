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

app.use("/dashboard", dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/retailers", retailersRoutes);
app.use("/api/data", dataRoutes);

// Function to get the current date in the desired format
function getCurrentDate() {
  const current_time = new Date();
  return `${current_time.getFullYear()}${String(current_time.getMonth() + 1).padStart(2, '0')}${String(current_time.getDate()).padStart(2, '0')}`;
}

// Determine the correct Python executable
const pythonExecutable = os.platform() === "win32" ? "python" : "python3";

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

// Endpoint to fetch Dell-BestBuy comparison data
app.get("/api/data/compare/dell-bestbuy", (req, res) => {
  const date = getCurrentDate();
  const csvFilePath = path.join(DATA_DIR, `bestbuy_comparison_${date}.csv`);

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

// Endpoint to fetch Dell-Newegg comparison data
app.get("/api/data/compare/dell-newegg", (req, res) => {
  const date = getCurrentDate();
  const csvFilePath = path.join(DATA_DIR, `newegg_comparison_${date}.csv`);

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

// Endpoint to fetch BestBuy Dell monitors data
app.get("/api/data/bestbuy", (req, res) => {
  const date = getCurrentDate();
  const csvFilePath = path.join(DATA_DIR, `bestbuy_dell_monitor_${date}.csv`);

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

// Endpoint to fetch Newegg Dell monitors data
app.get("/api/data/newegg", (req, res) => {
  const date = getCurrentDate();
  const csvFilePath = path.join(DATA_DIR, `newegg_dell_monitor_${date}.csv`);

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

// Endpoint to fetch Dell monitors data
app.get("/api/data/dell", (req, res) => {
  const date = getCurrentDate();
  const csvFilePath = path.join(DATA_DIR, `official_dell_monitor_${date}.csv`);

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

app.use(express.static("public"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});