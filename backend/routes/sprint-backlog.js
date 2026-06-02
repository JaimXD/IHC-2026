const express = require('express');
const router = express.Router();
const sprintBacklogController = require('../controllers/sprintBacklogController');

router.post('/generate', sprintBacklogController.generateSprintBacklog);

module.exports = router;
