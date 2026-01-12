const mongoose = require('mongoose');

const studySetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Untitled Study Set' },
    originalText: { type: String },
    flashcards: [{
        question: String,
        answer: String
    }],
    quiz: [{
        question: String,
        options: [String],
        correctIndex: Number,
        explanation: String
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudySet', studySetSchema);
