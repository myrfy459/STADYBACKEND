const Topic = require('../models/Topic');

const createTopic = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: 'Nama topik wajib diisi' });

  try {
    const newTopic = new Topic({ name });
    await newTopic.save();
    res.status(201).json({ message: 'Topik berhasil dibuat', topic: newTopic });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat topik', error });
  }
};

const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data topik', error });
  }
};

module.exports = { createTopic, getAllTopics };
