import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import {
  getRazorpayInstance,
  getPrisma,
  sendResponse,
  verifyToken,
} from "../../utils/functions";
import { z } from "zod";

const Body = z.object({
  amount: z.number(),
  subscriptionType: z.enum(["premium", "standard"]),
});

export async function createOrder(req: Request, res: Response) {
  try {
    const body = Body.safeParse(req.body);

    if (!body.success) {
      dbError(res, "Invalid Input", 400);
      return;
    }

    const prisma = getPrisma();
    const RazorpayInstance = getRazorpayInstance();
    const order = await RazorpayInstance.orders.create({
      amount: body.data.amount * 100,
      currency: "INR",
      receipt: "receipt_" + new Date().getTime(),
    });
    await prisma.init_order.create({
      data: {
        amount: parseInt(`${order.amount}`),
        orderId: order.id,
        userId: req.currentUser.id,
        subscriptionType: body.data.subscriptionType,
      },
    });
    sendResponse(
      res,
      [
        {
          id: order.id,
        },
      ],
      "Order Created Successfully!"
    );
  } catch (error) {
    dbError(res, error);
  }
}
