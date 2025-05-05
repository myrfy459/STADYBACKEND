// Contoh middleware autentikasi dasar
const protect = (req, res, next) => {
    try {
      // Logika verifikasi token JWT
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Tidak terotorisasi' });
      }
      // Verifikasi token (contoh sederhana)
      if (token !== 'my-secret-token') {
        return res.status(401).json({ message: 'Token tidak valid' });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = { protect };