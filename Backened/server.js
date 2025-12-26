require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const socketHandler = require("./socket/socket");

const app = express();
const server = http.createServer(app);

// DB connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Socket.io
const io = new Server(server, {
  cors: { origin: "*" }
});

socketHandler(io);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
