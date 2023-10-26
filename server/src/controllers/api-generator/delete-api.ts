import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import { getPrisma, sendResponse } from "../../utils/functions";

export const deleteApi = async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const id = req.params.id;

    const targetApi = req.targetApi;

    if (!req.targetProject) {
      return dbError(res, "Project not found!", 404);
    }

    if (!targetApi) {
      dbError(res, "Api not found!", 404);
      return;
    }

    const deletedApiModel = await prisma.api_model.delete({
      where: {
        apiId: targetApi.id,
      },
    });

    const deletedApi = await prisma.api.delete({
      where: {
        id: targetApi.id,
        userId: req.currentUser.id,
        projectId: req.targetProject.id,
      },
    });

    sendResponse(
      res,
      [
        {
          ...deletedApi,
          model: deletedApiModel.model,
        },
      ],
      "Api deleted Successfully"
    );
  } catch (error) {
    dbError(res, error);
  }
};
