import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import championRoutes from "./routes/champion.route";
import userRoutes from "./routes/user.route";
import groupRoutes from "./routes/group.route";
import summonerRoutes from "./routes/summoner.route";
import invitationRoutes from "./routes/invitation.route";
import teamRoutes from "./routes/team.route";
import keys from "./utils/keys";

const app: Application = express();

// Middleware
app.use(
	cors({
		origin: ["http://localhost:5173", `${keys.frontendUrl}`],
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Définir les routes
app.use("/api/auth", authRoutes);
app.use("/api/champions", championRoutes);
app.use("/api/users", userRoutes, groupRoutes, teamRoutes);
app.use("/api/summoners", summonerRoutes);
app.use("/api/invitations", invitationRoutes);

export default app;
