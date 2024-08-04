
import express from "express";
import userRoutes from "./userRoutes.js";
import workplaceRoutes from "./workplaceRoutes.js"
const router = express.Router();

router.use("/user", userRoutes); //api/user/login
router.use("/workplace", workplaceRoutes); 

export default router;