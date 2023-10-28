import { Router } from "express";
import { login, signup, verifyUserToken } from "../controllers/authentication";
import { corsHandler } from "../middlewares";
const authRouter = Router();

authRouter.post("/signup", corsHandler, signup);
authRouter.get("/verify", corsHandler, verifyUserToken);
authRouter.post("/login", corsHandler, login);

export default authRouter;
