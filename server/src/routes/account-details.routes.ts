import { Router } from "express";
import { checkAuth } from "../middlewares/check-auth";
import { getAccountDetails } from "../controllers/account-details/get-account-details";

const accountDetailsRouter = Router();

accountDetailsRouter.get("/", checkAuth, getAccountDetails);

export default accountDetailsRouter;
