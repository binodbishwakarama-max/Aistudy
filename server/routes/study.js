const express = require('express');
const router = express.Router();
const supabase = require('../utils/db');
const authMiddleware = require('../middleware/auth');

/**
 * 🔒 Use Auth Middleware for all routes in this file
 */
router.use(authMiddleware);

// --- 1. SAVE STUDY SET (DECK + FLASHCARDS) ---
router.post('/save', async (req, res) => {
    try {
        const { title, originalText, flashcards } = req.body;
        const userId = req.user.id;

        // Create authenticated client using the user's token to pass RLS
        const token = req.headers.authorization?.split(' ')[1];
        const { createClient } = require('@supabase/supabase-js');
        const userSupabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY, // Using the key available (likely anon)
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );

        // 1. Insert Deck (Study Set)
        const { data: deck, error: deckError } = await userSupabase
            .from('decks')
            .insert({
                user_id: userId,
                title: title || 'Untitled Study Set',
                description: originalText ? originalText.substring(0, 100) + '...' : '',
                card_count: flashcards.length
            })
            .select()
            .single();

        if (deckError) throw deckError;

        // 2. Prepare Flashcards
        const cardsToInsert = flashcards.map(card => ({
            deck_id: deck.id,
            front: card.front,
            back: card.back,
            explanation: card.explanation || ''
        }));

        // 3. Batch Insert
        const { error: cardsError } = await userSupabase
            .from('flashcards')
            .insert(cardsToInsert);

        if (cardsError) throw cardsError;

        res.json({ success: true, deckId: deck.id, message: "Saved to Cloud!" });

    } catch (error) {
        console.error('Save Error:', error);



        if (error.code) console.error('PG Error Code:', error.code);
        if (error.details) console.error('Error Details:', error.details);
        res.status(500).json({ error: error.message, details: error.details || "Check server logs" });
    }
});

// --- 2. GET USER HISTORY (DECKS) ---
router.get('/history', async (req, res) => {
    try {
        const { data: decks, error } = await supabase
            .from('decks')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(decks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 3. GET A SPECIFIC DECK (WITH CARDS) ---
router.get('/deck/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch Deck Metadata
        const { data: deck, error: deckError } = await supabase
            .from('decks')
            .select('*')
            .eq('id', id)
            .single();

        if (deckError) throw deckError;

        // Check Ownership (RLS handles this too, but good for custom logic)
        if (deck.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Fetch Cards
        const { data: cards, error: cardsError } = await supabase
            .from('flashcards')
            .select('*')
            .eq('deck_id', id);

        if (cardsError) throw cardsError;

        res.json({ deck, cards });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 4. SUBMIT FLASHCARD REVIEW (SRS ALGORITHM) ---
router.post('/review', async (req, res) => {
    try {
        const { cardId, rating } = req.body; // rating: 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)

        // 1. Fetch current card data
        const { data: card, error: fetchError } = await supabase
            .from('flashcards')
            .select('*')
            .eq('id', cardId)
            .single();

        if (fetchError) throw fetchError;

        // 2. Calculate new SRS values (Simplified SM-2)
        // Defaults if first review
        let interval = card.srs_interval || 0;
        let easeFactor = card.srs_ease_factor || 2.5;
        let repetitions = card.srs_repetitions || 0;

        if (rating === 1) { // Again / Failed
            repetitions = 0;
            interval = 1; // 1 day
        } else {
            // Success (Hard, Good, Easy)
            if (repetitions === 0) {
                interval = 1;
            } else if (repetitions === 1) {
                interval = 6;
            } else {
                interval = Math.round(interval * easeFactor);
            }
            repetitions += 1;
        }

        // Adjust Ease Factor
        // standard formula: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q)*0.02))
        // mapping our 1-4 rating to 2-5 standard scale for math
        const q = rating + 1;
        easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        if (easeFactor < 1.3) easeFactor = 1.3;

        // Calculate Next Review Date
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + interval);

        // 3. Update Card in DB
        const { error: updateError } = await supabase
            .from('flashcards')
            .update({
                srs_interval: interval,
                srs_ease_factor: easeFactor,
                srs_repetitions: repetitions,
                next_review_at: nextReviewDate.toISOString()
            })
            .eq('id', cardId);

        if (updateError) throw updateError;

        res.json({ success: true, nextReview: nextReviewDate, interval });

    } catch (error) {
        console.error("Review Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- 5. GET FULL DECK (LOAD SESSION) ---
router.get('/deck/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch deck details
        const { data: deck, error: deckError } = await supabase
            .from('decks')
            .select('*')
            .eq('id', id)
            .single();

        if (deckError) throw deckError;

        // Fetch associated flashcards
        const { data: flashcards, error: cardsError } = await supabase
            .from('flashcards')
            .select('*')
            .eq('deck_id', id);

        if (cardsError) throw cardsError;

        // TODO: Fetch associated quiz (if we had a quiz table, for now we might store quiz in metadata or separate table)
        // For this MVP, we might re-generate quiz or store it. 
        // Let's assume quiz is stored in a 'quizzes' table or JSON column in decks.
        // For now, returning empty quiz if not found.

        res.json({
            ...deck,
            flashcards,
            quiz: [] // Placeholder until we persist quizzes properly
        });

    } catch (error) {
        console.error("Load Deck Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- 6. DELETE DECK ---
router.delete('/deck/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Delete deck (Cascade should handle cards if configured, otherwise delete cards first)
        const { error } = await supabase
            .from('decks')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true });
    } catch (error) {
        console.error("Delete Deck Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
