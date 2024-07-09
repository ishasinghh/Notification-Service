import * as jwt from "jsonwebtoken";
import { findUserById } from "../models/userModel";
import { InvalidTokenError } from "../errors/customeError";

const SECRET_KEY = "3b9d3b1e2d5f4a6b3a2c1d4e5f6g7h8i";

export interface JwtPayloadType {
  userId: string;
  role?: string;
}

export interface JwtDecryptType extends JwtPayloadType {}

export async function generateToken(
  payload: JwtPayloadType,
  expiresIn: string
): Promise<string> {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn,
  });
}

export async function verifyToken(
  token: string
): Promise<JwtDecryptType | null> {
  try {
    const payload = jwt.verify(token, SECRET_KEY) as JwtPayloadType;

    const userData = await findUserById(payload.userId);
    if (!userData) {
      // throw new Error("User not found");
      throw new InvalidTokenError();
    }

    return { userId: userData._id };
  } catch (error) {
    throw error;
  }
}
