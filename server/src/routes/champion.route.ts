import { Router } from "express";
import { getChampions } from "../controllers/champion.controller";

const router: Router = Router();


router.get("/", getChampions);

export default router;
