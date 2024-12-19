import { Router } from "express";
import {
	deleteUser,
	getAllUsers,
	getUser,
	searchUsers,
	updateUser,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/authentication.middleware";
import { checkAuthorization } from "../middlewares/authorization.middleware";
import { validateData } from "../middlewares/validation.middleware";
import { UserUpdateSchema } from "../schemas/user.schema";

const router: Router = Router();

router.get(
	"/all",
	[authenticate, checkAuthorization(true, false)],
	getAllUsers
);
router.get("/search", authenticate, searchUsers);

router.get("/:userId", [authenticate, checkAuthorization()], getUser);
router.put(
	"/:userId",
	[authenticate, validateData(UserUpdateSchema), checkAuthorization()],
	updateUser
);
router.delete("/:userId", [authenticate, checkAuthorization()], deleteUser);

export default router;
