import express from 'express';
import {
    getWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addUserToWorkspace,
    removeUserFromWorkspace,
    getWorkspaceUsers
} from '../controllers/workspace.js';

import {addProjectToWorkspace,
    updateProjectManager,
    addObjectiveToProject,
    removeObjectiveFromProject,
    updateObjectiveInProject
}from '../controllers/projectController.js'
import { checkPermission } from '../middlewares/role.js';
import { authenticateToken } from '../middlewares/auth.js';
import {  sendInvitationEmail_workspace} from "../services/email_invite_workspace.js"

const router = express.Router();
router.use(authenticateToken);


// router.get('/:workspaceId', getWorkspace);


router.get('/:workspaceId', checkPermission('view_workspace'), getWorkspace);

// Update workspace details
router.patch('/:workspaceId', checkPermission('manage_tasks'), updateWorkspace);

// Delete a workspace
router.delete('/:workspaceId', checkPermission('delete_workspace'), deleteWorkspace);

// Add a user to a workspace
router.post('/:workspaceId/users/add', checkPermission('invite_users'), addUserToWorkspace);

// Remove a user from a workspace
router.delete('/:workspaceId/users/delete/:userId'  , removeUserFromWorkspace);


// invite user to a workspace by the admin or owner 
router.post('/:workspaceId/add_members', checkPermission('invite_members_to_workspace') , sendInvitationEmail_workspace);

// get workspace users
router.get('/:workspaceId/users', getWorkspaceUsers);

//_________________________________________________________________
//_________________________________________________________________

// Add a project to a workspace
router.post('/:workspaceId/projects/add', checkPermission('manage_tasks'), addProjectToWorkspace);

// router
// .post('/:workspaceId/projects', checkPermission('manage_tasks'), addProjectToWorkspace)
// .delete(/:workspace/projects , checkPermission('' , ))

// routes/project.js or routes/workspace.js
router.patch('/:workspaceId/projects/:projectId/manager', updateProjectManager);

// Add an objective to a project
router.post('/:workspaceId/projects/:projectId/objectives/add', addObjectiveToProject);

// Remove an objective from a project
router.delete('/:workspaceId/projects/:projectId/objectives/:objectiveId', removeObjectiveFromProject);

// Update an objective in a project
router.patch('/:workspaceId/projects/:projectId/objectives/:objectiveId', updateObjectiveInProject);



export default router;
