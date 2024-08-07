import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Middleware to protect routes
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decodedToken.userId).select("isAdmin email");

      if (user) {
        req.user = {
          email: user.email,
          isAdmin: user.isAdmin,
          userId: decodedToken.userId,
        };
        next();
      } else {
        return res.status(401).json({ status: false, message: "User not found" });
      }
    } else {
      return res.status(401).json({ status: false, message: "Not authorized. Try logging in again." });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ status: false, message: "Invalid token. Try logging in again." });
  }
};

export default protectRoute;


// function authMiddleware(req, res, next) {
//     const token = req.header('x-auth-token');

//     if (!token) {
//         return res.status(401).json({ msg: 'No token, authorization denied' });
//     }

//     // Verify token
//     try {
//         const decoded = jwt.verify(token, 'your_jwt_secret');
//         req.user = decoded.user;
//         next();
//     } catch (err) {
//         res.status(401).json({ msg: 'Token is not valid' });
//     }
// }

export { protectRoute  };