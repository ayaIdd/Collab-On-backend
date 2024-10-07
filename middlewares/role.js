
import Workspace from "../models/workspace.js";

// export const checkPermission = (requiredPermission) => {
//   return async (req, res, next) => {
    
// const roles = {
//     owner: {
//       permissions: [
//         "delete_workspace",
//         "invite_users",
//         "remove_users",
//         "create_projects",
//         "manage_tasks",
//         "delete_projects",
//         "assign_roles"
//       ]
//     },
//     admin: {
//       permissions: [
//         "invite_users",
//         "remove_users",
//         "create_projects",
//         "manage_tasks",
//         "delete_projects"
//       ]
//     },
//     member: {
//       permissions: [
//         "view_workspace",
//         "submit_tasks",
//       ]
//     }
//   };

//     const user = req.user;
//     const workspaceId = req.params.workspaceId;

//     if (!user) {
//       return res.status(401).send('User not authenticated');
//     }

//     const workspace = await Workspace.findById(workspaceId).exec();
//     if (!workspace) {
//       return res.status(404).send('Workspace not found');
//     }

//     const userRole = workspace.users.find(u => u.user.equals(user._id))?.role;

//     if (!userRole || !roles[userRole].permissions.includes(requiredPermission)) {
//       return res.status(403).send('Forbidden');
//     }

//     next();
//   };
// };

export const checkPermission = (requiredPermission) => async (req, res, next) => {
    try {
      const workspace = await Workspace.findById(req.params.workspaceId);
      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found' });
      }
  
      const userRole = workspace.users.find(u => u.user.equals(req.user._id))?.role;
  
      if (!userRole) {
        return res.status(403).json({ message: 'Forbidden aa' });
      }
  
      const rolePermissions = {
        owner: ['view_workspace','invite_members_to_workspace', 'manage_tasks', 'invite_users', 'remove_users', 'delete_workspace'],
        admin: ['view_workspace', 'invite_members_to_workspace', 'manage_tasks', 'invite_users', 'remove_users'],
        member: ['view_workspace']
      };
  
      if (!rolePermissions[userRole].includes(requiredPermission)) {
        return res.status(403).json({ message: 'Forbidden aa' });
      }
  
      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  