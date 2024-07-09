import dotenv from "dotenv";

dotenv.config();

interface ConfigType {
  port: number;
  mongoURI: string;
  authServiceUrl: string;
  rabbitMqUri: string;
  queueName: string;
}

export const config: ConfigType = {
  port: parseInt(process.env.PORT || "3001", 10),
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/",
  authServiceUrl: process.env.AUTH_SERVICE_URL || "http://localhost:3000",
  rabbitMqUri:
    process.env.RABBITMQ_URI ||
    "amqps://ccnnthuo:LpeFee21zWIXxasul6bHayu-IwWzvAz-@lionfish.rmq.cloudamqp.com/ccnnthuo",
  queueName: process.env.QUEUE_NAME || "notification",
};
