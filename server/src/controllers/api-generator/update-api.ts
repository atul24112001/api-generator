import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import { getPrisma, sendResponse } from "../../utils/functions";

export const updateApi = async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const id = req.params.apiId;
    const { model } = req.body;

    if (typeof model != "object" || Array.isArray(model)) {
      dbError(res, "Invalid input");
      return;
    }
    const targetApi = req.targetApi;

    if (!req.targetProject) {
      return dbError(res, "Project not found!", 404);
    }

    if (!targetApi) {
      return dbError(res, "Api not found!", 404);
    }

    const targetModel = await prisma.api_model.findFirst({
      where: {
        apiId: targetApi.id,
      },
    });

    if (!targetApi || !targetModel) {
      dbError(res, "Api not found!", 404);
      return;
    }

    await prisma.api_model.update({
      where: {
        id: targetModel.id,
        apiId: targetApi.id,
      },
      data: {
        model,
      },
    });
    sendResponse(res, []);
  } catch (error) {
    dbError(res, error);
  }
};
