import { Request, Response } from "express";
import dbError from "../../utils/db-error";
import { getPrisma, sendResponse } from "../../utils/functions";

export async function deleteProject(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const projectId = req.params.projectId;

    console.log(parseInt(projectId), projectId);
    const deletedProject = await prisma.project.delete({
      where: {
        id: parseInt(projectId) || 0,
        userId: req.currentUser.id,
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
