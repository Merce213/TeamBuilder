import dotenv from "dotenv";
dotenv.config();
const versionRiotApi = "15.2.1";

const keys = {
	accessTokenSecret: process.env.JWT_SECRET || "",
	refreshTokenSecret: process.env.JWT_REFRESH_SECRET || "",
	passwordResetTokenSecret: process.env.JWT_PASSWORD_RESET_SECRET || "",
	invitationTokenSecret: process.env.JWT_INVITATION_SECRET || "",
	riotApiKey: process.env.RIOT_API_KEY || "",
	resendApiKey: process.env.RESEND_API_KEY || "",
	frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
	backendUrl: process.env.BACKEND_URL || "http://localhost:3001",
	ddragonApiKey: process.env.DDRAGON_API_URL || "",
	profileIconApi: `https://ddragon.leagueoflegends.com/cdn/${versionRiotApi}/img/profileicon`,
};

export default keys;
