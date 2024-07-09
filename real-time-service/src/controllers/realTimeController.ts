import { Server, Socket } from "socket.io";
import axios from "axios";
import { CustomError } from "../errors/customError";
import { config } from "../config";

export const handleConnection = (io: Server) => {
  io.use(async (socket: Socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new CustomError("Authentication error", 401));
    }

    try {
      const authServiceUrl = config.authServiceUrl;
      const response = await axios.post(
        `${authServiceUrl}/v1/validateToken`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        socket.data.user = response.data.user;
        await axios.post(`${authServiceUrl}/v1/updateConnectionStatus`, {
          userId: socket.data.user.id,
          status: true,
        });
        next();
      } else {
        next(new CustomError("Authentication error", 401));
      }
    } catch (error) {
      next(new CustomError("Authentication error", 401));
    }
  });

  io.on("connection", (socket: Socket) => {
    const authServiceUrl = config.authServiceUrl;
    console.log(`User ${socket.data.user.id} connected`);
    socket.on("join", (userId: string) => {
      console.log(`User ${userId} joined`);
      socket.join(userId);
      socket.emit("joined", `User ${userId} joined`);
    });

    socket.on("disconnect", async () => {
      console.log(`User ${socket.data.user.id} disconnected`);
      await axios.post(`${authServiceUrl}/v1/updateConnectionStatus`, {
        userId: socket.data.user.id,
        status: false,
      });
    });
  });
};
