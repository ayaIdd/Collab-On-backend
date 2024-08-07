
import express from "express";
import userRoutes from "./userRoutes.js";
import workplaceRoutes from "./workplaceRoutes.js"
import refreshTokenMiddleware from "../middlewares/refreshTokenMiddleware.js";

const router = express.Router();

router.use("/user", userRoutes); //user/login
router.use("/workplace", workplaceRoutes); 

router.post("/refresh-token", refreshTokenMiddleware, (req, res) => {
    res.json({ message: "Tokens refreshed successfully" });
  });

export default router;