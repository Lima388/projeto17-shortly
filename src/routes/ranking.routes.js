import { Router } from "express";
import { findOrdered } from "../controllers/rankings.controller.js";

const router = Router();

router.get("/ranking", findOrdered);

export default router;
