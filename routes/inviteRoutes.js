import { Router } from 'express';
import { sendInvitationEmail } from '../services/emailInvite.js';
import authMiddleware from '../middlewares/auth.js';
import Project from '../models/project.js'; // Assuming you have a Project model

const router = Router();



export default router;
