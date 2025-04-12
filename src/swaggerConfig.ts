import { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Codev Onboarding Portal API",
      version: "1.0.0",
      description: "API documentation for the onboarding portal",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./src/swaggerDefinitions/*.ts"],
};

export default swaggerOptions;