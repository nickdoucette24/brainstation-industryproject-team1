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

// Endpoint to fetch retailers
router.get('/:retailerId', async (req, res) => {
  const { retailerId } = req.params;
  const date = getCurrentDate();
  let filePath;

  if (retailerId === 'bestbuy') {
    filePath = path.join(DATA_DIR, `bestbuy_comparison_${date}.csv`);
  } else if (retailerId === 'newegg') {
    filePath = path.join(DATA_DIR, `newegg_comparison_${date}.csv`);
  } else {
    return res.status(400).json({ message: 'Invalid retailer ID' });
  }

  try {
    const retailerData = await csvtojson().fromFile(filePath);

    const totalProducts = retailerData.length;
    const complianceRate = (retailerData.filter(item => item.Status === 'Green').length / totalProducts) * 100;
    const averageDeviation = retailerData.reduce((sum, item) => sum + parseFloat(item.Deviation || 0), 0) / totalProducts;
    const topOffendingProducts = retailerData.filter(item => item.Status !== 'Green').sort((a, b) => a.Deviation - b.Deviation).slice(0, 5);

    const retailer = {
      name: retailerId.charAt(0).toUpperCase() + retailerId.slice(1),
      totalProducts,
      complianceRate: complianceRate.toFixed(2),
      averageDeviation: averageDeviation.toFixed(2),
      topOffendingProducts
    };

    res.json(retailer);
  } catch (error) {
    console.error(`Error fetching retailer data: ${error.message}`);
    res.status(500).json({ message: 'Error fetching retailer data', error });
  }
});

module.exports = router;