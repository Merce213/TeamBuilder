import express, { Application } from "express";
import userRoutes from "./routes/user.route";

const app: Application = express();

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Définir les routes
app.use("/api/users", userRoutes);

export default app;
