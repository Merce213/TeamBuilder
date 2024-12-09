import express, { Application } from "express";
import cors from "cors";
import userRoutes from "./routes/user.route";
import championRoutes from "./routes/champion.route";

const app: Application = express();

// Middleware 
app.use(cors(
	{
		origin: "http://localhost:3000",
		credentials: true,
	},
))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Définir les routes
app.use("/api/users", userRoutes);
app.use("/api/champions", championRoutes);

export default app;
