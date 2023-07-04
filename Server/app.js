const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
var cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
// Connect to MongoDB
const { MONGO_URI } = process.env;
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Express API routes
app.use(express.json());
app.use(cors());

const Program = require("./models/program");

app.post("/saveResults", (req, res) => {
  const { type, input, output } = req.body;
  const newData = Program({ type, input, output });
  newData
    .save()
    .then(() => res.send("Data saved successfully!"))
    .catch((error) => {
      console.error("Error saving data:", error);
      res.status(500).send("An error occurred while saving the data.");
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
