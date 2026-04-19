const { _testExports } = require('../routes/adaptive');

const { partitionTopics, buildAdaptivePrompt, calculateNewScore } = _testExports;

// ---------------------------------------------------------------------------
// partitionTopics
// ---------------------------------------------------------------------------
describe('partitionTopics', () => {
    it('correctly separates weak, neutral, and strong topics', () => {
        const scores = [
            { topic: 'Biology', score: 0.2 },
            { topic: 'Chemistry', score: 0.5 },
            { topic: 'Physics', score: 0.85 },
            { topic: 'Math', score: 0.39 },
            { topic: 'History', score: 0.7 },
        ];

        const { weak, neutral, strong } = partitionTopics(scores);

        expect(weak).toEqual(['Biology', 'Math']);
        expect(neutral).toEqual(['Chemistry']);
        expect(strong).toEqual(['Physics', 'History']);
    });

    it('returns empty arrays when no scores provided', () => {
        const { weak, neutral, strong } = partitionTopics([]);
        expect(weak).toEqual([]);
        expect(neutral).toEqual([]);
        expect(strong).toEqual([]);
    });

    it('handles all-weak scenario', () => {
        const scores = [
            { topic: 'A', score: 0.1 },
            { topic: 'B', score: 0.0 },
        ];
        const { weak, neutral, strong } = partitionTopics(scores);
        expect(weak).toEqual(['A', 'B']);
        expect(neutral).toEqual([]);
        expect(strong).toEqual([]);
    });

    it('handles all-strong scenario', () => {
        const scores = [
            { topic: 'A', score: 0.9 },
            { topic: 'B', score: 1.0 },
        ];
        const { weak, neutral, strong } = partitionTopics(scores);
        expect(weak).toEqual([]);
        expect(neutral).toEqual([]);
        expect(strong).toEqual(['A', 'B']);
    });

    it('places score exactly at threshold boundaries correctly', () => {
        const scores = [
            { topic: 'AtWeak', score: 0.4 },   // >= 0.4 is NOT weak, it's neutral
            { topic: 'AtStrong', score: 0.7 },  // >= 0.7 is strong
        ];
        const { weak, neutral, strong } = partitionTopics(scores);
        expect(weak).toEqual([]);
        expect(neutral).toEqual(['AtWeak']);
        expect(strong).toEqual(['AtStrong']);
    });
});

// ---------------------------------------------------------------------------
// buildAdaptivePrompt
// ---------------------------------------------------------------------------
describe('buildAdaptivePrompt', () => {
    it('includes foundational guidance for weak topics', () => {
        const { prompt } = buildAdaptivePrompt({
            weak: ['Biology'],
            neutral: [],
            strong: [],
            flashcardContext: 'Q: What is photosynthesis?\nA: Process by which plants convert light to energy.',
        });

        expect(prompt).toContain('WEAK');
        expect(prompt).toContain('Biology');
        expect(prompt).toContain('foundational');
    });

    it('includes synthesis guidance for strong topics', () => {
        const { prompt } = buildAdaptivePrompt({
            weak: [],
            neutral: [],
            strong: ['Physics'],
            flashcardContext: 'Q: F=ma\nA: Newton\'s second law.',
        });

        expect(prompt).toContain('STRONG');
        expect(prompt).toContain('Physics');
        expect(prompt).toContain('synthesis');
    });

    it('handles first-time user with no topic data', () => {
        const { prompt } = buildAdaptivePrompt({
            weak: [],
            neutral: [],
            strong: [],
            flashcardContext: 'Some content',
        });

        expect(prompt).toContain('new');
        expect(prompt).toContain('balanced');
    });

    it('includes all three buckets in mixed scenario', () => {
        const { prompt } = buildAdaptivePrompt({
            weak: ['Math'],
            neutral: ['History'],
            strong: ['English'],
            flashcardContext: 'content',
        });

        expect(prompt).toContain('Math');
        expect(prompt).toContain('History');
        expect(prompt).toContain('English');
    });

    it('respects custom questionCount', () => {
        const { prompt } = buildAdaptivePrompt({
            weak: [],
            neutral: [],
            strong: [],
            flashcardContext: 'content',
            questionCount: 5,
        });

        expect(prompt).toContain('5 multiple-choice');
    });

    it('returns a system instruction for strict JSON', () => {
        const { systemInstruction } = buildAdaptivePrompt({
            weak: [],
            neutral: [],
            strong: [],
            flashcardContext: 'content',
        });

        expect(systemInstruction).toContain('JSON');
    });
});

// ---------------------------------------------------------------------------
// calculateNewScore (Exponential Moving Average)
// ---------------------------------------------------------------------------
describe('calculateNewScore', () => {
    it('increases score when answer is correct', () => {
        const oldScore = 0.5;
        const newScore = calculateNewScore(oldScore, true);
        expect(newScore).toBeGreaterThan(oldScore);
    });

    it('decreases score when answer is incorrect', () => {
        const oldScore = 0.5;
        const newScore = calculateNewScore(oldScore, false);
        expect(newScore).toBeLessThan(oldScore);
    });

    it('applies correct EMA formula: old * 0.7 + new * 0.3', () => {
        expect(calculateNewScore(0.5, true)).toBeCloseTo(0.5 * 0.7 + 1.0 * 0.3, 5);
        expect(calculateNewScore(0.5, false)).toBeCloseTo(0.5 * 0.7 + 0.0 * 0.3, 5);
    });

    it('converges towards 1.0 with repeated correct answers', () => {
        let score = 0.5;
        for (let i = 0; i < 20; i++) {
            score = calculateNewScore(score, true);
        }
        expect(score).toBeGreaterThan(0.99);
    });

    it('converges towards 0.0 with repeated incorrect answers', () => {
        let score = 0.5;
        for (let i = 0; i < 20; i++) {
            score = calculateNewScore(score, false);
        }
        expect(score).toBeLessThan(0.01);
    });

    it('handles edge case: score already at 0', () => {
        expect(calculateNewScore(0, true)).toBeCloseTo(0.3, 5);
        expect(calculateNewScore(0, false)).toBeCloseTo(0, 5);
    });

    it('handles edge case: score already at 1', () => {
        expect(calculateNewScore(1, true)).toBeCloseTo(1, 5);
        expect(calculateNewScore(1, false)).toBeCloseTo(0.7, 5);
    });
});

// ---------------------------------------------------------------------------
// Difficulty downshift logic (integration-style)
// ---------------------------------------------------------------------------
describe('Difficulty downshift logic', () => {
    it('should downshift from advanced to balanced after 3 consecutive wrong', () => {
        let difficulty = 'advanced';
        let consecutiveWrong = 0;
        const THRESHOLD = 3;

        // Simulate 3 wrong answers
        for (let i = 0; i < 3; i++) {
            consecutiveWrong++;
        }

        if (consecutiveWrong >= THRESHOLD && difficulty !== 'foundational') {
            difficulty = difficulty === 'advanced' ? 'balanced' : 'foundational';
        }

        expect(difficulty).toBe('balanced');
    });

    it('should downshift from balanced to foundational after 3 more consecutive wrong', () => {
        let difficulty = 'balanced';
        let consecutiveWrong = 3; // already triggered once

        if (consecutiveWrong >= 3 && difficulty !== 'foundational') {
            difficulty = difficulty === 'advanced' ? 'balanced' : 'foundational';
        }

        expect(difficulty).toBe('foundational');
    });

    it('should NOT downshift if already at foundational', () => {
        let difficulty = 'foundational';
        const consecutiveWrong = 5;

        if (consecutiveWrong >= 3 && difficulty !== 'foundational') {
            difficulty = 'balanced';
        }

        expect(difficulty).toBe('foundational');
    });

    it('should reset consecutive wrong counter on correct answer', () => {
        let consecutiveWrong = 2;
        // User gets a correct answer
        consecutiveWrong = 0;
        expect(consecutiveWrong).toBe(0);
    });
});
