
import express from "express";
import userRoutes from "./userRoutes.js";
import WorkspaceRoutes from "./workspaceRoutes.js"
import refreshTokenMiddleware from "../middlewares/refreshTokenMiddleware.js";


const router = express.Router();

router.use("/user", userRoutes); //user/login
router.use("/workspace", WorkspaceRoutes); 

router.post("/refresh-token", refreshTokenMiddleware, (req, res) => {
    res.json({ message: "Tokens refreshed successfully" });
  });

export default router;