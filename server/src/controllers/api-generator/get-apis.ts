import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import { getPrisma, sendResponse } from "../../utils/functions";

export const getApis = async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const skip = req.query.skip as string;

    if (!req.targetProject) {
      return dbError(res, "Project not found!", 404);
    }

    const apis = await prisma.api.findMany({
      where: {
        userId: req.currentUser.id,
        projectId: req.targetProject.id,
      },
      skip: parseInt(skip ?? "0"),
      take: 15,
      orderBy: {
        createdAt: "desc",
      },
    });

    sendResponse(res, apis);
  } catch (error) {
    dbError(res, error);
  }
};
