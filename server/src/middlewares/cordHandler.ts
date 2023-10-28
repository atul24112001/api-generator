import { Request, Response, NextFunction } from "express";
import dbError from "../utils/db-error";

export async function corsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.baseUrl.includes("/api/data")) {
      next();
    } else {
      console.log(req.get("origin"));
      if (req.get("origin")?.includes(process.env.CLIENT_URL as string)) {
        next();
        return;
      }
      dbError(res, "Cors Error", 400);
    }
    return;
  } catch (error) {
    dbError(res, error);
  }
}
