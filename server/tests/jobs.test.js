const request = require('supertest');
const express = require('express');

// 1. Module Level Mocks
jest.mock('../queue/jobs', () => ({
    generationQueue: require('./factories').createBullMQMock()
}));

jest.mock('../middleware/auth', () => (req, res, next) => {
    req.user = require('./factories').mockUser; 
    next();
});

const jobsRoute = require('../routes/jobs');
const { generationQueue } = require('../queue/jobs');

// Setup Express App
const app = express();
app.use(express.json());
app.use('/api/jobs', jobsRoute);

describe('GET /api/jobs/:id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('returns 404 if job does not exist in BullMQ', async () => {
        generationQueue.getJob.mockResolvedValue(null);

        const res = await request(app).get('/api/jobs/missing-123');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Job not found');
    });

    test('returns job progress for active jobs', async () => {
        const mockJob = {
            id: 'job-123',
            getState: jest.fn().mockResolvedValue('active'),
            progress: 50,
            returnvalue: null,
            failedReason: null
        };
        generationQueue.getJob.mockResolvedValue(mockJob);

        const res = await request(app).get('/api/jobs/job-123');
        expect(res.statusCode).toBe(200);
        expect(res.body.state).toBe('active');
        expect(res.body.progress).toBe(50);
        expect(res.body.result).toBe(null);
    });

    test('returns result payload for completed jobs', async () => {
        const mockJob = {
            id: 'job-123',
            getState: jest.fn().mockResolvedValue('completed'),
            progress: 100,
            returnvalue: { content: [{ text: 'done' }] },
            failedReason: null
        };
        generationQueue.getJob.mockResolvedValue(mockJob);

        const res = await request(app).get('/api/jobs/job-123');
        expect(res.statusCode).toBe(200);
        expect(res.body.state).toBe('completed');
        expect(res.body.result.content[0].text).toBe('done');
    });
});
