import dotenv from "dotenv";
dotenv.config();

const keys = {
	accessTokenSecret: process.env.JWT_SECRET || "",
	refreshTokenSecret: process.env.JWT_REFRESH_SECRET || "",
	passwordResetTokenSecret: process.env.JWT_PASSWORD_RESET_SECRET || "",
	invitationTokenSecret: process.env.JWT_INVITATION_SECRET || "",
};

export default keys;
