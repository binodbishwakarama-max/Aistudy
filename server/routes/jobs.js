const express = require('express');
const authMiddleware = require('../middleware/auth');
const { generationQueue } = require('../queue/jobs');
const { logger } = require('../utils/logger');

const router = express.Router();

router.use(authMiddleware);

router.get('/:id', async (req, res) => {
    try {
        const jobId = req.params.id;
        
        if (!generationQueue) {
            return res.status(503).json({ error: 'Job queue is not initialized' });
        }

        const job = await generationQueue.getJob(jobId);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const state = await job.getState();
        const progress = job.progress;
        
        // If the job failed, grab the reason
        const failedReason = job.failedReason;
        const returnData = job.returnvalue;

        res.json({
            id: job.id,
            state, // 'waiting', 'active', 'completed', 'failed', 'delayed'
            progress,
            result: returnData || null,
            error: failedReason || null
        });

    } catch (error) {
        logger.error('Error fetching job status', { reason: error.message });
        res.status(500).json({ error: 'Failed to retrieve job status' });
    }
});

module.exports = router;
