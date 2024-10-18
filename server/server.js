const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(bodyParser.json());

const corsOptions = {
  origin: 'https://satta-dun.vercel.app', // Allow requests from this origin
};
app.use(cors(corsOptions));
// Load data from JSON file
const loadData = () => {
  const data = fs.readFileSync(path.join(__dirname, "data.json"));
  return JSON.parse(data);
};
app.get('/', (req, res) => {
  res.send('Hello, world!');
});
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
