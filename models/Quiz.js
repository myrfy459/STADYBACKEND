const mongoose = require('mongoose');

// Fungsi generate kode acak
const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Angka 100000-999999
};

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
  score: { type: Number, required: true },
  sessionCode: { type: String, required: true },  // Ganti nama field
  questionOrder: { type: Number, required: true },
  topicId: { type: String, required: true }, // Tambah field
});

module.exports = mongoose.model('Quiz', quizSchema);