
import Project from '../models/project.js';
import Workplace from '../models/workplace.js';


export const createProject = async (req, res) => {
  const { workplaceId } = req.params; // Extract workplaceId from URL params
  const { name, description, manager, members, tasks, status, deadline, objectives } = req.body;

  try {
    // Check if the workplace exists
    const workplace = await Workplace.findById(workplaceId);
    if (!workplace) {
      return res.status(404).json({
        status: false,
        message: 'Workplace not found',
      });
    }

    // Create a new project
    const project = await Project.create({
      name,
      description,
      manager,
      members,
      tasks,
      status,
      deadline,
      objectives,
      workplace: workplaceId, // Link the project to the workplace
    });

    // Update the workplace with the new project
    workplace.projects.push(project._id);
    await workplace.save();

    res.status(201).json({ project });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getProject = async (req, res) => {
  const { workplaceId, projectId } = req.params;
  
  try {
    const project = await Project.findOne({ _id: projectId, workplace: workplaceId });
    if (!project) {
      return res.status(404).json({ status: false, message: 'Project not found' });
    }
    res.status(200).json({ status: true, project });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};


