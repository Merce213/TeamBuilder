import { UserJwtPayload } from "../user";

declare global {
	namespace Express {
		export interface Request {
			user?: UserJwtPayload;
		}
	}
}
