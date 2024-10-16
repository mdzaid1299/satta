const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// Load data from JSON file
const loadData = () => {
  const data = fs.readFileSync(path.join(__dirname, "data.json"));
  return JSON.parse(data);
};

// Save data to JSON file
const saveData = (data) => {
  fs.writeFileSync(path.join(__dirname, "data.json"), JSON.stringify(data, null, 2));
};

// Get results
app.get("/results", (req, res) => {
  const data = loadData();
  res.json(data);
});

// Update results
app.post("/results", (req, res) => {
  const newData = req.body;
  saveData(newData);
  res.json(newData);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
