const express = require('express');
const router = express.Router();
const { submitAnswer } = require('../controllers/quizController');
const { 
    getQuestionByOrder,
    createQuizSession,
    getQuizzesByTopic,
    getQuizByCode,
    getQuizResult 
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

// Rute untuk mendapatkan kuis berdasarkan topik
router.get('/:topicId', getQuizzesByTopic);

// Rute untuk mendapatkan kuis berdasarkan kode sesi
router.get('/code/:code', getQuizByCode);

router.get('/question/:sessionCode/:order', getQuestionByOrder);

// Rute untuk membuat sesi kuis baru (dilindungi auth)
router.post('/', protect, createQuizSession);

router.post('/submit', submitAnswer);

router.get('/result/:sessionCode/:studentId', getQuizResult);

module.exports = router;