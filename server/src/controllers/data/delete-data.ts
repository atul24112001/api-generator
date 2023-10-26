import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import { getPrisma, sendResponse } from "../../utils/functions";

export const deleteData = async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const id = req.params.id;

    const targetApi = req.targetApi;
    if (!targetApi) {
      dbError(res, `can't found ${req.baseUrl}`, 404);
      return;
    }

    const deletedData = await prisma.data.delete({
      where: {
        id: parseInt(id),
      },
    });

    sendResponse(res, [deletedData]);
  } catch (error) {
    dbError(res, error);
  }
};
