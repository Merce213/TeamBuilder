import { Router } from "express";
import {
	getSummonerInfo,
	linkSummonerToUser,
	unlinkSummonerFromUser,
} from "../controllers/summoner.controller";
import { authenticate } from "../middlewares/authentication.middleware";
import { checkAuthorization } from "../middlewares/authorization.middleware";
import { validateData } from "../middlewares/validation.middleware";
import {
	GetSummonerInfoSchema,
	LinkSummonerToUserSchema,
} from "../schemas/user.schema";

const router: Router = Router();

// SUMMONER PROFILE INFOS
router.get(
	"/:userId",
	[authenticate, validateData(GetSummonerInfoSchema), checkAuthorization()],
	getSummonerInfo
);
router.post(
	"/:userId",
	[
		authenticate,
		validateData(LinkSummonerToUserSchema),
		checkAuthorization(),
	],
	linkSummonerToUser
);
router.delete(
	"/:userId",
	[authenticate, validateData(GetSummonerInfoSchema), checkAuthorization()],
	unlinkSummonerFromUser
);

export default router;
