import { Router } from "express";
import { checkAuth } from "../middlewares/check-auth";
import { verifyPath } from "../middlewares/verify-path";
import { deleteData, getData, postData, updateData } from "../controllers/data";
import { verifySubscription } from "../middlewares/verify-subscription";
import { corsHandler } from "../middlewares";

const dataRouter = Router();

dataRouter.get(
  "/:projectId/:apiId",
  corsHandler,
  checkAuth,
  verifyPath(true, true),
  verifySubscription,
  getData
);

dataRouter.post(
  "/:projectId/:apiId",
  corsHandler,
  checkAuth,
  verifyPath(true, true),
  verifySubscription,
  postData
);
dataRouter.patch(
  "/:projectId/:apiId/:id",
  corsHandler,
  checkAuth,
  verifyPath(true, true),
  verifySubscription,
  updateData
);
dataRouter.delete(
  "/:projectId/:apiId/:id",
  corsHandler,
  checkAuth,
  verifyPath(true, true),
  verifySubscription,
  deleteData
);

export default dataRouter;
