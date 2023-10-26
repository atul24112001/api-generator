import { NextFunction, Request, Response } from "express";
import dbError from "../utils/db-error";
import { getPrisma } from "../utils/functions";

export const verifySubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const prisma = getPrisma();
    const user = req.currentUser;

    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const [order, totalOrders] = await prisma.$transaction([
      prisma.order.findFirst({
        where: {
          userId: user.id,
          createdAt: { gte: oneYearAgo },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.order.count({
        where: {
          userId: user.id,
        },
      }),
    ]);

    if (order) {
      if (order.totalRequests > 1) {
        await prisma.order.update({
          where: {
            id: order.id,
          },
          data: {
            totalRequests: order.totalRequests - 1,
          },
        });
      } else {
        return dbError(
          res,
          "Please renew your subscription, you have excide the request limit."
        );
      }

      req.currentUser = {
        ...req.currentUser,
        subscriptionType: order.type,
      };
      next();
      return;
    }

    if (totalOrders > 0) {
      return dbError(
        res,
        "Please renew your subscription, Subscription expired."
      );
    }

    if (user.freeRequests > 1) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          freeRequests: user.freeRequests - 1,
        },
      });
      next();
      return;
    }

    return dbError(res, "Please subscribe, free trial expired.");
  } catch (error) {
    dbError(res, error);
  }
};
