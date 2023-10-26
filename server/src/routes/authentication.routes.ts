import { Router } from "express";
import { login, signup, verifyUserToken } from "../controllers/authentication";
const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.get("/verify", verifyUserToken);
authRouter.post("/login", login);

export default authRouter;
