const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());

require("dotenv").config();
const { CORS_ORIGIN } = process.env;
app.use(cors({ origin: CORS_ORIGIN }));

app.use(express.static("public"));

app.use((req, res, next) => {
  next();
});

app.listen(8080, () => {
  console.log("Server is working on http://localhost:8080");
});