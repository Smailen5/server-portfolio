const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();;


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose
.connect(process.env.MONGODB_ATLAS_URI)
.then(() => console.log("Connected to MongoDB yeah :)"))
.catch((err) => console.error("Connection failed :(", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Routes
const projectsRouter = require("./routes/routes");
app.use("/projects", projectsRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
