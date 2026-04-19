const mockUser = {
    id: 'user-1234',
    email: 'test@example.com'
};

// Provides an easily mockable chaining Supabase client
const createSupabaseMock = () => {
    const mockDb = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        upsert: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn()
    };
    return mockDb;
};

// Provides an easily mockable BullMQ queue
const createBullMQMock = () => ({
    getJob: jest.fn(),
    add: jest.fn()
});

module.exports = {
    mockUser,
    createSupabaseMock,
    createBullMQMock
};
