const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");

require("dotenv").config();
const { CORS_ORIGIN } = process.env;

app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

// Set up Multer for file uploads
const upload = multer({ dest: "uploads/" });

app.post("/convert", upload.single("file"), (req, res) => {
  const filePath = req.file.path;
  console.log(`Received file: ${filePath}`);

  const pythonProcess = spawn("python", [path.join(__dirname, "scripts", "convert_csv_to_json.py"), filePath]);

  let hasSentResponse = false;

  let hasSentResponse = false;

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Python output: ${data.toString()}`);
    if (!hasSentResponse) {
      try {
        const jsonData = JSON.parse(data.toString());
        res.json(jsonData);
        hasSentResponse = true;
      } catch (error) {
        console.error(`Error parsing JSON: ${error.message}`);
        if (!hasSentResponse) {
          res.status(500).send(`Error parsing JSON: ${error.message}`);
          hasSentResponse = true;
        }
      }
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python stderr: ${data}`);
    if (!hasSentResponse) {
      res.status(500).send(`Error processing file: ${data.toString()}`);
      hasSentResponse = true;
    }
  });

  pythonProcess.on('error', (error) => {
    console.error(`Failed to start subprocess: ${error.message}`);
    if (!hasSentResponse) {
      res.status(500).send(`Error processing file: ${error.message}`);
      hasSentResponse = true;
    }
  });

  pythonProcess.on('exit', (code, signal) => {
    if (code !== 0) {
      console.error(`Python process exited with code: ${code}, signal: ${signal}`);
      if (!hasSentResponse) {
        res.status(500).send(`Python process exited with code: ${code}, signal: ${signal}`);
        hasSentResponse = true;
      }
    } else {
      console.log('Python process exited successfully');
    }
  });
});

app.use(express.static("public"));

app.use((req, res, next) => {
  next();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});