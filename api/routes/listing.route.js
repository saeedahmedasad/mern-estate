import express from "express";
import {
  createListing,
  deleteListing,
  getListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const app = express.Router();

app.post("/create", verifyToken, createListing);
app.post("/delete/:id", verifyToken, deleteListing);
app.post("/get/:id", getListing);

export default app;
