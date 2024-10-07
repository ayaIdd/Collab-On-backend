import jwt from 'jsonwebtoken';
import User from '../models/user.js';





export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  if (token == null) return res.sendStatus(401); // No token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification error:', err); // Debugging line
      return res.sendStatus(403); // Forbidden if token is invalid
    }
    req.user = { _id: user.userId }; // Set userId from token
    console.log('User from token:', req.user); // Debugging line
    next();
  });
};
