import { Router } from "express";
import { checkAuth, verifyPath } from "../middlewares";
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
  checkAuth,
  verifyPath(true, false),
  getApis
);

apiGeneratorRouter.get(
  "/:projectId/:apiId",
  checkAuth,
  verifyPath(true, true),
  getModel
);

apiGeneratorRouter.post(
  "/:projectId",
  checkAuth,
  verifyPath(true, false),
  createApi
);

apiGeneratorRouter.patch(
  "/:projectId/:apiId",
  checkAuth,
  verifyPath(true, true),
  updateApi
);

apiGeneratorRouter.delete(
  "/:projectId/:apiId",
  checkAuth,
  verifyPath(true, true),
  deleteApi
);

export default apiGeneratorRouter;
