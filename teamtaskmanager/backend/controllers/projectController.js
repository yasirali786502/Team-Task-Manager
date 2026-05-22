const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

// Create project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a project name'
      });
    }

    const project = await Project.create({
      name,
      description,
      adminId: req.user._id,
      members: [req.user._id]
    });

    const populatedProject = await Project.findById(project._id)
      .populate('adminId', 'name email')
      .populate('members', 'name email');

    res.status(201).json({
      success: true,
      data: populatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all projects for logged-in user
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user._id
    })
      .populate('adminId', 'name email')
      .populate('members', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('adminId', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is a member
    if (!project.members.some(member => member._id.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add member to project (admin only)
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user ID'
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project admin can add members'
      });
    }

    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (project.members.some(m => m.toString() === userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member'
      });
    }

    project.members.push(userId);
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('adminId', 'name email')
      .populate('members', 'name email');

    res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove member from project (admin only)
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.params;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project admin can remove members'
      });
    }

    if (userId === project.adminId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove project admin'
      });
    }

    project.members = project.members.filter(
      member => member.toString() !== userId
    );

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('adminId', 'name email')
      .populate('members', 'name email');

    res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search users by email
exports.searchUsers = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email to search'
      });
    }

    const users = await User.find({
      email: { $regex: email, $options: 'i' }
    }).select('name email').limit(10);

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete project (admin only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only project admin can delete it
    if (project.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project admin can delete this workspace'
      });
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ projectId: project._id });

    // Delete the project itself
    await Project.findByIdAndDelete(project._id);

    res.status(200).json({
      success: true,
      message: 'Workspace and all associated tasks successfully deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
