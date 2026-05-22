const Task = require('../models/Task');
const Project = require('../models/Project');

// Create task (admin only)
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    if (!title || !projectId || !assignedTo || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, projectId, assignedTo, and dueDate'
      });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is admin
    if (project.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project admin can create tasks'
      });
    }

    // Check if assignee is a member
    if (!project.members.includes(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: 'User is not a member of this project'
      });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      createdBy: req.user._id,
      priority: priority || 'Medium',
      dueDate
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all tasks for a project
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if user is member of project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!project.members.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view tasks'
      });
    }

    const tasks = await Task.find({ projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's assigned tasks
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const project = await Project.findById(task.projectId);
    const isAdmin = project.adminId.toString() === req.user._id.toString();
    const isAssignee = task.assignedTo.toString() === req.user._id.toString();

    // Members can only update their own tasks' status
    if (!isAdmin && !isAssignee) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    // Members can only update status
    if (!isAdmin) {
      if (req.body.status) {
        task.status = req.body.status;
      }
    } else {
      // Admin can update everything
      const { title, description, assignedTo, priority, dueDate, status } = req.body;
      if (title) task.title = title;
      if (description) task.description = description;
      if (assignedTo) task.assignedTo = assignedTo;
      if (priority) task.priority = priority;
      if (dueDate) task.dueDate = dueDate;
      if (status) task.status = status;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete task (admin only)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const project = await Project.findById(task.projectId);

    // Check if user is admin
    if (project.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project admin can delete tasks'
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get dashboard stats
exports.getDashboard = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if user is member of project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!project.members.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view dashboard'
      });
    }

    const tasks = await Task.find({ projectId })
      .populate('assignedTo', 'name email');

    // Calculate stats
    const totalTasks = tasks.length;
    const todoTasks = tasks.filter(t => t.status === 'To Do').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const doneTasks = tasks.filter(t => t.status === 'Done').length;

    const overdueTasks = tasks.filter(t => 
      new Date(t.dueDate) < new Date() && t.status !== 'Done'
    ).length;

    // Tasks per user
    const tasksPerUser = {};
    tasks.forEach(task => {
      const userId = task.assignedTo._id.toString();
      const userName = task.assignedTo.name;
      if (!tasksPerUser[userId]) {
        tasksPerUser[userId] = {
          name: userName,
          total: 0,
          todo: 0,
          inProgress: 0,
          done: 0
        };
      }
      tasksPerUser[userId].total++;
      if (task.status === 'To Do') tasksPerUser[userId].todo++;
      if (task.status === 'In Progress') tasksPerUser[userId].inProgress++;
      if (task.status === 'Done') tasksPerUser[userId].done++;
    });

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        todoTasks,
        inProgressTasks,
        doneTasks,
        overdueTasks,
        tasksPerUser: Object.values(tasksPerUser)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
