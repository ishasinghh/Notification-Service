import { Request, Response } from "express";
import { Notification } from "../models/notificationModel";
import { sendToQueue } from "../utils/rabbitMQ";
import { getPagination } from "../utils/pagination";

const createNotification = async (req: Request, res: Response) => {
  const { userId, message } = req.body;
  try {
    const notification = new Notification({ userId, message });
    await notification.save();
    sendToQueue("notifications", notification);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: "Error creating notification" });
  }
};

const getNotifications = async (req: Request, res: Response) => {
  try {
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const pageLimit = parseInt(req.query.pageLimit as string) || 1;

    const userId = (req as any).userId; // Type assertion to access userId
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const totalNotifications = await Notification.countDocuments({ userId });
    const { skip, limit, page, totalPages } = await getPagination(
      pageSize,
      pageLimit,
      totalNotifications
    );

    const notifications = await Notification.find({ userId })
      .skip(skip)
      .limit(limit);

    res.json({
      notifications,
      page,
      limit,
      totalNotifications,
      totalPages,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
};

const getNotificationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userId = (req as any).userId; // Type assertion to access userId
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const notification = await Notification.findById({ _id: id });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: "Error fetching notification" });
  }
};

const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userId = (req as any).userId; // Type assertion to access userId
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: "Error marking notification as read" });
  }
};

export {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
};
