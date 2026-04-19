const request = require('supertest');
const express = require('express');

// 1. Module Level Mocks
jest.mock('../utils/db', () => require('./factories').createSupabaseMock());
jest.mock('../middleware/auth', () => (req, res, next) => {
    req.user = require('./factories').mockUser; // auto-authenticate
    next();
});

const statsRoute = require('../routes/stats');
const supabase = require('../utils/db');

// Setup Express App for testing
const app = express();
app.use(express.json());
app.use('/api/stats', statsRoute);

describe('GET /api/stats', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('returns defaults when user row does not exist (PGRST116)', async () => {
        // Simulate Supabase returning "Row not found"
        supabase.single.mockResolvedValue({
            data: null,
            error: { code: 'PGRST116', message: 'No row found' }
        });

        const res = await request(app).get('/api/stats');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            xp: 0,
            level: 1,
            streak: 0,
            lastStudyDate: null,
            achievements: []
        });
        
        // Assert we queried correctly
        expect(supabase.from).toHaveBeenCalledWith('user_stats');
        expect(supabase.eq).toHaveBeenCalledWith('user_id', 'user-1234');
    });

    test('returns populated gamification stats if row exists', async () => {
        // Simulate existing DB data
        supabase.single.mockResolvedValue({
            data: {
                xp: 250,
                level: 3,
                streak: 5,
                last_active: '2023-11-01',
                achievements: ['First Quiz']
            },
            error: null
        });

        const res = await request(app).get('/api/stats');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            xp: 250,
            level: 3,
            streak: 5,
            lastStudyDate: '2023-11-01',
            achievements: ['First Quiz']
        });
    });
});

describe('PATCH /api/stats', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('upserts exactly the user payload and returns success', async () => {
        supabase.single.mockResolvedValue({
            data: {
                xp: 15,
                level: 1,
                streak: 1,
                last_active: '2023-11-02',
                achievements: null
            },
            error: null
        });

        const res = await request(app)
            .patch('/api/stats')
            .send({ xp: 15, level: 1, streak: 1, lastStudyDate: '2023-11-02' });
            
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.stats.xp).toBe(15);
        expect(supabase.from).toHaveBeenCalledWith('user_stats');
        expect(supabase.upsert).toHaveBeenCalledWith(
            expect.objectContaining({ user_id: 'user-1234', xp: 15 }),
            { onConflict: 'user_id' }
        );
    });
});
