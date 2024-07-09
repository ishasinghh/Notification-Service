import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDb } from "./utils/dbConnection";
import { config } from "./config";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { requestLogger } from "./middlewares/requestLogger";
import notificationRoutes from "./routes/notificationRoutes";
import { connectQueue } from "./utils/rabbitMQ";
import swaggerUi from "swagger-ui-express";
import specs from "./utils/swaggerDocument";

dotenv.config();

const app = express();
const PORT = config.port;

// Middleware
app.use(bodyParser.json());
app.use(requestLogger);

app.use("/v1", notificationRoutes);

// Swagger route
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    swaggerOptions: {
      authAction: {
        BearerAuth: {
          name: "Bearer token",
          schema: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
            description:
              'Enter your Bearer token in the format "Bearer <token>"',
          },
          value: "Bearer <token>",
        },
      },
    },
  })
);
// Catch-all route for handling 404 errors
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(errorMiddleware);
// Connect to database and RabbitMQ, then start server
Promise.all([connectDb(), connectQueue()])
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Notification service running on port: ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
