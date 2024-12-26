export enum UserRole {
	USER = "USER",
	ADMIN = "ADMIN",
}

export interface UserStorage {
	id: number;
	username: string;
	email: string;
	role: UserRole;
}
