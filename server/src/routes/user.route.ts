import { Router } from "express";
import {
	deleteUser,
	getAllUsers,
	getUser,
	searchUsers,
	updateUser,
	addFavoriteLanes,
	removeFavoriteLanes,
	addFavoriteChampions,
	removeFavoriteChampions,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/authentication.middleware";
import {
	checkAuthorization,
	checkUserInParamsExists,
} from "../middlewares/authorization.middleware";
import { validateData } from "../middlewares/validation.middleware";
import {
	UserUpdateSchema,
	addOrRemoveFavoriteLanesSchema,
	addOrRemoveFavoriteChampionsSchema,
} from "../schemas/user.schema";

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
router.post(
	"/:userId/favorite-lanes",
	[
		authenticate,
		validateData(addOrRemoveFavoriteLanesSchema),
		checkUserInParamsExists,
		checkAuthorization(),
	],
	addFavoriteLanes
);
router.delete(
	"/:userId/favorite-lanes",
	[
		authenticate,
		validateData(addOrRemoveFavoriteLanesSchema),
		checkUserInParamsExists,
		checkAuthorization(),
	],
	removeFavoriteLanes
);
router.post(
	"/:userId/favorite-champions",
	[
		authenticate,
		validateData(addOrRemoveFavoriteChampionsSchema),
		checkUserInParamsExists,
		checkAuthorization(),
	],
	addFavoriteChampions
);
router.delete(
	"/:userId/favorite-champions",
	[
		authenticate,
		validateData(addOrRemoveFavoriteChampionsSchema),
		checkUserInParamsExists,
		checkAuthorization(),
	],
	removeFavoriteChampions
);

export default router;
