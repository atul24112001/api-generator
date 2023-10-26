import { Router } from "express";
import { checkAuth } from "../middlewares/check-auth";
import { addProject, deleteProject, getProjects } from "../controllers/project";

const projectRouter = Router();

projectRouter.get("/", checkAuth, getProjects);
projectRouter.post("/", checkAuth, addProject);
projectRouter.delete("/:projectId", checkAuth, deleteProject);

export default projectRouter;
