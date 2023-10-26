import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import { getPrisma, sendResponse, struct } from "../../utils/functions";
import z from "zod";
const body = z.object({
  title: z.string().trim().min(1).max(100),
});

export async function addProject(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const user = req.currentUser;
    const parsedBody = body.safeParse(req.body);

    if (!parsedBody.success) {
      return dbError(res, "Invalid input");
    }

    const order = await prisma.order.findFirst({
      where: {
        userId: user.id,
      },
    });
    if (!order || order.type == "standard") {
      const totalProjectsYet = await prisma.project.count({
        where: {
          userId: user.id,
        },
      });

      if (user.subscriptionType == "free" && totalProjectsYet == 1) {
        return dbError(res, "Please subscribe to add more projects.");
      }

      if (user.subscriptionType == "standard" && totalProjectsYet == 10) {
        return dbError(
          res,
          "Please upgrade your subscription to add more projects."
        );
      }
    }

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        title: parsedBody.data.title,
      },
    });
    sendResponse(res, [project]);
  } catch (error) {
    dbError(res, error);
  }
}
