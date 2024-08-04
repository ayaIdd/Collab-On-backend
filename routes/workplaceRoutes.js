import express from "express";
import {
    createProject , getProject
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/:workplaceId/create", createProject);
router.get("/:workplaceId/projects/:projectId", getProject);

export default router;