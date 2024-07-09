import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { connectDb } from "./utils/dbConnection";
import { config } from "./config";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { requestLogger } from "./middlewares/requestLogger";
import { swaggerSpec, swaggerUi } from "./utils/swaggerDocument";

dotenv.config();

const app = express();
const PORT = config.port;

// Middleware
app.use(bodyParser.json());
app.use(requestLogger);

app.use("/v1", authRoutes);

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handling middleware
app.use(errorMiddleware);
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Authentication service running on port: ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
