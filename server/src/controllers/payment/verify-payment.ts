import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import crypto from "crypto";
import { genToken, getPrisma, sendResponse } from "../../utils/functions";
import { getAccountDetails } from "../account-details/get-account-details";

export async function verifyPayment(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const response = req.body;
    const body =
      response.razorpay_order_id + "|" + response.razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body.toString())
      .digest("hex");

    const targetOrder = await prisma.init_order.findFirst({
      where: {
        userId: req.currentUser.id,
        orderId: response.razorpay_order_id,
      },
    });
    if (!targetOrder) {
      dbError(res, "Order not found", 404);
      return;
    }

    if (expectedSignature !== response.razorpay_signature) {
      await prisma.payment_details.create({
        data: {
          amount: targetOrder.amount,
          status: "failure",
          userId: req.currentUser.id,
          reason: "Payment verification failed",
          step: "Verification",
        },
      });
      dbError(res, "Payment verification failed", 400);
      return;
    }

    const paymentDetails = await prisma.payment_details.create({
      data: {
        amount: targetOrder.amount,
        status: "success",
        userId: req.currentUser.id,
      },
    });

    const payload = JSON.parse(
      JSON.stringify({
        ...req.currentUser,
        subscriptionType: targetOrder.subscriptionType,
        token: "",
      })
    );

    const token = genToken(payload);
    res.cookie("token", token, { httpOnly: false });
    await prisma.user.update({
      where: {
        id: req.currentUser.id,
      },
      data: {
        token: token,
      },
    });
    await prisma.order.create({
      data: {
        price: targetOrder.amount,
        totalRequests:
          targetOrder.subscriptionType == "premium" ? 1000000 : 100000,
        type: targetOrder.subscriptionType,
        userId: req.currentUser.id,
        init_orderId: targetOrder.id,
        payment_detailsId: paymentDetails.id,
      },
    });

    getAccountDetails(req, res);
  } catch (error) {
    dbError(res, error);
  }
}
