import { Router } from "express";
import dataController from "../controllers/data_controller.js";

const router = new Router();

router.get("/trending", dataController.getAll);
router.get("/tranding/:id", dataController.getOneId);
router.put("/data", dataController.updateData);

export default router;
