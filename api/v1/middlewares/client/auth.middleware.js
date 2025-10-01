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

module.exports.requireAuthOptional = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("auth " + authHeader);

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // có user thì gán vào req.user
    } catch (err) {
      // token không hợp lệ => coi như guest
      req.user = null;
    }
  } else {
    req.user = null; // không có token => guest
  }
  next();
};