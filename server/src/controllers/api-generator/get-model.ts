import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import { getPrisma, sendResponse } from "../../utils/functions";

export const getModel = async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();

    const targetApi = req.targetApi;

    if (!req.targetProject) {
      return dbError(res, "Project not found!", 404);
    }

    if (!targetApi) {
      dbError(res, "Api not found!", 404);
      return;
    }

    const model = await prisma.api_model.findFirst({
      where: {
        apiId: targetApi.id,
      },
    });

    if (!model) {
      dbError(res, "Model not found!", 404);
      return;
    }

    sendResponse(res, [model], "200", 200, 0);
  } catch (error) {
    dbError(res, error);
  }
};
