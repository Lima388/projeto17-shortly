import { Router } from "express";
import {
  create,
  findAndGo,
  remove,
  findOne,
} from "../controllers/urls.controller.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";
import { urlValidation } from "../middlewares/urlValidation.middleware.js";

const router = Router();

router.post("/urls/shorten", authValidation, urlValidation, create);
router.delete("/urls/:id", authValidation, remove);
router.get("/urls/:id", findOne);
router.get("/urls/open/:shortUrl", findAndGo);

export default router;
