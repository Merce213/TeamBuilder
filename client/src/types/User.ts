export enum UserRole {
	USER = "USER",
	ADMIN = "ADMIN",
}

export interface UserStorage {
	id: string;
	username: string;
	email: string;
	role: UserRole;
}
