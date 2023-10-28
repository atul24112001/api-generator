import { Router } from "express";
import { checkAuth } from "../middlewares/check-auth";
import { getAccountDetails } from "../controllers/account-details/get-account-details";
import { corsHandler } from "../middlewares";

const accountDetailsRouter = Router();

accountDetailsRouter.get("/", corsHandler, checkAuth, getAccountDetails);

export default accountDetailsRouter;
