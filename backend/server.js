require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/ring", require("./routes/ringRoutes"));
app.use("/api/emergency", require("./routes/emergencyRoutes"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinVehicleRoom", (vehicleId) => {
    socket.join(vehicleId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.set("io", io);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
