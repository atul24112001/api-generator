import { Router } from "express";
import { checkAuth, verifyPath } from "../middlewares";
import {
  createApi,
  deleteApi,
  getApis,
  updateApi,
  getModel,
} from "../controllers/api-generator";
import cors from "cors";
import { corsOptions } from "../utils/functions";

const apiGeneratorRouter = Router();

apiGeneratorRouter.get(
  "/:projectId",
  cors(corsOptions),
  checkAuth,
  verifyPath(true, false),
  getApis
);

apiGeneratorRouter.get(
  "/:projectId/:apiId",
  cors(corsOptions),
  checkAuth,
  verifyPath(true, true),
  getModel
);

apiGeneratorRouter.post(
  "/:projectId",
  cors(corsOptions),
  checkAuth,
  verifyPath(true, false),
  createApi
);

apiGeneratorRouter.patch(
  "/:projectId/:apiId",
  cors(corsOptions),
  checkAuth,
  verifyPath(true, true),
  updateApi
);

apiGeneratorRouter.delete(
  "/:projectId/:apiId",
  cors(corsOptions),
  checkAuth,
  verifyPath(true, true),
  deleteApi
);

export default apiGeneratorRouter;
