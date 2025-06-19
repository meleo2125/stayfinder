const Notification = require("../models/Notification");

// GET /notifications/user/:userId - get all notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { seen } = req.query; // optional: filter by seen/unseen
    const filter = { userId };
    if (seen === "true") filter.seen = true;
    if (seen === "false") filter.seen = false;
    const notifications = await Notification.find(filter).sort({
      createdAt: -1,
    });
    res.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// PATCH /notifications/:id/seen - mark a notification as seen
exports.markNotificationSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ notification });
  } catch (error) {
    console.error("Error marking notification as seen:", error);
    res.status(500).json({ message: "Failed to mark notification as seen" });
  }
};

// PATCH /notifications/user/:userId/seen - mark all notifications for a user as seen
exports.markAllNotificationsSeen = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany({ userId, seen: false }, { seen: true });
    res.json({ message: "All notifications marked as seen" });
  } catch (error) {
    console.error("Error marking all notifications as seen:", error);
    res
      .status(500)
      .json({ message: "Failed to mark all notifications as seen" });
  }
};
