import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Notification Service API",
      version: "1.0.0",
      description: "API documentation for the Notification Service",
    },
    servers: [
      {
        url: "http://localhost:3001/v1", // Replace with your API base URL
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // Path to the YAML file containing API definitions
  apis: ["./src/swagger/notification.yaml"], // Directly specify the path
};

const specs = swaggerJsdoc(options);

export default specs;
