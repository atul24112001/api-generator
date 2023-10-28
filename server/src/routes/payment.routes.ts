import { Router } from "express";
import { checkAuth } from "../middlewares/check-auth";
import cors from "cors";
import {
  createOrder,
  getRazorpayKey,
  verifyPayment,
  paymentDetails,
} from "../controllers/payment";
import { corsOptions } from "../utils/functions";

const paymentRoutes = Router();

paymentRoutes.post("/create", cors(corsOptions), checkAuth, createOrder);
paymentRoutes.post("/verify", cors(corsOptions), checkAuth, verifyPayment);
paymentRoutes.get("/key", cors(corsOptions), checkAuth, getRazorpayKey);
paymentRoutes.post(
  "/payment-details",
  cors(corsOptions),
  checkAuth,
  paymentDetails
);

export default paymentRoutes;
