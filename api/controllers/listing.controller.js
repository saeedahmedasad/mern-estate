import { errorHandler } from "../utils/error.js";
import { Listing } from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    console.log(listing);
    res.status(201).json({
      success: true,
      listing,
    });
  } catch (err) {
    next(errorHandler(404, err));
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found"));
  if (req.user.userId !== listing.userId)
    return next(errorHandler(401, "You can only delete your listings"));
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      listing,
    });
  } catch (err) {
    next(errorHandler(404, err));
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));
    res.status(200).json({
      success: true,
      listing,
    });
  } catch (err) {
    next(errorHandler(404, err));
  }
};
