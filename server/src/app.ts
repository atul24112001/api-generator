import Express from "express";
import { config } from "dotenv";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import cookieParse from "cookie-parser";

import authRouter from "./routes/authentication.routes";
import apiGeneratorRouter from "./routes/api-generator.routes";
import dataRouter from "./routes/data.routes";
import accountDetailsRouter from "./routes/account-details.routes";
import projectRouter from "./routes/project.routes";
import paymentRouter from "./routes/payment.routes";

config({
  path: path.join(__dirname, `../.env`),
});

const PORT = process.env.PORT;
const app = Express();
app.use(Express.json({ limit: "10mb" }));
app.use(cors());
app.use(cookieParse());
app.use(morgan("dev"));

app.use("/api/authentication", authRouter);
app.use("/api/api-generator", apiGeneratorRouter);
app.use("/api/data", dataRouter);
app.use("/api/account-details", accountDetailsRouter);
app.use("/api/project", projectRouter);
app.use("/api/payment", paymentRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
