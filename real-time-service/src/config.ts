import dotenv from "dotenv";

dotenv.config();

interface ConfigType {
  port: number;
  rabbitMqUri: string;
  authServiceUrl: string;
}

export const config: ConfigType = {
  port: parseInt(process.env.PORT || "3002", 10),
  rabbitMqUri:
    process.env.RABBITMQ_URI ||
    "amqps://ccnnthuo:LpeFee21zWIXxasul6bHayu-IwWzvAz-@lionfish.rmq.cloudamqp.com/ccnnthuo",
  authServiceUrl: process.env.AUTH_SERVICE_URL || "http://localhost:3000",
};
