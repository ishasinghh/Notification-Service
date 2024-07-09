import axios from "axios";
import { config } from "../config";
import { Request, Response, NextFunction } from "express";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Token is required" });
  }

  try {
    const authServiceUrl = config.authServiceUrl;

    const response = await axios.get(`${authServiceUrl}/v1/validateToken`, {
      headers: {
        Authorization: authHeader,
      },
    });
    (req as any).userId = response.data.userId; // Used type assertion to add userId
    next();
  } catch (error) {
    return res.status(401).json({
      statusCode: error.statusCode,
      error: "Token verification failed",
    });
  }
};
