import amqp from "amqplib";
import { config } from "../config";

let channel: amqp.Channel;
const rabbitMqUri = config.rabbitMqUri;

const connectQueue = async () => {
  try {
    const connection = await amqp.connect(rabbitMqUri);
    channel = await connection.createChannel();
    await channel.assertQueue("notifications", { durable: false });
    console.log("Connected to RabbitMQ and channel created.");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};
const sendToQueue = async (queue: string, message: any) => {
  if (!channel) await connectQueue();
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  console.log(`Message sent to queue ${queue}`);
};

export { connectQueue, sendToQueue };
