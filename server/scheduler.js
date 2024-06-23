const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

const scriptsDir = path.join(__dirname, 'scripts');

// Function to execute a Python script
function runPythonScript(scriptName) {
    exec(`python3 ${path.join(scriptsDir, scriptName)}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error executing ${scriptName}: ${err.message}`);
            return;
        }
        console.log(`${scriptName} output: ${stdout}`);
        if (stderr) console.error(`${scriptName} stderr: ${stderr}`);
    });
}

// Schedule Dell scraper to run every day at midnight
cron.schedule('0 0 * * *', () => {
    runPythonScript('dell_scraper.py');
});

// Schedule Newegg scraper to run every day at 12:30 AM
cron.schedule('30 0 * * *', () => {
    runPythonScript('newegg_scraper.py');
});

// Schedule BestBuy scraper to run every day at 1:00 AM
cron.schedule('0 1 * * *', () => {
    runPythonScript('bestbuy_scraper.py');
});

// Schedule comparison of Dell and Newegg to run every day at 1:30 AM
cron.schedule('30 1 * * *', () => {
    runPythonScript('compare_dell_newegg_current_date.py');
});

// Schedule comparison of Dell and BestBuy to run every day at 2:00 AM
cron.schedule('0 2 * * *', () => {
    runPythonScript('compare_dell_bestbuy_current_date.py');
});

// Schedule the product page script to run every day at 2:30 AM
cron.schedule('30 2 * * *', () => {
    runPythonScript('product_page.py');
});

console.log('Scrapers and comparison scripts scheduled to run daily at specified times.');
