import { Router } from "express";
import { checkAuth } from "../middlewares/check-auth";
import {
  createOrder,
  getRazorpayKey,
  verifyPayment,
  paymentDetails,
} from "../controllers/payment";

const paymentRoutes = Router();

paymentRoutes.post("/create", checkAuth, createOrder);
paymentRoutes.post("/verify", checkAuth, verifyPayment);
paymentRoutes.get("/key", checkAuth, getRazorpayKey);
paymentRoutes.post("/payment-details", checkAuth, paymentDetails);

export default paymentRoutes;
