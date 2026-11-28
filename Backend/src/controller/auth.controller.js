import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHanlder.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    throw new Error("All field are required to procced");
  }

  const isEmailAlreadyExtis = await User.findOne({ email });

  if (isEmailAlreadyExtis) {
    throw new Error("This Email are Already Exits");
  }

  const newUser = await User.create({
    userName,
    email,
    password,
  });
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT),
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailtrapOptions = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: email,
      subject: `${userName} Registered Successfully`,
      text: `Hello ${userName},Welcome to our website! Your account has been registered successfully. Thank you for joining us.Best Regards,Our Team`,
    };

    await transporter.sendMail(mailtrapOptions);

    return res
      .status(201)
      .json({ message: "User Registered Successfully", newUser });
  } catch (error) {
    throw new Error("Internal Server Error", error);
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("All field are required to procced");
    }

    const userInfo = await User.findOne({ email });

    if (!userInfo) {
      throw new Error("User Not Found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, userInfo.password);
    console.log(isPasswordCorrect);

    if (!isPasswordCorrect) {
      throw new Error("Password is InCorrect");
    }

    const refreshToken = jwt.sign(
      { id: userInfo._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_SECRET_IN },
    );

    userInfo.refreshToken = refreshToken;
    await userInfo.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "User Logged In Successfully", userInfo });
  } catch (error) {
    throw new Error("Internal Server Error", error);
  }
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user_id,
      { $set: { refreshToken: undefined } },
      { runValidators: "after" },
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("refreshToken", options)
      .json({ message: "User Logged Out Successfully" });
  } catch (error) {
    throw new Error("Internal Server Error", error);
  }
});

// All User
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const allUser = await User.find().select("-password -refreshToken");

    return res
      .status(200)
      .json({ message: "All User for Super Admin", allUser });
  } catch (error) {
    throw new Error("Internal Server Error", error);
  }
});

// Get User By Id
const getUserById = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new Error("User Id Not Found");
    }

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      throw new Error("User Not Found");
    }

    return res.status(200).json({ message: "User Fetch Successfully", user });
  } catch (error) {
    throw new Error("Internal Server Error", error);
  }
});

// Get Profile
const getProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      throw new Error("User Id Not Found");
    }

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      throw new Error("Error Whitle creating User");
    }

    return res
      .status(200)
      .json({ message: "Get Profile Fetch Successfully", user });
  } catch (error) {
    throw new Error("Internal Server Error", error);
  }
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new Error("User Id Not Found");
    }

    const updatedUser = await User.findByIdAndUpdate(userId);

    if (!updatedUser) {
      throw new Error("Internal Server Error");
    }

    Object.assign(updatedUser, req.body);
    await updatedUser.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json({ message: "User Updated Successfully", updatedUser });
  } catch (error) {
    throw new Error("Internal Server Error", error);
  }
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new Error("User Id Not Found");
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new Error("Internal Server Error");
    }

    return res
      .status(200)
      .json({ message: "User Deleted Successfully", deletedUser });
  } catch (error) {
    throw new Error("Internal Server Error", error);
  }
});

// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new Error("Email is Required");
  }

  const requestedUser = await User.findOne({ email });

  if (!requestedUser) {
    throw new Error("Requested Email Not found");
  }

  const { unHashToken, hashToken, tokenExpiry } =
    requestedUser.genarateTemporaryToken();

  requestedUser.forgotPassword = hashToken;
  requestedUser.forgotPasswordTokenExpiry = tokenExpiry;
  await requestedUser.save({ validateBeforeSave: false });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT),
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailtrapOptions = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: requestedUser.email,
      subject: "Reset Password Request",
      text: `Please use the following link to reset your password : ${process.env.BASE_URL}/api/v1/user/reset-password/${unHashToken}. \n\n This link will expire in 20 minutes. \n\n If you didn't requested to reset your password then please ignore this message`,
    };

    await transporter.sendMail(mailtrapOptions);

    return res
      .status(200)
      .json({ message: `Email send Successfully, ${requestedUser.email}` });
  } catch (error) {
    throw new Error("Internal Server Error", error);
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getAllUser,
  getUserById,
  getProfile,
  updateUser,
  deleteUser,
  forgotPassword,
};
