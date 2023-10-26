import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import { getPrisma, sendResponse } from "../../utils/functions";
import { z } from "zod";

const Body = z.object({
  order_id: z.string(),
  amount: z.number(),
  payment_id: z.string(),
  reason: z.string(),
  step: z.string(),
  description: z.string(),
  status: z.enum(["success", "failure"]),
});

export async function paymentDetails(req: Request, res: Response) {
  try {
    const body = Body.safeParse(req.body);

    if (!body.success) {
      dbError(res, "Invalid Input", 400);
      return;
    }
    const prisma = getPrisma();
    const { amount, description, order_id, payment_id, reason, step, status } =
      body.data;

    const targetOrder = await prisma.init_order.findFirst({
      where: {
        userId: req.currentUser.id,
        orderId: order_id,
      },
    });
    if (!targetOrder) {
      dbError(res, "Order not found", 404);
      return;
    }

    await prisma.payment_details.create({
      data: {
        amount: amount,
        status,
        description,
        userId: req.currentUser.id,
        step,
        reason,
      },
    });
    sendResponse(res, [], "Details added successfully");
  } catch (error) {
    dbError(res, error);
  }
}
