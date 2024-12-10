export enum TokenType {
	AccessToken = "accessToken",
	RefreshToken = "refreshToken",
	PasswordResetToken = "passwordResetToken",
	InvitationToken = "invitationToken",
}

export const TokenSecrets = {
	[TokenType.AccessToken]: process.env.JWT_SECRET || "",
	[TokenType.RefreshToken]: process.env.REFRESH_SECRET || "",
	[TokenType.PasswordResetToken]: process.env.RESET_PASSWORD_SECRET || "",
	[TokenType.InvitationToken]: process.env.INVITATION_SECRET || "",
};
