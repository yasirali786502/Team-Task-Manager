const express = require('express');
const router = express.Router();
const {
  createTask,
  getProjectTasks,
  getMyTasks,
  updateTask,
  deleteTask,
  getDashboard
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes are protected

router.post('/', createTask);
router.get('/my-tasks', getMyTasks);
router.get('/project/:projectId', getProjectTasks);
router.get('/dashboard/:projectId', getDashboard);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
