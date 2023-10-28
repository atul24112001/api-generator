import { Router } from "express";
import { checkAuth } from "../middlewares/check-auth";
import { getAccountDetails } from "../controllers/account-details/get-account-details";
import cors from "cors";
import { corsOptions } from "../utils/functions";

const accountDetailsRouter = Router();

accountDetailsRouter.get("/", cors(corsOptions), checkAuth, getAccountDetails);

export default accountDetailsRouter;
