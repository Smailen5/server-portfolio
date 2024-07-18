const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
const uri = `mongodb+srv://${process.env.MONGODB_USER_PASS}@cluster0.u0afaln.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB Atlas yeah :)"))
  .catch((err) => console.error("Could not connect to MongoDB Atlas", err));

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
