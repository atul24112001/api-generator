// import { Request, Response } from "express";
// import dbError from "../../utils/db-error";
// import { getPrisma, sendResponse } from "../../utils/functions";

// export async function updateProject(req: Request, res: Response) {
//   try {
//     const prisma = getPrisma();
//     const projectId = req.query.projectId as string;

//     const updatedProject = await prisma.project.update({
//       where: {
//         id: parseInt(projectId),
//         userId: req.currentUser.id,
//       },
//       data: {

//       }
//     });

//     sendResponse(
//       res,
//       [updatedProject],);
//   } catch (error) {
//     dbError(res, error);
//   }
// }
