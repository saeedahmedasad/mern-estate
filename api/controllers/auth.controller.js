import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });

    // Return success message
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(errorHandler(500, error));
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "Invalid email or password"));
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(errorHandler(404, "Invalid email or password"));
    }

    // Create and sign JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Set token in cookie
    res.cookie("token", token, { httpOnly: true });

    const { password: pass, ...rest } = user._doc;
    // Return Logged In User
    res.status(200).json(rest);
  } catch (error) {
    next(errorHandler(500, error));
  }
};

export const google = async (req, res, next) => {
  try {
    const { displayName, email, photoURL } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      return res
        .cookie("token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const newUser = await User.create({
      username:
        displayName.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-8),
      email,
      password: hashedPassword,
      avatar: photoURL,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = newUser._doc;
    res.status(201).cookie("token", token, { httpOnly: true }).json(rest);
  } catch (error) {
    console.log("ERROR");
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res
      .status(200)
      .json({ success: true, status: 200, message: "Logged out successfully" });
  } catch (error) {
    next(errorHandler(500, error));
  }
};
