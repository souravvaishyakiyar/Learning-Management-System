import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({
      success: false,
      msg: "Please fill in all fields.",
    });
  // Check if the user already exists
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      msg: "User already exists.",
    });
  }
  // Create a new user
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      msg: "Account created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        msg: "Please fill in all fields.",
      });
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User does not exist.",
      });
    }
    // Check if the password is correct
    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials.",
      });
    }
    generateToken(res,user, `Welcom back ${user.name}`);
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Failed to login.",
    });
  }
};
