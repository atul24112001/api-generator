import { Router } from "express";
import { checkAuth, corsHandler, verifyPath } from "../middlewares";
import {
  createApi,
  deleteApi,
  getApis,
  updateApi,
  getModel,
} from "../controllers/api-generator";

const apiGeneratorRouter = Router();

apiGeneratorRouter.get(
  "/:projectId",
  corsHandler,
  checkAuth,
  verifyPath(true, false),
  getApis
);

apiGeneratorRouter.get(
  "/:projectId/:apiId",
  corsHandler,
  checkAuth,
  verifyPath(true, true),
  getModel
);

apiGeneratorRouter.post(
  "/:projectId",
  corsHandler,
  checkAuth,
  verifyPath(true, false),
  createApi
);

apiGeneratorRouter.patch(
  "/:projectId/:apiId",
  corsHandler,
  checkAuth,
  verifyPath(true, true),
  updateApi
);

apiGeneratorRouter.delete(
  "/:projectId/:apiId",
  corsHandler,
  checkAuth,
  verifyPath(true, true),
  deleteApi
);

export default apiGeneratorRouter;
