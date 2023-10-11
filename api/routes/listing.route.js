import express from "express";
import {
  createListing,
  deleteListing,
  getListing,
  getAllListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const app = express.Router();

app.post("/create", verifyToken, createListing);
app.post("/delete/:id", verifyToken, deleteListing);
app.post("/get/:id", getListing);
app.get("/get", getAllListing);

export default app;
