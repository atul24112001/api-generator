import { Router } from "express";
import { checkAuth } from "../middlewares/check-auth";
import { addProject, deleteProject, getProjects } from "../controllers/project";
import { corsHandler } from "../middlewares";

const projectRouter = Router();

projectRouter.get("/", corsHandler, checkAuth, getProjects);
projectRouter.post("/", corsHandler, checkAuth, addProject);
projectRouter.delete("/:projectId", corsHandler, checkAuth, deleteProject);

export default projectRouter;
