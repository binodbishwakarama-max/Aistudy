const authMiddleware = require('../middleware/auth');
const { mockUser } = require('./factories');

// 1. Mock dependencies at the module level
jest.mock('../utils/db', () => ({
    auth: {
        getUser: jest.fn()
    }
}));

const supabase = require('../utils/db');

describe('Auth Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            header: jest.fn()
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    test('returns 401 if Authorization header is missing', async () => {
        mockReq.header.mockReturnValue(undefined);

        await authMiddleware(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access denied. No token provided.' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('returns 401 if JWT token validation fails', async () => {
        mockReq.header.mockReturnValue('Bearer invalid_token_123');
        
        supabase.auth.getUser.mockResolvedValue({
            data: { user: null },
            error: new Error('Invalid token')
        });

        await authMiddleware(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid token' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('calls next() and sets req.user if token is valid', async () => {
        mockReq.header.mockReturnValue('Bearer valid_token_123');
        
        supabase.auth.getUser.mockResolvedValue({
            data: { user: mockUser },
            error: null
        });

        await authMiddleware(mockReq, mockRes, mockNext);
        expect(mockReq.user).toEqual(mockUser);
        expect(mockNext).toHaveBeenCalled();
    });
});
