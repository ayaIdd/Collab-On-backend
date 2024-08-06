import express from "express";
import {
  loginUser,
  registerUser,
  registerUserByInvite,
  sendInvite 
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/registerBy/Invite" ,registerUserByInvite );
router.post("/sendInvite", sendInvite);


export default router;