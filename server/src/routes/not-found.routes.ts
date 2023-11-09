import { Request, Response, Router } from "express";
import { corsHandler } from "../middlewares/cordHandler";
import cors from "cors";
import { corsOptions } from "../utils/functions";
const notFoundRouter = Router();

const notFound = async (req: Request, res: Response) => {
  res
    .status(404)
    .send(
      "<h1 style='text-align: center; padding: 1rem;'>Route no found, 404: V2</h1>"
    );
};

notFoundRouter.get("/", cors(corsOptions), notFound);
notFoundRouter.post("/", cors(corsOptions), notFound);
notFoundRouter.put("/", cors(corsOptions), notFound);
notFoundRouter.patch("/", cors(corsOptions), notFound);
notFoundRouter.delete("/", cors(corsOptions), notFound);

export default notFoundRouter;
