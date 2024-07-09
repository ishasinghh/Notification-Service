import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { handleConnection } from "./controllers/realTimeController";
import { config } from "./config";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { consumeQueue } from "./utils/rabbitMQ";

dotenv.config();

const port = config.port;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

console.log("Initializing real-time service...");

// Set up middlewares
app.use(express.json());
app.use(errorMiddleware);

// Initialize WebSocket connection handling
handleConnection(io);

// Start the server and consume RabbitMQ messages
server.listen(port, async () => {
  console.log(`Real-time service running on port: ${port}`);
  await consumeQueue(io);
});
