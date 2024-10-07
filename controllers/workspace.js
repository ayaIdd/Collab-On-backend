import Workspace from "../models/workspace.js";
import User from "../models/user.js"


export const getWorkspace = async (req, res) => {
  const workspaceId = req.params.workspaceId;

  try {
    const workspace = await Workspace.findById(workspaceId).exec();

    if (!workspace) {
      return res.status(404).send({ error: "Workspace not found" });
    }

    // Check if the user is part of the workspace
    const isMember = workspace.users.some(u => u.user.equals(req.user._id));
    if (!isMember) {
      return res.status(403).send({ error: "Access denied" });
    }

    res.status(200).send(workspace);
  } catch (error) {
    console.error("Error retrieving workspace:", error);
    res.status(500).send({ error: "Error retrieving workspace" });
  }
};



export const updateWorkspace = async (req, res) => {
  const workspaceId = req.params.workspaceId;
  const { name, businessIndustry, size } = req.body;

  try {
    const workspace = await Workspace.findById(workspaceId).exec();

    if (!workspace) {
      return res.status(404).send({ error: "Workspace not found" });
    }

    // Check if the user is the owner
    const ownerRole = workspace.users.find(u => u.user.equals(req.user._id) && u.role === 'owner');
    if (!ownerRole) {
      return res.status(403).send({ error: "Only the owner can update this workspace" });
    }

    // Update the workspace fields
    workspace.name = name || workspace.name;
    workspace.businessIndustry = businessIndustry || workspace.businessIndustry;
    workspace.size = size || workspace.size;

    await workspace.save();
    res.status(200).send(workspace);
  } catch (error) {
    res.status(500).send({ error: "Error updating workspace" });
  }
};

    
// Delete a workspace (only the owner can do this)
export const deleteWorkspace = async (req, res) => {
  const workspaceId = req.params.workspaceId;

  try {
    const workspace = await Workspace.findById(workspaceId).exec();

    if (!workspace) {
      return res.status(404).send({ error: 'Workspace not found' });
    }

    // Check if the user is the owner
    const ownerRole = workspace.users.find(u => u.user.equals(req.user._id) && u.role === 'owner');
    if (!ownerRole) {
      return res.status(403).send({ error: 'Only the owner can delete this workspace' });
    }

    // Delete the workspace
    await Workspace.findByIdAndDelete(workspaceId);

    res.status(200).send({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error('Error deleting workspace:', error);
    res.status(500).send({ error: 'Error deleting workspace' });
  }
};



export const addUserToWorkspace = async (req, res) => {
    const workspaceId = req.params.workspaceId;
    const { userId, role } = req.body; // role can be 'admin' or 'member' 

    console.log('Workspace ID:', workspaceId); // Log the workspace ID

    try {
        const workspace = await Workspace.findById(workspaceId).exec();
        console.log('Workspace:', workspace); // Log the workspace found

        if (!workspace) {
            return res.status(404).send({ error: 'Workspace not found' });
        }

        const user = await User.findById(userId).exec();
        console.log('User:', user); // Log the user found

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Check if the user is already in the workspace
        const userExists = workspace.users.some(u => u.user.equals(userId));
        if (userExists) {
            return res.status(400).send({ error: 'User is already a member of this workspace' });
        }

        // Add the user to the workspace with the specified role
        workspace.users.push({ user: userId, role });

        await workspace.save();

        res.status(200).send({ message: 'User added to workspace successfully', workspace });
    } catch (error) {
        console.error('Error adding user to workspace:', error);
        res.status(500).send({ error: 'Error adding user to workspace' });
    }
};


export const removeUserFromWorkspace = async (req, res) => {
  const { workspaceId, userId } = req.params;

  try {
    // Find the workspace by ID
    const workspace = await Workspace.findById(workspaceId).exec();

    if (!workspace) {
      return res.status(404).send({ error: "Workspace not found" });
    }

    // Check if the user making the request is the owner
    const ownerRole = workspace.users.find(u => u.user.equals(req.user._id) && u.role === 'owner');
    if (!ownerRole) {
      return res.status(403).send({ error: "Only the owner can remove users from this workspace" });
    }

    // Find the user to remove in the workspace's users array
    const userIndex = workspace.users.findIndex(u => u.user.equals(userId));

    if (userIndex === -1) {
      return res.status(404).send({ error: "User not found in this workspace" });
    }

    // Remove the user from the workspace
    workspace.users.splice(userIndex, 1);

    await workspace.save();

    res.status(200).send({ message: "User removed from workspace" });
  } catch (error) {
    res.status(500).send({ error: "Error removing user from workspace" });
  }
};


export const getWorkspaceUsers = async (req, res) => {
  const workspaceId = req.params.workspaceId;

  try {
    const workspace = await Workspace.findById(workspaceId)
      .populate('users.user', 'name email') 
      .exec();

    if (!workspace) {
      return res.status(404).send({ error: "Workspace not found" });
    }

    res.status(200).send({
      workspaceId: workspace._id,
      users: workspace.users
    });
  } catch (error) {
    res.status(500).send({ error: "Error retrieving workspace users" });
  }
};
