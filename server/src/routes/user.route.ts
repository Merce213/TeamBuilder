import { Router } from "express";
import { validateData } from "../middlewares/validation.middleware";
import { signUp } from "../controllers/user.controller";
import { UserSignUpSchema } from "../schemas/user.schema";

const router: Router = Router();

router.post("/signup", validateData(UserSignUpSchema), signUp);

export default router;
