import keys from "../utils/keys";

export enum TokenType {
	AccessToken = "access_token",
	RefreshToken = "refresh_token",
	PasswordResetToken = "password_reset_token",
	InvitationToken = "invitation_token",
}

enum TokenDuration {
	FIFTEEN_MINUTES = "15m",
	THIRTY_MINUTES = "30m",
	ONE_HOUR = "1h",
	ONE_WEEK = "7d",
}

enum TokenDurationInMs {
	FIFTEEN_MINUTES = 15 * 60 * 1000,
	THIRTY_MINUTES = 30 * 60 * 1000,
	ONE_HOUR = 60 * 60 * 1000,
	ONE_WEEK = 7 * 24 * 60 * 60 * 1000,
}

export enum RedisDurationInSeconds {
	FIFTEEN_MINUTES = 15 * 60,
	THIRTY_MINUTES = 30 * 60,
	ONE_HOUR = 60 * 60,
	ONE_WEEK = 7 * 24 * 60 * 60,
}

export const TokenSecrets = {
	[TokenType.AccessToken]: keys.accessTokenSecret,
	[TokenType.RefreshToken]: keys.refreshTokenSecret,
	[TokenType.PasswordResetToken]: keys.passwordResetTokenSecret,
	[TokenType.InvitationToken]: keys.invitationTokenSecret,
};

export const TokenExpirations = {
	[TokenType.AccessToken]: TokenDuration.THIRTY_MINUTES,
	[TokenType.RefreshToken]: TokenDuration.ONE_WEEK,
	[TokenType.PasswordResetToken]: TokenDuration.FIFTEEN_MINUTES,
	[TokenType.InvitationToken]: TokenDuration.ONE_HOUR,
};

export const TokenExpirationsInMs = {
	[TokenType.AccessToken]: TokenDurationInMs.THIRTY_MINUTES,
	[TokenType.RefreshToken]: TokenDurationInMs.ONE_WEEK,
	[TokenType.PasswordResetToken]: TokenDurationInMs.FIFTEEN_MINUTES,
	[TokenType.InvitationToken]: TokenDurationInMs.ONE_HOUR,
};
