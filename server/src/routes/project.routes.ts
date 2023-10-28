import { Router } from "express";
import { checkAuth } from "../middlewares/check-auth";
import { addProject, deleteProject, getProjects } from "../controllers/project";
import cors from "cors";
import { corsOptions } from "../utils/functions";

const projectRouter = Router();

projectRouter.get("/", cors(corsOptions), checkAuth, getProjects);
projectRouter.post("/", cors(corsOptions), checkAuth, addProject);
projectRouter.delete(
  "/:projectId",
  cors(corsOptions),
  checkAuth,
  deleteProject
);

export default projectRouter;
