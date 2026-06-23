import {
  Smile,
  MessageCircle,
} from "lucide-react";

import {
  useState,
  useEffect
} from "react";

import socket from "./socket/socket";
import API from "./axios";

import {
  Link,
  useLocation
} from "react-router-dom";

const Topbar = () => {

  const location =
    useLocation();

  const [unreadMessages,
    setUnreadMessages] =
    useState(0);

  // FETCH UNREAD COUNT
  useEffect(() => {

    const fetchUnread =
      async () => {

        try {

          const res =
            await API.get(
              "/chat/unread-count"
            );

          if (
            res.data.success
          ) {

            setUnreadMessages(
              res.data.count
            );

          }

        } catch (error) {

          console.log(error);

        }

      };

    fetchUnread();

  }, []);

  // LIVE MESSAGE BADGE
  useEffect(() => {

    socket.on(
      "new_message_badge",
      () => {

        setUnreadMessages(
          (prev) =>
            prev + 1
        );

      }
    );

    // CLEAR BADGE EVENT
    socket.on(
      "clear_message_badge",
      () => {

        setUnreadMessages(0);

      }
    );

    return () => {

      socket.off(
        "new_message_badge"
      );

      socket.off(
        "clear_message_badge"
      );

    };

  }, []);

  // CLEAR WHEN OPENING CHAT PAGE
  useEffect(() => {

    if (
      location.pathname ===
      "/messages"
    ) {

      setUnreadMessages(0);

    }

  }, [location.pathname]);

  return (

    <header
      className="
        fixed
        top-0
        left-0
        right-0
        h-[75px]
        bg-[#09090B]/80
        backdrop-blur-xl
        z-50
      "
    >

      <div
        className="
          max-w-6xl
          mx-auto
          h-full
          px-4
          flex
          items-center
          justify-between
        "
      >

        {/* LOGO */}

        <Link
          to="/feed"
          className="
            text-2xl
            font-bold
            bg-gradient-to-r
            from-violet-400
            to-indigo-400
            bg-clip-text
            text-transparent
          "
        >

          FAMILYGRAM

        </Link>

        {/* RIGHT ICONS */}

        <div
          className="
            flex
            items-center
            gap-5
          "
        >

          {/* MOODS */}

          <Link
            to="/moods"
            className="
              hover:text-violet-400
              transition
            "
          >

            <Smile size={24} />

          </Link>

          {/* CHAT */}

          <Link
            to="/messages"
            className="
              relative
              hover:text-violet-400
              transition
            "
          >

            {
              unreadMessages > 0 && (

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

            <MessageCircle size={24} />

          </Link>

        </div>

      </div>

    </header>

  );

};

export default Topbar;