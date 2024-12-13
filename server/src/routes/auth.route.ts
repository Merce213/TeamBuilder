import { Router } from "express";
import { checkNotAuthenticated } from "./../middlewares/authentication.middleware";
import { validateData } from "../middlewares/validation.middleware";
import {
	signIn,
	signUp,
	signOut,
	refreshToken,
	me,
	userAgent,
} from "../controllers/auth.controller";
import { UserSignInSchema, UserSignUpSchema } from "../schemas/user.schema";
import {
	authenticate,
	refreshAuthenticate,
} from "../middlewares/authentication.middleware";

const router: Router = Router();

router.post(
	"/signup",
	[checkNotAuthenticated, validateData(UserSignUpSchema)],
	signUp
);
router.post(
	"/signin",
	[checkNotAuthenticated, validateData(UserSignInSchema)],
	signIn
);
router.post("/signout", authenticate, signOut);
router.get("/me", authenticate, me);
router.get("/ua", userAgent);

router.post("/refresh_token", refreshAuthenticate, refreshToken);

export default router;
