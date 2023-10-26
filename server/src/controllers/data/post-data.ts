import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import {
  getPrisma,
  sanitizePatchData,
  sanitizePostData,
  sendResponse,
} from "../../utils/functions";

export const postData = async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const targetApi = req.targetApi;

    if (!targetApi) {
      dbError(res, `can't found ${req.baseUrl}`, 404);
      return;
    }
    const model = await prisma.api_model.findFirst({
      where: {
        apiId: targetApi.id,
      },
    });
    const data = sanitizePostData(
      req.body,
      JSON.parse(JSON.stringify(model?.model))
    );

    if (data.errors.length > 0) {
      dbError(res, data.errors[0], 400);
      return;
    }

    const finalData = await prisma.data.create({
      data: {
        apiId: targetApi.id,
        userId: req.currentUser.id,
        data: data.value,
      },
    });

    sendResponse(res, [
      {
        id: finalData.id,
        ...JSON.parse(JSON.stringify(finalData.data)),
        createdAt: finalData.createdAt,
        updatedAt: finalData.updatedAt,
      },
    ]);
  } catch (error) {
    dbError(res, error);
  }
};
