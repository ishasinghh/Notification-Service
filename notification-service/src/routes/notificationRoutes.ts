import express from "express";
import {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
} from "../controllers/notificationController";
import { verifyToken } from "../utils/verifyToken";

const router = express.Router();

router.post("/notifications", verifyToken, createNotification);
router.get("/notifications", verifyToken, getNotifications);
router.get("/notifications/:id", verifyToken, getNotificationById);
router.put("/notifications/:id", verifyToken, markAsRead);

export default router;
