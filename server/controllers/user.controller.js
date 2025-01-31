import {User} from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { uploadMedia, deleteMediaFromCloudinary } from "../utils/cloudinary.js";

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

export const logout = async (_, res) => {
  try {
    return res.status(200).clearCookie("token","",{maxAge:0}).json({
      success: true,
      msg: "Logged out successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Failed to logout."
    });
  }
}

export const getUserProfile = async (req,res) => {
  try {
      const userId = req.id;
      // console.log(userId);
      const user = await User.findById(userId).select("-password");
      if(!user){
          return res.status(404).json({
              message:"Profile not found",
              success:false
          })
      }
      return res.status(200).json({
          success:true,
          user
      })
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          success:false,
          message:"Failed to load user"
      })
  }
}
export const updateUserProfile = async (req,res) => {
  try {
    const userId = req.id;
  const {name}=req.body;
    const profilePhoto = req.file;
     
    
    

    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            message:"User not found",
            success:false
        })
    }

    let photoUrl = user.photoUrl;
    
    
    if (profilePhoto) {
      if (user.photoUrl) {
        const publicId = user.photoUrl.split("/").pop().split(".")[0];//Extract the public id from the photoUrl
        deleteMediaFromCloudinary(publicId);
      }
      const cloudResponse = await uploadMedia(profilePhoto.path);
      
      photoUrl = cloudResponse.secure_url;
      
    }
    
    const updatedData={name,photoUrl };
    // console.log(updatedData);
    const updatedUser=await User.findByIdAndUpdate(userId,updatedData,{new:true}).select("-password");
    return res.status(200).json({
        success:true,
        user:updatedUser,
        message:"User profile updated successfully"
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Failed to update user"
    })
  }
}

