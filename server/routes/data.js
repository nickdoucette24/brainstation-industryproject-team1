const express = require('express');
const router = express.Router();
const path = require('path');
const csvtojson = require('csvtojson');
require('dotenv').config();

// Load environment variables
const DATA_DIR = path.resolve(__dirname, '../scripts/data'); 

// Function to get the current date in the desired format
function getCurrentDate() {
  const current_time = new Date();
  return `${current_time.getFullYear()}${String(current_time.getMonth() + 1).padStart(2, '0')}${String(current_time.getDate()).padStart(2, '0')}`;
}

// Endpoint to fetch Dell data
router.get('/dell', async (req, res) => {
  const date = getCurrentDate();
  const dellFilePath = path.join(DATA_DIR, `official_dell_monitor_${date}.csv`);

  try {
    const dellData = await csvtojson().fromFile(dellFilePath);
    res.json(dellData);
  } catch (error) {
    console.error(`Error fetching Dell data: ${error.message}`);
    res.status(500).json({ message: 'Error fetching Dell data', error });
  }
});

// Endpoint to fetch BestBuy comparison data
router.get('/compare/dell-bestbuy', async (req, res) => {
  const date = getCurrentDate();
  const bestbuyFilePath = path.join(DATA_DIR, `bestbuy_comparison_${date}.csv`);

  try {
    const bestbuyData = await csvtojson().fromFile(bestbuyFilePath);
    res.json(bestbuyData);
  } catch (error) {
    console.error(`Error fetching BestBuy data: ${error.message}`);
    res.status(500).json({ message: 'Error fetching BestBuy data', error });
  }
});

// Endpoint to fetch Newegg comparison data
router.get('/compare/dell-newegg', async (req, res) => {
  const date = getCurrentDate();
  const neweggFilePath = path.join(DATA_DIR, `newegg_comparison_${date}.csv`);

  try {
    const neweggData = await csvtojson().fromFile(neweggFilePath);
    res.json(neweggData);
  } catch (error) {
    console.error(`Error fetching Newegg data: ${error.message}`);
    res.status(500).json({ message: 'Error fetching Newegg data', error });
  }
});

// Endpoint to fetch dashboard data
router.get('/dashboard', async (req, res) => {
  const date = getCurrentDate();
  try {
    const dellFilePath = path.join(DATA_DIR, `official_dell_monitor_${date}.csv`);
    const bestbuyFilePath = path.join(DATA_DIR, `bestbuy_comparison_${date}.csv`);
    const neweggFilePath = path.join(DATA_DIR, `newegg_comparison_${date}.csv`);

    console.log('Checking file paths:');
    console.log(`      Dell: ${dellFilePath}`);
    console.log(`      BestBuy: ${bestbuyFilePath}`);
    console.log(`      Newegg: ${neweggFilePath}`);

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

module.exports = router;