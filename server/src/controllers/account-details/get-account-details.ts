import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import { getPrisma, sendResponse } from "../../utils/functions";
import { genToken } from "../../utils/functions";

export async function getAccountDetails(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const user = req.currentUser;
    let secretKey: any = user.secretKey;
    if (!secretKey) {
      const newSecret = genToken(
        {
          id: user.id,
          name: user.email,
          secretKey: true,
          createdAt: new Date().getTime(),
        },
        "365d"
      );
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          secretKey: newSecret,
        },
      });
      secretKey = newSecret;
    }
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const [order, totalProjects] = await prisma.$transaction([
      prisma.order.findFirst({
        where: {
          userId: user.id,
          createdAt: { gte: oneYearAgo },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.project.count({
        where: {
          userId: user.id,
        },
      }),
    ]);

    console.log({ order });

    sendResponse(res, [
      {
        secret: secretKey,
        requestsRemaining: !order ? user.freeRequests : order.totalRequests,
        totalProjects,
        subscriptionType: order?.type || user.subscriptionType,
      },
    ]);
  } catch (error) {
    dbError(res, error);
  }
}
