import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import { getPrisma, sendResponse } from "../../utils/functions";

export async function getProjects(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const [projects, total] = await prisma.$transaction([
      prisma.project.findMany({
        where: {
          userId: req.currentUser.id,
        },
      }),
      prisma.project.count({
        where: {
          userId: req.currentUser.id,
        },
      }),
    ]);

    sendResponse(res, projects, "Success", 200, total);
  } catch (error) {
    dbError(res, error);
  }
}
