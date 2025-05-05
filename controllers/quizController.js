const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const Answer = require('../models/Answer');

// ---- Fungsi Utilitas ----
const generateSessionCode = () => {
  return Math.floor(100000 + Math.random() * 900000); // Menghasilkan kode 6 digit acak
};

// ---- Fungsi Utama ----

// 1. Ambil Kuis berdasarkan Topik
const getQuizzesByTopic = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ topicId: req.params.topicId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Ambil Kuis berdasarkan Kode
const getQuizByCode = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ sessionCode: req.params.code });
    if (!quiz) return res.status(404).json({ message: 'Kuis tidak ditemukan' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Buat Sesi Kuis (Yang Dimodifikasi)
const createQuizSession = async (req, res) => {
  const { questions, topicId } = req.body;

  // Validasi role guru
  if (req.headers['x-role'] !== 'guru') {
    return res.status(403).json({ error: "Hanya guru yang boleh membuat kuis" });
  }

  if (!questions || !Array.isArray(questions)) {
    return res.status(400).json({ message: 'Data soal harus berupa array' });
  }

  try {
    const sessionCode = generateSessionCode();
    await Quiz.insertMany(
      questions.map((q, index) => ({
        ...q,
        topicId,
        sessionCode,
        questionOrder: index + 1
      }))
    );

    res.status(201).json({
      success: true,
      message: 'Kuis berhasil dibuat!',
      sessionCode,
      totalQuestions: questions.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Gagal membuat sesi kuis',
      error: error.message 
    });
  }
};

// 4. Ambil Pertanyaan berdasarkan Urutan
const getQuestionByOrder = async (req, res) => {
  const { sessionCode, order } = req.params;
  try {
    

    const question = await Quiz.findOne({ 
      sessionCode, 
      questionOrder: parseInt(order) 
    }).select('-answer -score -topicId -__v');
    
    if (!question) {
      return res.status(404).json({ message: 'Soal tidak ditemukan' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Submit Jawaban
const submitAnswer = async (req, res) => {
  const { sessionCode, studentId, questionId, selectedOption } = req.body;

  try {
    const question = await Quiz.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Pertanyaan tidak ditemukan' });
    }

    const isCorrect = question.answer === selectedOption;

    await Answer.create({
      sessionCode,
      studentId,
      questionId,
      selectedOption,
      isCorrect,
      score: isCorrect ? question.score : 0
    });

    res.json({ 
      success: true,
      isCorrect,
      correctAnswer: question.answer
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// 6. Ambil Hasil Kuis
const getQuizResult = async (req, res) => {
  const { sessionCode, studentId } = req.params;

  try {
    const result = await Answer.aggregate([
      { 
        $match: { 
          sessionCode,
          studentId 
        } 
      },
      {
        $group: {
          _id: null,
          totalScore: { $sum: "$score" },
          correctAnswers: { $sum: { $cond: ["$isCorrect", 1, 0] } }
        }
      }
    ]);

    const totalQuestions = await Quiz.countDocuments({ sessionCode });

    res.json({
      totalScore: result[0]?.totalScore || 0,
      correctAnswers: result[0]?.correctAnswers || 0,
      totalQuestions,
      percentage: Math.round((result[0]?.correctAnswers / totalQuestions) * 100) || 0
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

module.exports = {
  getQuizzesByTopic,
  getQuizByCode,
  createQuizSession,
  getQuestionByOrder,
  submitAnswer,
  getQuizResult
};