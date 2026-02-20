require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const vehicleRoutes = require("./routes/vehicleRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Netra Backend Running 🚀");
});

app.use("/api/vehicle", vehicleRoutes);
app.use("/api/rings", require("./routes/ringRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/emergency", emergencyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
