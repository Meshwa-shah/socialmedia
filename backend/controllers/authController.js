import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";


// REGISTER
export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      password,
    } = req.body;

    // validation
    if (
      !fullName ||
      !username ||
      !email ||
      !password
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    // existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );



    // create user
    const user = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    // generate token
    if (user) {
      const find = await User.findOne({ email: email });
      const token = generateToken(find._id);


      // cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge:
          7 * 24 * 60 * 60 * 1000
      });

      return res.status(201).json({
        success: true,
        message: "User registered",
        user: find,
      });
    }

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};




// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    user.lastSeen = new Date();

    await user.save();

    // token
    const token = generateToken(user._id);

    // cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge:
        7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};




// LOGOUT
export const logoutUser = async (req, res) => {
  try {

    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const uploadProfilePic = async (
  req,
  res
) => {
  try {

    const userId = req.user;
    const { bio } = req.body;

    if (!req.file) {
      return res.json({
        success: false,
        message: "No image uploaded",
      });
    }

    // upload to cloudinary
    const result =
      await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "uploads/",
        }
      );

    // update user
    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        {
          profilePic: result.secure_url,
          public_id: result.public_id,
          bio: bio
        },
        { new: true }
      );

    return res.status(200).json({
      success: true,
      message:
        "Profile picture updated",
      user: updatedUser,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

export const saveFcmToken =
  async (req, res) => {

    const { token } =
      req.body;

    await User.findByIdAndUpdate(
      req.user,
      {
        fcmToken: token
      }
    );

    res.json({
      success: true
    });

  };