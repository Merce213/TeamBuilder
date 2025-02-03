import { UserRole } from "@prisma/client";

export interface UserJwtPayload {
	id: string;
	email: string;
	username: string;
	role: UserRole;
}
