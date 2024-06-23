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
    // Run the comparison script
    exec('python3 ./scripts/compare_dell_bestbuy_current_date.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        console.error(`Script stderr: ${stderr}`);
        return res.status(500).json({ message: 'Error executing comparison script', error: error.message, stderr });
      }

      // Read the generated CSV file
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
    // Run the comparison script
    exec('python3 ./scripts/compare_dell_newegg_current_date.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        console.error(`Script stderr: ${stderr}`);
        return res.status(500).json({ message: 'Error executing comparison script', error: error.message, stderr });
      }

      // Read the generated CSV file
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

module.exports = router;