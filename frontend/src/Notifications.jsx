import { useEffect, useState } from "react";

import {
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  SmilePlus
} from "lucide-react";

import socket from "./socket/socket";
import API from "./axios";
import { useNavigate } from "react-router-dom";

const Notifications = () => {

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const nav = useNavigate();

  console.log(notifications);

  const fetchNotifications =
    async () => {

      try {

        const res =
          await API.get("/noti");

        if (
          res.data.success
        ) {

          setNotifications(
            res.data.notifications
          );

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  // MARK AS READ

  const markAsRead =
    async () => {

      try {

        await API.put(
          "/noti/read"
        );

        socket.emit(
          "notifications_read"
        );

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchNotifications();

    markAsRead();

  }, []);

  // REALTIME NOTIFICATIONS

  useEffect(() => {

    const handleNewNotification = (
      notification
    ) => {

      setNotifications(
        (prev) => [
          notification,
          ...prev,
        ]
      );

    };

    const handleNotificationRemoved = (
      data
    ) => {

      setNotifications(
        (prev) =>
          prev.filter(
            (notification) =>
              !(
                notification.type ===
                data.type &&
                notification.sender
                  ?._id ===
                data.sender &&
                notification.post
                  ?._id ===
                data.postId
              )
          )
      );

    };

    socket.on(
      "new_notification",
      handleNewNotification
    );

    socket.on(
      "notification_removed",
      handleNotificationRemoved
    );

    return () => {

      socket.off(
        "new_notification",
        handleNewNotification
      );

      socket.off(
        "notification_removed",
        handleNotificationRemoved
      );

    };

  }, []);
  // MESSAGE

  const renderMessage =
    (notification) => {

      switch (
      notification.type
      ) {

        case "like":
          return (
            <>
              liked your post
            </>
          );

        case "comment":
          return (
            <>
              commented:
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">

                "
                {
                  notification.commentText
                }
                "

              </p>
            </>
          );


        case "follow":
          return (
            <>
              started following you
            </>
          );

        case "story_like":
          return (
            <>
              liked your story
            </>
          );

        case "story_tag":
          return (
            <>
              tagged you in a story
            </>
          );

        case "mood_reaction":
          return (
            <>
              reacted to your mood
            </>
          );

        default:
          return (
            <>
              sent a notification
            </>
          );

      }

    };

  // ICONS

  const renderIcon =
    (type) => {

      switch (type) {

        case "like":

          return (

            <Heart
              size={20}
              className="text-red-500"
              fill="currentColor"
            />

          );

        case "comment":

          return (

            <MessageCircle
              size={20}
              className="text-blue-500"
            />

          );

        case "story_like":

          return (
            <Heart
              size={20}
              className="text-red-500"
            />
          );

        case "story_tag":
          return (
            <AtSign
              size={20}
              className="text-white"
            />
          );


        case "follow":

          return (

            <UserPlus
              size={20}
              className="text-green-500"
            />

          );

        case "mood_reaction":

          return (
            <SmilePlus
              size={20}
              className="text-yellow-500"
            />
          )

        default:

          return null;

      }

    };

  if (loading) {

    return (

      <div className=" bg-[#09090B] flex items-center justify-center text-white">

        Loading...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#09090B] px-4 py-8">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold text-white mb-8">

          Notifications

        </h1>

        {
          notifications.length === 0 ? (

            <div className="text-center text-gray-400 mt-20">

              No notifications yet

            </div>

          ) : (

            <div className="space-y-4">

              {
                notifications.map(
                  (
                    notification
                  ) => (

                    <div
                      key={
                        notification._id
                      }
                      onClick={notification.type === "follow"
                        ? () => nav(
                          `/profile/${notification.sender._id}`
                        )
                        : notification.type === "story_like"
                          ? () => nav(
                            `/story/single/${notification.status}`
                          )
                          : notification.type === "like"
                            ? () => nav(
                              `/posts/${notification.post._id}`
                            )
                            : 
                            
                            notification.type === "comment"
                              ? () => nav(
                                `/posts/${notification.post._id}`
                              ) : notification.type === "story_tag"
                                ? () => nav(
                                  `/story/${notification.recipient}`
                                ) : notification.type === "mood_reaction"
                                ? () => nav(`/mood/${notification.mood}`) : null}


                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${notification.isRead
                        ? "bg-[#111115] border-white/5"
                        : "bg-violet-900/20 border-violet-500/30"
                        }`}
                    >

                      {/* PROFILE */}

                      <img
                        src={
                          notification
                            .sender
                            ?.profilePic ||
                          "https://placehold.co/100"
                        }
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />

                      {/* CONTENT */}

                      <div className="flex-1">

                        <p className="text-white">

                          <span className="font-semibold">

                            {
                              notification
                                .sender
                                ?.username
                            }

                          </span>{" "}

                          {
                            renderMessage(
                              notification
                            )
                          }

                        </p>

                      </div>

                      {/* TYPE ICON */}

                      <div>

                        {
                          renderIcon(
                            notification.type
                          )
                        }

                      </div>

                      {/* POST THUMBNAIL */}

                      {
                        notification.type !==
                        "follow" &&
                        notification.post
                          ?.media?.length >
                        0 && (

                          <img
                            src={
                              notification
                                .post
                                .media[0]
                                .url || notification.status?.media?.url ||
                              "https://placehold.co/100"
                            }
                            alt=""
                            className="
                              w-14
                              h-14
                              rounded-xl
                              object-cover
                              border
                              border-white/10
                            "
                          />

                        )
                      }

                    </div>

                  )
                )
              }

            </div>

          )
        }

      </div>

    </div>

  );

};

export default Notifications;