import { Router } from "express";
import { findAll, signIn, signUp } from "../controllers/users.controller.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";
import { signInValidation } from "../middlewares/signInValidation.middleware.js";
import { signUpValidation } from "../middlewares/signUpValidation.middleware.js";
const router = Router();

router.post("/signup", signUpValidation, signUp);
router.post("/signin", signInValidation, signIn);
router.get("/users/me", authValidation, findAll);

export default router;
