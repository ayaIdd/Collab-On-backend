import mongoose from 'mongoose';
import User from '../models/user.js';
import Workplace from '../models/workplace.js';
import bcrypt from 'bcryptjs';
import { createJWT  } from '../utils/index.js';
import Project from '../models/project.js';
import { sendInvitationEmail } from '../services/emailInvite.js';



export const registerUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, accountname, email, password, workplaceName, businessIndustry, businessSize } = req.body;

    const userExist = await User.findOne({ email }).session(session);

    if (userExist) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: false,
        message: 'User already exists',
      });
    }

    const user = await User.create([{ name, accountname, email, password }], { session });

    const workplace = await Workplace.create([{
      name: workplaceName,
      businessIndustry,
      size: businessSize,
      creator: user[0]._id,
      admins: [user[0]._id],
      users: [user[0]._id],
    }], { session });

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

// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res
//         .status(401)
//         .json({ status: false, message: "Invalid email or password." });
//     }

//     if (!user?.isActive) {
//       return res.status(401).json({
//         status: false,
//         message: "User account has been deactivated, contact the administrator",
//       });
//     }

//     const isMatch = await user.matchPassword(password);

//     if (user && isMatch) {
//       createJWT(res, user._id);

//       user.password = undefined;

//       res.status(200).json(user);
//     } else {
//       return res
//         .status(401)
//         .json({ status: false, message: "Invalid email or password" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ status: false, message: error.message });
//   }
// };


// Function to handle user registration and project addition



// Function to handle sending an invitation email
export const sendInvite = async (req, res) => {
  const { email, projectId } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const inviteLink = `http://localhost:3000/register?email=${email}&projectId=${projectId}`;

    await sendInvitationEmail(email, inviteLink);

    res.status(200).json({ msg: 'Invitation sent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
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






// Function to handle user registration and project addition
// export const registerUserByInvite = async (req, res) => {
//     const { email, password, projectId } = req.body;

//     try {
//         let user = await User.findOne({ email });

//         if (user) {
//             // User already exists, add to the project
//             const project = await Project.findById(projectId);
//             if (project) {
//                 if (!project.members.includes(user.id)) {
//                     project.members.push(user.id);
//                     await project.save();
//                 }
//             } else {
//                 return res.status(404).json({ msg: 'Project not found' });
//             }
//         } else {
//             // User does not exist, create a new user and add to the project
//             user = new User({
//                 email,
//                 password,
//                 role: 'member', // Default role for invited members
//             });

//             // Encrypt password
//             const salt = await bcrypt.genSalt(10);
//             user.password = await bcrypt.hash(password, salt);

//             await user.save();

//             // Add user to project
//             const project = await Project.findById(projectId);
//             if (project) {
//                 project.members.push(user.id);
//                 await project.save();
//             } else {
//                 return res.status(404).json({ msg: 'Project not found' });
//             }
//         }

//         // Create and return JSON Web Token
//         const payload = {
//             user: {
//                 id: user.id,
//                 role: user.role,
//             },
//         };

//         jwt.sign(
//             payload,
//             'your_jwt_secret',
//             { expiresIn: 360000 },
//             (err, token) => {
//                 if (err) throw err;
//                 res.json({ token });
//             }
//         );
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };
export const registerUserByInvite = async (email, password, projectId) => {
  try {
      let user = await User.findOne({ email });

      if (user) {
          // User already exists, add to the project
          const project = await Project.findById(projectId);
          if (project) {
              if (!project.members.includes(user.id)) {
                  project.members.push(user.id);
                  await project.save();
              }
          } else {
              return { status: 404, msg: 'Project not found' };
          }
      } else {
          // User does not exist, create a new user and add to the project
          user = new User({
              email,
              password,
              role: 'member', // Default role for invited members
          });

          // Encrypt password
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);

          await user.save();

          // Add user to project
          const project = await Project.findById(projectId);
          if (project) {
              project.members.push(user.id);
              await project.save();
          } else {
              return { status: 404, msg: 'Project not found' };
          }
      }
      const payload = {
          user: {
              id: user.id,
              role: user.role,
          },
      };

      const token = await new Promise((resolve, reject) => {
          jwt.sign(
              payload,
              'your_jwt_secret',
              { expiresIn: 360000 },
              (err, token) => {
                  if (err) reject(err);
                  resolve(token);
              }
          );
      });

      return { status: 200, token };
  } catch (err) {
      console.error(err.message);
      return { status: 500, msg: 'Server error' };
  }
};
