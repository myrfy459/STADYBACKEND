const express = require('express');
const router = express.Router();
const { createTopic, getAllTopics } = require('../controllers/topicController');

router.post('/', createTopic);     // Buat topik baru
router.get('/', getAllTopics);     // Ambil semua topik

module.exports = router;
