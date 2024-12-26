import { Router } from "express";
import { linkSummonerToUser } from "../controllers/summoner.controller";
import { authenticate } from "../middlewares/authentication.middleware";

const router: Router = Router();

router.post("/", authenticate, linkSummonerToUser);

export default router;