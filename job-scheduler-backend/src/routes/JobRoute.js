const express = require('express');
const router = express.Router();
const JobController = require('../controller/JobController');

// Route to create a new job
router.post('/create-job', JobController.createJob);

// Route to get all jobs
router.get('/get-jobs', JobController.getJobs);
// Route to process a job
router.post('/run-job/:jobId', JobController.runJob);
// Route to delete a job
router.delete('/delete-job', JobController.deleteJob);
// Route to get logs
router.get('/get-logs', JobController.getLogs);

module.exports = router;