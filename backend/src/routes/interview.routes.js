const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interview.controller');

// Khai báo endpoint: POST /api/interviews/send-invites
router.post('/send-invites', interviewController.sendInterviewInvites);

module.exports = router;