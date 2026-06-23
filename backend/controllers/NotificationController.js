import Notification from "../models/Notification.js";


export const getNotifications =
  async (req, res) => {
    try {

      const notifications =
        await Notification.find({
          recipient: req.user,
        })

          .populate(
            "sender",
            "username profilePic"
          )

          .populate(
            "post",
            "media caption"
          )

          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        notifications,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });

    }
  };

export const markNotificationsAsRead =
  async (req, res) => {
    try {

      await Notification.updateMany(
        {
          recipient: req.user,
          isRead: false,
        },
        {
          $set: {
            isRead: true,
          },
        }
      );

      return res.status(200).json({
        success: true,
        message:
          "Notifications marked as read",
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });

    }
  };

  export const getUnreadCount =
  async (req, res) => {

    try {

      const count =
        await Notification.countDocuments({
          recipient: req.user,
          isRead: false,
        });

      return res.status(200).json({
        success: true,
        count,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });

    }

  };