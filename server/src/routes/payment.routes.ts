import { Router } from "express";
import { checkAuth } from "../middlewares/check-auth";
import {
  createOrder,
  getRazorpayKey,
  verifyPayment,
  paymentDetails,
} from "../controllers/payment";
import { corsHandler } from "../middlewares";

const paymentRoutes = Router();

paymentRoutes.post("/create", corsHandler, checkAuth, createOrder);
paymentRoutes.post("/verify", corsHandler, checkAuth, verifyPayment);
paymentRoutes.get("/key", corsHandler, checkAuth, getRazorpayKey);
paymentRoutes.post("/payment-details", corsHandler, checkAuth, paymentDetails);

export default paymentRoutes;
