import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import { getPrisma, sendResponse } from "../../utils/functions";

export const getData = async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const targetApi = req.targetApi;

    if (!targetApi) {
      dbError(res, `can't found ${req.baseUrl}`, 404);
      return;
    }

    const [data, total] = await prisma.$transaction([
      prisma.data.findMany({
        where: {
          apiId: targetApi.id,
        },
      }),
      prisma.data.count({
        where: {
          apiId: targetApi.id,
        },
      }),
    ]);

    const finalData: any[] = [];

    for (let obj of data) {
      const d = JSON.parse(JSON.stringify(obj.data));
      finalData.push({
        id: obj.id,
        ...d,
        updatedAt: obj.updatedAt,
        createdAt: obj.createdAt,
      });
    }

    console.log(total);
    sendResponse(res, finalData, "Success", 200, total);
  } catch (error) {
    dbError(res, error);
  }
};
