import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";
import connectDB from "./config/dbConfig";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./swaggerConfig";
import newHireRoutes from "./routes/newHireRoutes";

const env = process.env.NODE_ENV || "development";

dotenv.config({
	path: env === "production" ? ".env.production" : ".env",
});

const app = express();

app.use(express.json());

app.use(cors());

app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// Connect to MongoDB
connectDB();

app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
