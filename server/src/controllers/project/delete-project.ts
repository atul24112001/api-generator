import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import { getPrisma, sendResponse } from "../../utils/functions";

export async function deleteProject(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const projectId = req.params.projectId;

    console.log(parseInt(projectId), projectId);
    const targetProject = await prisma.project.findFirst({
      where: {
        id: parseInt(projectId) || 0,
        userId: req.currentUser.id,
      },
    });
    if (!targetProject) {
      dbError(res, "Project not found.");
      return;
    }

    const targetApis = await prisma.api.findMany({
      where: {
        projectId: targetProject.id,
      },
    });

    if (targetApis.length > 0) {
      await prisma.api_model.deleteMany({
        where: {
          apiId: { in: targetApis.map((a) => a.id) },
        },
      });
      await prisma.api.deleteMany({
        where: {
          id: { in: targetApis.map((a) => a.id) },
        },
      });
    }

    const deletedProject = await prisma.project.delete({
      where: {
        id: targetProject.id,
      },
    });

    sendResponse(
      res,
      [deletedProject],
      `Deleted Project(${deletedProject.title}) successfully!`
    );
  } catch (error) {
    dbError(res, error);
  }
}
