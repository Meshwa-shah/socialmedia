import {
  useEffect,
  useState
} from "react";

import API from "./axios";

import Cookies from "js-cookie";
import socket from "./socket/socket";

import {
  useNavigate
} from "react-router-dom";

const Messages = () => {

  const currentUserId =
    Cookies.get("userId");

  const nav =
    useNavigate();

  const [conversations,
    setConversations] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const fetchConversations =
    async () => {

      try {

        const res =
          await API.get(
            "/chat/conversation"
          );

        if (
          res.data.success
        ) {

          setConversations(
            res.data.conversations
          );

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchConversations();

  }, []);

  useEffect(() => {

    socket.emit(
      "clear_message_badge"
    );

  }, []);

  if (loading) {

    return (

      <div
        className="
          bg-[#09090B]
          flex
          items-center
          justify-center
          text-white
        "
      >

        Loading...

      </div>

    );

  }

  return (
      //  min-h-screen
    <div
      className="
      min-h-screen
        bg-[#09090B]
        text-white
        px-4
        py-6 
      "
    >

      <div
        className="
          max-w-2xl
          mx-auto
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-8
          "
        >

          Messages

        </h1>

        {
          conversations.length === 0 ? (

            <p
              className="
                text-gray-400
                text-center
              "
            >

              No conversations yet

            </p>

          ) : (

            <div className="space-y-4 ">

              {
                conversations.map(
                  (
                    conversation
                  ) => {

                    const otherUser =
                      conversation.members.find(
                        (member) =>
                          member._id !==
                          currentUserId
                      );

                    return (

                      <div
                        key={
                          conversation._id
                        }

                        onClick={() =>
                          nav(
                            `/messages/${conversation._id}`
                          )
                        }

                        className="
                          flex
                          items-center
                          gap-4
                          p-4
                          rounded-2xl
                          bg-[#111115]
                          border
                          border-white/5
                          cursor-pointer
                          hover:border-violet-500
                          transition                                                              
                        "
                      >

                        <img
                          src={
                            otherUser?.profilePic ||
                            "https://placehold.co/100"
                          }
                          alt=""
                          className="
                            w-14
                            h-14
                            rounded-full
                            object-cover
                          "
                        />

                        <div
                          className="
    flex-1
    flex
    items-center
    justify-between
    overflow-x-hidden

  "
                        >

                          <div>

                            <h2
                              className="
        font-semibold
        text-lg
      "
                            >

                              {
                                otherUser?.username
                              }

                            </h2>

                            <p
                              className="
        text-gray-400
        truncate
      "
                            >

                              {
                                conversation.lastMessage ||
                                "Start chatting"
                              }

                            </p>

                          </div>

                          {
                            conversation.unreadCount > 0 && (

                              <span
                                className="
          w-3
          h-3
          bg-green-500
          rounded-full
          shrink-0
        "
                              />

                            )
                          }

                        </div>

                      </div>

                    );

                  }
                )
              }

            </div>

          )
        }

      </div>

    </div>

  );

};

export default Messages;