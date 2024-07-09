import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/customError";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .json({ statusCode: err.statusCode, errorMessage: err.message });
  } else {
    // Handle unexpected errors
    return res
      .status(500)
      .json({ statusCode: 500, errorMessage: "Internal Server Error" });
  }
}
