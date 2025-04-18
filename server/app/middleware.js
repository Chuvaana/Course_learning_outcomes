const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'Токен байхгүй байна' }); // Token missing
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
    // Attach the decoded teacher information (including teacherId) to the request object
    req.teacherId = decoded.id; // The teacher's ID is stored in the decoded token

    next(); // Continue with the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Токен зөвшөөрөгдөхгүй байна' }); // Invalid or expired token
  }
};

module.exports = authMiddleware;
