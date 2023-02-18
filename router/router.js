import { Router } from "express";
import dataController from "../controllers/data_controller.js";

const router = new Router();

router.get("/trending", dataController.getAll);
router.get("/trending/:id", dataController.getOneId);
router.put("/update", dataController.updateData);
router.get("/config", dataController.getConfig);

export default router;
