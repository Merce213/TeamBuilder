import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import championRoutes from "./routes/champion.route";
import userRoutes from "./routes/user.route";

const app: Application = express();

// Middleware
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Définir les routes
app.use("/api/auth", authRoutes);
app.use("/api/champions", championRoutes);
app.use("/api/users", userRoutes);

export default app;
