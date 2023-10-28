import { Router } from "express";
import { login, signup, verifyUserToken } from "../controllers/authentication";
import cors from "cors";
import { corsOptions } from "../utils/functions";
const authRouter = Router();

authRouter.post("/signup", cors(corsOptions), signup);
authRouter.get("/verify", cors(corsOptions), verifyUserToken);
authRouter.post("/login", cors(corsOptions), login);

export default authRouter;
