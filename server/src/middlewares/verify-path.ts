import { NextFunction, Request, Response } from "express";
import dbError from "../utils/db-error";
import { getPrisma } from "../utils/functions";

export function verifyPath(project: boolean, api: boolean) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const prisma = getPrisma();
      if (project) {
        const projectId = req.params.projectId;
        const targetProject = await prisma.project.findFirst({
          where: {
            id: parseInt(projectId),
          },
        });
        if (!targetProject) {
          return dbError(res, "Project not found", 404);
        }

        if (api) {
          const targetApi = await prisma.api.findFirst({
            where: {
              OR: [
                { title: req.params.apiId },
                { id: parseInt(req.params.apiId) || 0 },
              ],
              userId: req.currentUser.id,
              projectId: targetProject.id,
            },
          });

          if (!targetApi) {
            return dbError(res, "Api not found", 404);
          }

          req.targetApi = targetApi;
        }

        req.targetProject = targetProject;
      }
      next();
    } catch (error) {
      dbError(res, error);
    }
  };
}
