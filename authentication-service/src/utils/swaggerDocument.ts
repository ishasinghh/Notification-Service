import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Authentication Service API",
      version: "1.0.0",
      description: "API documentation for the Authentication Service",
    },
    servers: [
      {
        url: "http://localhost:3000/v1",
      },
    ],
  },
  apis: ["./src/swagger/auth.yaml"], // Path to the YAML files
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
