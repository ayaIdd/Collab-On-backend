import { Router } from 'express';
import { sendInvitationEmail } from '../services/emailInvite.js';
import authMiddleware from '../middlewares/auth.js';
import Project from '../models/project.js'; // Assuming you have a Project model

const router = Router();

router.post('/:projectId', authMiddleware, async (req, res) => {
    const { email } = req.body;
    const { projectId } = req.params;

    try {
        // Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        const inviteLink = `http://localhost:4000/register?email=${encodeURIComponent(email)}&projectId=${projectId}`;

        // Send the invitation email
        sendInvitationEmail(email, inviteLink);

        res.status(200).json({ msg: 'Invitation sent' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;
