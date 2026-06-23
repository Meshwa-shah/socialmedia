import {
  House,
  Search,
  SquarePlus,
  Heart,
  User,
} from "lucide-react";

import Cookies from "js-cookie"
import API from "./axios";
import socket from "./socket/socket";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { useState, useEffect } from "react";

import useAuthStore from "./useAuthStore";

const BottomNav = () => {

  const location = useLocation();

  const userId = Cookies.get("userId")

  const [unreadCount, setUnreadCount] =
    useState(0);


  useEffect(() => {

    const handleNewNotification = () => {

      setUnreadCount(
        prev => prev + 1
      );

    };

    socket.on(
      "new_notification",
      handleNewNotification
    );

    return () => {

      socket.off(
        "new_notification",
        handleNewNotification
      );

    };

  }, []);
  useEffect(() => {
    function remove() {
      setUnreadCount(0);
    }

    socket.on(
      "clear_notification_badge",
      () => {

        remove();

      }
    );

    return () => {

      socket.off(
        "clear_notification_badge"
      );

    };

  }, []);

  useEffect(() => {

    const fetchUnread =
      async () => {

        try {

          const res =
            await API.get(
              "/noti/unread-count"
            );

          setUnreadCount(
            res.data.count
          );

        } catch (error) {

          console.log(error);

        }

      };

    fetchUnread();

  }, []);


  const navItems = [
    {
      icon: House,
      path: "/feed",
    },

    {
      icon: Search,
      path: "/search",
    },

    {
      icon: SquarePlus,
      path: "/create-post",
    },

    {
      icon: Heart,
      path: "/notifications",
    },

    {
      icon: User,
      path: `/profile/${userId}`,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0  right-0 h-[75px] bg-[#09090B]/80 backdrop-blur-xl border-t border-gray-700 z-50">

      <div className="max-w-3xl mx-auto h-full flex items-center justify-around">

        {
          navItems.map((item, index) => {

            const isActive =
              location.pathname ===
              item.path;

            return (

              <Link
                key={index}
                to={item.path}
                className={`relative transition-all duration-300 ${isActive
                  ? "text-violet-400 scale-110"
                  : "text-gray-400 hover:text-white"
                  }`}
              >

                <item.icon size={28} />

                {/* Notification Dot */}

                {
                  item.path === "/notifications" &&
                  unreadCount > 0 && (

                    <span
                      className="
                absolute
                -top-1
                -right-1
                w-3
                h-3
                bg-red-500
                rounded-full
              "
                    />

                  )
                }

              </Link>

            );

          })
        }

      </div>

    </nav>
  );
};

export default BottomNav;