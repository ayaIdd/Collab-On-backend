import mongoose from 'mongoose';
import User from '../models/user.js';
import Workplace from '../models/workplace.js';
import { createJWT } from '../utils/index.js';

export const registerUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, accountname, email, password, workplaceName, businessIndustry, businessSize } = req.body;

    // Check if the user already exists
    const userExist = await User.findOne({ email }).session(session);

    if (userExist) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: false,
        message: 'User already exists',
      });
    }

    // Create a new user
    const user = await User.create([{ name, accountname, email, password }], { session });

    // Create a new workplace linked to the user
    const workplace = await Workplace.create([{
      name: workplaceName,
      businessIndustry,
      size: businessSize,
      creator: user[0]._id,
      admins: [user[0]._id],
      users: [user[0]._id],
    }], { session });

    // Generate JWT token for the user
    createJWT(res, user[0]._id);
    user[0].password = undefined;

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ user: user[0], workplace: workplace[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password." });
    }

    if (!user?.isActive) {
      return res.status(401).json({
        status: false,
        message: "User account has been deactivated, contact the administrator",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (user && isMatch) {
      createJWT(res, user._id);

      user.password = undefined;

      res.status(200).json(user);
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
