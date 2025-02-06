import { Router } from "express";
import {
	changeResetPassword,
	me,
	refreshToken,
	resetPasswordLink,
	signIn,
	signOut,
	signUp,
	userAgent,
} from "../controllers/auth.controller";
import {
	authenticate,
	refreshAuthenticate,
} from "../middlewares/authentication.middleware";
import { validateData } from "../middlewares/validation.middleware";
import {
	ChangeForgottenPasswordSchema,
	ResetPasswordRequestSchema,
	UserSignInSchema,
	UserSignUpSchema,
} from "../schemas/user.schema";
import { checkNotAuthenticated } from "./../middlewares/authentication.middleware";

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
router.post(
	"/reset-password-link",
	[checkNotAuthenticated, validateData(ResetPasswordRequestSchema)],
	resetPasswordLink
);
router.post(
	"/change-forgotten-password",
	[checkNotAuthenticated, validateData(ChangeForgottenPasswordSchema)],
	changeResetPassword
);
router.get("/me", authenticate, me);
router.get("/ua", userAgent);

router.post("/refresh_token", refreshAuthenticate, refreshToken);

export default router;
