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

export interface User {
	id: string;
	username: string;
	email: string;
	role: UserRole;
	createdAt: string;
	updatedAt: string;
}

export interface UserCreate {
	username: string;
	email: string;
	oldPassword: string;
	newPassword: string;
}
