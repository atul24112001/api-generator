import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import { getPrisma, sendResponse, struct } from "../../utils/functions";
import { z } from "zod";

const body = z.object({
  title: z.string().max(100).min(1),
});

export const createApi = async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const parsedBody = body.safeParse(req.body);

    if (!parsedBody.success) {
      dbError(res, "Invalid input.", 400);
      return;
    }

    if (!req.targetProject) {
      return dbError(res, "Project not found!", 404);
    }

    const title = parsedBody.data.title;

    const titleExist = await prisma.api.findFirst({
      where: {
        title: struct(title),
        userId: req.currentUser.id,
      },
    });

    if (titleExist) {
      dbError(res, "Title already exist, please enter unique title.", 400);
      return;
    }

    const api = await prisma.api.create({
      data: {
        title: struct(title),
        userId: req.currentUser.id,
        projectId: req.targetProject.id,
      },
    });

    await prisma.api_model.create({
      data: {
        model: {},
        apiId: api.id,
      },
    });

    sendResponse(res, [api]);
  } catch (error) {
    dbError(res, error);
  }
};
