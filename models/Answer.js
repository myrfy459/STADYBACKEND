const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  // Yang benar-benar essential saja
  sessionCode: { type: String, required: true },  // Wajib untuk grouping
  studentId: { type: String, required: true },    // Wajib identifikasi siswa
  questionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quiz', 
    required: true 
  },
  selectedOption: { type: String, required: true }, // Jawaban dipilih (A/B/C/D)
  isCorrect: { type: Boolean, required: true },     // Status benar/salah
  score: { type: Number, required: true }           // Nilai yang didapat
});

// Index untuk percepat query
answerSchema.index({ sessionCode: 1, studentId: 1 });

module.exports = mongoose.model('Answer', answerSchema);