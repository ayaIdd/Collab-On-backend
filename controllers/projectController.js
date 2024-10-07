
import Project from '../models/project.js';
import Workspace from '../models/workspace.js';

export const addProjectToWorkspace = async (req, res) => {
    const { workspaceId } = req.params;
    const { 
        name, 
        description, 
        manager, 
        members, 
        tasks, 
        status, 
        deadline, 
        objectives 
    } = req.body;

    try {
        // Find the workspace by ID
        const workspace = await Workspace.findById(workspaceId).exec();
        if (!workspace) {
            return res.status(404).send({ error: 'Workspace not found' });
        }

        // Check if the user has permission to add projects
        const isOwnerOrAdmin = workspace.users.some(
            u => u.user.equals(req.user._id) && (u.role === 'owner' || u.role === 'admin')
        );
        if (!isOwnerOrAdmin) {
            return res.status(403).send({ error: 'Permission denied' });
        }

        // Create a new project
        const newProject = new Project({
            name,
            description,
            manager,
            members,
            tasks,
            status: status || 'not started', // default value if not provided
            deadline,
            objectives,
            Workspace: workspaceId // Link the project to the workspace
        });

        // Save the project
        await newProject.save();

        // Optionally, you can add the project ID to the workspace's projects array
        workspace.projects.push(newProject._id);
        await workspace.save();

        res.status(201).send(newProject);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error creating project' });
    }
};

// export const updateProjectManager = async (req, res) => {
//     const { workspaceId, projectId } = req.params;
//     const { newManagerId } = req.body;

//     try {
//         // Find the workspace
//         const workspace = await Workspace.findById(workspaceId).exec();
//         if (!workspace) {
//             return res.status(404).send({ error: 'Workspace not found' });
//         }

//         // Find the project
//         const project = await Project.findById(projectId).exec();
//         if (!project) {
//             return res.status(404).send({ error: 'Project not found' });
//         }

//         // Check if the user has permission
//         const isOwnerOrAdmin = workspace.users.some(
//             u => u.user.equals(req.user._id) && (u.role === 'owner' || u.role === 'admin')
//         );
//         if (!isOwnerOrAdmin) {
//             return res.status(403).send({ error: 'Permission denied' });
//         }

//         // Update the manager
//         project.manager = newManagerId;
//         await project.save();

//         res.status(200).send(project);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: 'Error updating project manager' });
//     }
// };

export const updateProjectManager = async (req, res) => {
    const { workspaceId, projectId } = req.params;
    const { newManagerId } = req.body;

    try {
        // Find the workspace
        const workspace = await Workspace.findById(workspaceId).exec();
        if (!workspace) {
            return res.status(404).json({ error: 'Workspace not found' });
        }

        // Find the project
        const project = await Project.findById(projectId).exec();
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if the new manager is part of the workspace
        if (!workspace.users.some(user => user.user.equals(newManagerId))) {
            return res.status(400).json({ error: 'User is not part of the workspace' });
        }

        // Update the project manager
        project.manager = newManagerId;
        await project.save();

        res.status(200).json({ message: 'Project manager updated successfully', project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating project manager' });
    }
};

export const addObjectiveToProject = async (req, res) => {
    const { workspaceId, projectId } = req.params;
    const { description, isCompleted } = req.body;

    try {
        // Find the workspace
        const workspace = await Workspace.findById(workspaceId).exec();
        if (!workspace) {
            return res.status(404).send({ error: 'Workspace not found' });
        }

        // Find the project
        const project = await Project.findById(projectId).exec();
        if (!project) {
            return res.status(404).send({ error: 'Project not found' });
        }

        // Check if the user has permission
        const isOwnerOrAdmin = workspace.users.some(
            u => u.user.equals(req.user._id) && (u.role === 'owner' || u.role === 'admin')
        );
        if (!isOwnerOrAdmin) {
            return res.status(403).send({ error: 'Permission denied' });
        }

        // Add the new objective
        project.objectives.push({ description, isCompleted });
        await project.save();

        res.status(200).send(project);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error adding objective to project' });
    }
};

export const removeObjectiveFromProject = async (req, res) => {
    const { workspaceId, projectId, objectiveId } = req.params;

    try {
        // Find the workspace
        const workspace = await Workspace.findById(workspaceId).exec();
        if (!workspace) {
            return res.status(404).send({ error: 'Workspace not found' });
        }

        // Find the project
        const project = await Project.findById(projectId).exec();
        if (!project) {
            return res.status(404).send({ error: 'Project not found' });
        }

        // Check if the user has permission
        const isOwnerOrAdmin = workspace.users.some(
            u => u.user.equals(req.user._id) && (u.role === 'owner' || u.role === 'admin')
        );
        if (!isOwnerOrAdmin) {
            return res.status(403).send({ error: 'Permission denied' });
        }

        // Remove the objective
        project.objectives = project.objectives.filter(obj => obj._id.toString() !== objectiveId);
        await project.save();

        res.status(200).send(project);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error removing objective from project' });
    }
};
export const updateObjectiveInProject = async (req, res) => {
    const { workspaceId, projectId, objectiveId } = req.params;
    const { description, isCompleted } = req.body;

    try {
        // Find the workspace
        const workspace = await Workspace.findById(workspaceId).exec();
        if (!workspace) {
            return res.status(404).send({ error: 'Workspace not found' });
        }

        // Find the project
        const project = await Project.findById(projectId).exec();
        if (!project) {
            return res.status(404).send({ error: 'Project not found' });
        }

        // Check if the user has permission
        const isOwnerOrAdmin = workspace.users.some(
            u => u.user.equals(req.user._id) && (u.role === 'owner' || u.role === 'admin')
        );
        if (!isOwnerOrAdmin) {
            return res.status(403).send({ error: 'Permission denied' });
        }

        // Find and update the objective
        const objective = project.objectives.id(objectiveId);
        if (!objective) {
            return res.status(404).send({ error: 'Objective not found' });
        }

        if (description !== undefined) objective.description = description;
        if (isCompleted !== undefined) objective.isCompleted = isCompleted;

        await project.save();

        res.status(200).send(project);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error updating objective in project' });
    }
};
