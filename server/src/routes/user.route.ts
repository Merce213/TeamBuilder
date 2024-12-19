import { Router } from "express";
import { checkAuthorization } from "../middlewares/authorization.middleware";
import {
	getAllUsers,
	getUser,
	updateUser,
	deleteUser,
	searchUsers,
	resetPasswordLink,
	changeResetPassword,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/authentication.middleware";
import { validateData } from "../middlewares/validation.middleware";
import {
	UserUpdateSchema,
	ChangeForgottenPasswordSchema,
	ResetPasswordRequestSchema,
} from "../schemas/user.schema";

const router: Router = Router();

router.get(
	"/all",
	[authenticate, checkAuthorization(true, false)],
	getAllUsers
);
router.get("/search", authenticate, searchUsers);
router.post(
	"/reset-password-link",
	[validateData(ResetPasswordRequestSchema)],
	resetPasswordLink
);
router.post(
	"/change-forgotten-password",
	[validateData(ChangeForgottenPasswordSchema)],
	changeResetPassword
);

router.get("/:userId", [authenticate, checkAuthorization()], getUser);
router.put(
	"/:userId",
	[authenticate, validateData(UserUpdateSchema), checkAuthorization()],
	updateUser
);
router.delete("/:userId", [authenticate, checkAuthorization()], deleteUser);

export default router;
