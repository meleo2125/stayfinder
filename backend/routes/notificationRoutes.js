const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Get all notifications for a user (optionally filter by seen/unseen)
router.get("/user/:userId", notificationController.getUserNotifications);

// Mark a single notification as seen
router.patch("/:id/seen", notificationController.markNotificationSeen);

// Mark all notifications for a user as seen
router.patch(
  "/user/:userId/seen",
  notificationController.markAllNotificationsSeen
);

module.exports = router;
