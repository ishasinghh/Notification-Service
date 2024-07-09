import amqp from "amqplib";
import { Server } from "socket.io";
import { config } from "../config";

let channel: amqp.Channel;
const rabbitMqUri = config.rabbitMqUri;

const connectQueue = async () => {
  const connection = await amqp.connect(rabbitMqUri);
  channel = await connection.createChannel();
  await channel.assertQueue("notifications", { durable: false });
};

const consumeQueue = async (io: Server) => {
  try {
    if (!channel) await connectQueue();
    channel.consume("notifications", (message) => {
      if (message) {
        const notification = JSON.parse(message.content.toString());
        const { userId } = notification;
        console.log(
          `userId: ${notification.userId}, message: ${notification.message}`
        );
        io.to(userId).emit("notification", notification);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error("Error consuming messages from RabbitMQ:", error);
  }
};

export { consumeQueue };
