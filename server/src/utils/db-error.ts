import { Request, Response } from "express";

export default async function (
  res: Response,
  error: any,
  status: number = 500
) {
  if (error instanceof Error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error.",
      details: error.message,
    });
    return;
  }
  console.log(error);
  res.status(status).json({
    message: error,
  });
  return;
}
