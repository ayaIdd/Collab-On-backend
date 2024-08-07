import jwt from "jsonwebtoken";
import User from "../models/user.js";

const refreshTokenMiddleware = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Retrieve user by ID from the token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate new tokens
      const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "10m", // Access token expiration
      });

      const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_REFRESH, {
        expiresIn: "15d", // Refresh token expiration
      });

      // Send new tokens in cookies
      res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 10 * 60 * 1000, // Access token cookie expires in 10 minutes
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000, // Refresh token cookie expires in 15 days
      });

      // Proceed with the original request
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default refreshTokenMiddleware;
