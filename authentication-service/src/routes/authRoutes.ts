import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();
const authController = new AuthController();

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.get("/validateToken", (req, res) =>
  authController.validateToken(req, res)
);
router.post("/updateConnectionStatus", (req, res) =>
  authController.updateUserConnectionStatus(req, res)
);

export default router;
