import { Router } from "express";
import dataController from "../controllers/data_controller.js";

const router = new Router();

router.get("/trending", dataController.getAll);
router.get("/tranding/:id", dataController.getOneId);
router.put("/update", dataController.updateData);

export default router;
