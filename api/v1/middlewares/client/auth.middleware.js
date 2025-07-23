const jwt = require('jsonwebtoken');

module.exports.requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      code: 400,
      message: "Chưa gửi token!",
    });
  }
  
  const token = authHeader && authHeader.split(' ')[1]; // tách "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // thông tin user được nhúng trong token
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token invalid or expired' });
  }
}