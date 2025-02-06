import { Router } from "express";
import { getChampion, getChampions } from "../controllers/champion.controller";

const router: Router = Router();

router.get("/", getChampions);
router.get("/:nameId", getChampion);

export default router;
