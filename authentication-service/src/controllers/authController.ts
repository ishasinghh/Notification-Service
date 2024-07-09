import { Request, Response } from "express";
import { verifyToken } from "../utils/jwtHelper";
import { AuthService } from "../services/authService";

export class AuthController {
  private authService: AuthService = new AuthService();

  public async register(req: Request, res: Response) {
    const { username, email, password } = req.body;

    try {
      if (!this.validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      if (username.length < 5) {
        return res
          .status(400)
          .json({ error: "Username must be at least 5 characters long" });
      }

      const userResponse = await this.authService.registerUser(
        username,
        email,
        password
      );
      res.status(201).json(userResponse);
    } catch (err) {
      console.error(err);
      res.json({ statusCode: err.statusCode, message: err.message });
    }
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "email and password is required" });
      }
      const userResponse = await this.authService.login(email, password);
      res.status(201).json(userResponse);
    } catch (err) {
      res.json({ statusCode: err.statusCode, message: err.message });
    }
  }

  public async updateUserConnectionStatus(req: Request, res: Response) {
    const { userId, status } = req.body;
    try {
      if (!userId || !status) {
        return res.status(400).json({ error: "userId and status required" });
      }
      const userResponse = await this.authService.updateUserConnectionStatus(
        userId,
        status
      );
      res
        .status(201)
        .json({ message: "User connection status updated", userResponse });
    } catch (err) {
      res.json({ statusCode: err.statusCode, message: err.message });
    }
  }

  public async validateToken(req: Request, res: Response) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    try {
      const validateTokenResponse = await verifyToken(token);
      res.status(201).json(validateTokenResponse);
    } catch (error) {
      res.status(401).json({ message: "Failed to authenticate token" });
    }
  }
  private validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
