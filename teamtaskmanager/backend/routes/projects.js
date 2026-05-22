const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProject,
  deleteProject,
  addMember,
  removeMember,
  searchUsers
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes are protected

router.route('/')
  .post(createProject)
  .get(getAllProjects);

router.get('/search-users', searchUsers);

router.route('/:id')
  .get(getProject)
  .delete(deleteProject);

router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
