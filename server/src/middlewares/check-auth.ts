import { NextFunction, Request, Response } from "express";
import dbError from "../utils/db-error";
import { getPrisma, verifyToken } from "../utils/functions";
import { User } from "../types";

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cookie = req.cookies;
    const authorization = req.header("authorization");
    const token = cookie["token"] || authorization?.split(" ")[1];
    const prisma = getPrisma();

    console.log(req.get("origin"));
    if (!token) {
      dbError(res, "Access Denied.", 400);
      return;
    }

    const payload = verifyToken(token) as User;
    if (!payload) {
      dbError(res, "Access Denied.", 400);
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        id: payload.id,
      },
    });

    if (payload.secretKey && !req.baseUrl.includes("/api/data")) {
      dbError(res, "Access denied", 401);
      return;
    }

    if (!user) {
      dbError(res, "User not found!", 404);
      return;
    }

    const originalToken = payload.secretKey ? user.secretKey : user.token;

    if (originalToken !== token || !user.isLogin) {
      dbError(res, "Unauthorized token!", 401);
      return;
    }

    req.currentUser = {
      email: user.email,
      id: user.id,
      freeRequests: user.freeRequests,
      token: null,
      subscriptionType: "free",
    };
    next();
    return;
  } catch (error) {
    dbError(res, error);
  }
}
