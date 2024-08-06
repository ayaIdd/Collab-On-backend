
import express from "express";
import userRoutes from "./userRoutes.js";
import workplaceRoutes from "./workplaceRoutes.js"
// import inviteRoutes from "./inviteRoutes.js"
const router = express.Router();

router.use("/user", userRoutes); //user/login
router.use("/workplace", workplaceRoutes); 
// router.use("/invite" , inviteRoutes)

export default router;