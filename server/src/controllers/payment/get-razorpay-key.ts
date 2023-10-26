import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import { getPrisma, sendResponse } from "../../utils/functions";

export async function getRazorpayKey(req: Request, res: Response) {
  try {
    sendResponse(res, [process.env.RAZORPAY_KEY_ID]);
  } catch (error) {
    dbError(res, error);
  }
}
