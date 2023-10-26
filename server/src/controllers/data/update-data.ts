import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import {
  getPrisma,
  patchData,
  sanitizePatchData,
  sendResponse,
} from "../../utils/functions";

export const updateData = async (req: Request, res: Response) => {
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
    const { errors, value } = sanitizePatchData(
      req.body,
      JSON.parse(JSON.stringify(model?.model))
    );

    if (errors.length > 0) {
      dbError(res, errors[0], 400);
      return;
    }

    const oldData = await prisma.data.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!oldData) {
      dbError(res, "No record found with is id.", 400);
      return;
    }

    const finalData = patchData(
      JSON.parse(JSON.stringify(oldData.data)),
      JSON.parse(JSON.stringify(value)),
      JSON.parse(JSON.stringify(oldData.data))
    );

    const updatedData = await prisma.data.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        data: finalData,
      },
    });

    sendResponse(res, [
      {
        id: updatedData.id,
        ...JSON.parse(JSON.stringify(updatedData.data)),
        createdAt: updatedData.createdAt,
        updatedAt: updatedData.updatedAt,
      },
    ]);
  } catch (error) {
    dbError(res, error);
  }
};
