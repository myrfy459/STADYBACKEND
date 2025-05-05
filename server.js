const express = require('express');
const cors = require('cors');
const quizRoutes = require('./routes/quizRoutes');  // Import routes
const topicRoutes = require('./routes/topicRoutes');

const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://razyafahmi123:razya123@cluster0.8qywmgp.mongodb.net/stady?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(() => console.log('✅ Orang Hitam Berhasil Terhubung ke MongoDB Atlas'))
.catch(err => console.error('❌ Gagal konek ke MongoDB Atlas', err));


// Middleware
app.use(cors());
app.use(express.json());

// Rute dasar
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.use('/api/quiz', quizRoutes);

// Jalankan server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
