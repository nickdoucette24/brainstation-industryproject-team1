const express = require('express');
const router = express.Router();
const path = require('path');
const csvtojson = require('csvtojson');
const { exec } = require('child_process');
require('dotenv').config();

// Load environment variables
const DATA_DIR = process.env.DATA_DIR || './scripts/data';

// Function to get the current date in the desired format
function getCurrentDate() {
  const current_time = new Date();
  return `${current_time.getFullYear()}${String(current_time.getMonth() + 1).padStart(2, '0')}${String(current_time.getDate()).padStart(2, '0')}`;
}

// Endpoint to run the comparison script and return the data
router.get('/compare/dell-bestbuy', async (req, res) => {
  try {
    exec('python3 ./scripts/compare_dell_bestbuy_current_date.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        console.error(`Script stderr: ${stderr}`);
        return res.status(500).json({ message: 'Error executing comparison script', error: error.message, stderr });
      }
      const date = getCurrentDate();
      const csvFilePath = path.join(DATA_DIR, `bestbuy_comparison_${date}.csv`);
      csvtojson()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
          res.json(jsonObj);
        })
        .catch((err) => {
          console.error(`Error reading CSV file: ${err.message}`);
          res.status(500).json({ message: 'Error reading comparison data', error: err });
        });
    });
  } catch (error) {
    console.error(`Unexpected error: ${error.message}`);
    res.status(500).json({ message: 'Unexpected error', error });
  }
});

router.get('/compare/dell-newegg', async (req, res) => {
  try {
    exec('python3 ./scripts/compare_dell_newegg_current_date.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        console.error(`Script stderr: ${stderr}`);
        return res.status(500).json({ message: 'Error executing comparison script', error: error.message, stderr });
      }
      const date = getCurrentDate();
      const csvFilePath = path.join(DATA_DIR, `newegg_comparison_${date}.csv`);
      csvtojson()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
          res.json(jsonObj);
        })
        .catch((err) => {
          console.error(`Error reading CSV file: ${err.message}`);
          res.status(500).json({ message: 'Error reading comparison data', error: err });
        });
    });
  } catch (error) {
    console.error(`Unexpected error: ${error.message}`);
    res.status(500).json({ message: 'Unexpected error', error });
  }
});

// New endpoint to fetch dashboard data
router.get('/dashboard', async (req, res) => {
  const date = getCurrentDate();
  try {
    const dellFilePath = path.join(DATA_DIR, `official_dell_monitor_${date}.csv`);
    const bestbuyFilePath = path.join(DATA_DIR, `bestbuy_comparison_${date}.csv`);
    const neweggFilePath = path.join(DATA_DIR, `newegg_comparison_${date}.csv`);

    const dellData = await csvtojson().fromFile(dellFilePath);
    const bestbuyData = await csvtojson().fromFile(bestbuyFilePath);
    const neweggData = await csvtojson().fromFile(neweggFilePath);

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

module.exports = router;