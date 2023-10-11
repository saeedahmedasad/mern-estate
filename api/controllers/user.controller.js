import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { Listing } from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
export const test = async (req, res) => {
  res.json("test user route");
};

export const updateUser = async (req, res, next) => {
  if (req.user.userId !== req.params.id)
    return next(errorHandler(401, "You can only update your account"));
  try {
    if (req.body.password) {
      var hashedPassword = await bcrypt.hash(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password: pass, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(errorHandler(500, error));
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.user.userId !== req.params.id)
    return next(errorHandler(401, "You can only delete your account"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      status: 200,
      message: "Account deleted",
    });
  } catch (error) {
    next(errorHandler(500, error));
  }
};
export const getUserListings = async (req, res, next) => {
  if (req.user.userId !== req.params.id)
    return next(errorHandler(401, "You can only view your listings"));
  try {
    const listings = await Listing.find({ userId: req.params.id });
    res.status(200).json(listings);
  } catch (error) {
    next(errorHandler(500, error));
  }
};
