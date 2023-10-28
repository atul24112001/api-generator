import { Request, Response, Router } from "express";
import { corsHandler } from "../middlewares/cordHandler";
const notFoundRouter = Router();

const notFound = async (req: Request, res: Response) => {
  res
    .status(404)
    .send(
      "<h1 style='text-align: center; padding: 1rem;'>Route no found, 404</h1>"
    );
};

notFoundRouter.get("/", corsHandler, notFound);
notFoundRouter.post("/", corsHandler, notFound);
notFoundRouter.put("/", corsHandler, notFound);
notFoundRouter.patch("/", corsHandler, notFound);
notFoundRouter.delete("/", corsHandler, notFound);

export default notFoundRouter;
