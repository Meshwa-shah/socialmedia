import {
  useEffect,
  useState,
  useRef
} from "react";

import {
  useParams
} from "react-router-dom";

import Cookies from "js-cookie";
import {toast} from 'react-toastify';
import API from "./axios";
import socket from "./socket/socket";
import { useNavigate } from "react-router-dom";

const ChatRoom = () => {

  const {
    conversationId
  } = useParams();

  const currentUserId =
    Cookies.get("userId");

  const nav = useNavigate();

  const [messages,
    setMessages] =
    useState([]);

  const [text,
    setText] =
    useState("");

  const [chatUser,
    setChatUser] =
    useState(null);

  const [disabled, setdisabled] = useState(false);


  const bottomRef =
    useRef(null);

  useEffect(() => {

    socket.on(
      "online_users",
      ({ onlineUsers, lastSeen }) => {

        if (!chatUser) return;

        const userId =
          chatUser.user._id;

        const isOnline =
          onlineUsers.includes(
            userId
          );

        setChatUser(
          (prev) => ({
            ...prev,
            isOnline,
            lastSeen:
              isOnline
                ? null
                : lastSeen[userId]
          })
        );

      }
    );

    return () => {

      socket.off(
        "online_users"
      );

    };

  }, [chatUser]);

  useEffect(() => {

    socket.on(
      "message_seen",
      ({ messageId }) => {

        setMessages(
          (prev) =>
            prev.map(
              (message) =>
                message._id ===
                  messageId
                  ? {
                    ...message,
                    isSeen: true
                  }
                  : message
            )
        );

      }
    );

    return () => {

      socket.off(
        "message_seen"
      );

    };

  }, []);

  // FETCH MESSAGES
  const fetchMessages =
    async () => {

      try {

        const res =
          await API.get(
            `/chat/message/${conversationId}`
          );

        if (
          res.data.success === true
        ) {

          setMessages(
            res.data.messages
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  const fetchChatHeader =
    async () => {

      try {

        const res =
          await API.get(
            `/chat/header/${conversationId}`
          );

        if (
          res.data.success
        ) {

          setChatUser(
            res.data
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  // SEND MESSAGE
  const sendMessage =
    async () => {
      if (
        !text.trim()
      ) return;

      try {
        setdisabled(true);
        const res =
          await API.post(
            `/chat/message/${conversationId}`,
            {
              text
            }
          );

        if (
          res.data.success
        ) {

          // add instantly for sender
          setMessages(
            (prev) => [
              ...prev,
              res.data.message
            ]
          );
          toast.success("message sent");
          setText("");

        }

      } catch (error) {

        console.log(error);

      }
      finally {
        setdisabled(false)
      }

    };

  // LOAD CHAT + MARK SEEN
  useEffect(() => {

    fetchMessages();
    fetchChatHeader();

    API.put(
      `/chat/seen/${conversationId}`
    );

    socket.emit(
      "messages_read"
    );

  }, [conversationId]);

  // REAL-TIME MESSAGES
  useEffect(() => {

    socket.on(
      "new_message",
      (message) => {

        console.log(
          "Live message:",
          message
        );

        if (
          message.conversationId ===
          conversationId
        ) {

          setMessages(
            (prev) => [
              ...prev,
              message
            ]
          );

        }

      }
    );

    return () => {

      socket.off(
        "new_message"
      );

    };

  }, [conversationId]);

  // AUTO SCROLL
  useEffect(() => {

    bottomRef.current?.
      scrollIntoView({
        behavior:
          "smooth"
      });

  }, [messages]);

  return (

    <div
      className="
        h-screen
        bg-[#09090B]
        text-white
        flex
        flex-col
      "
    >

      {/* CHAT AREA */}

      <div
        className="
    h-[75px]
    px-4
    border-b
    border-white/5
    flex
    items-center
    gap-3 
  "
      >

        <img
          src={
            chatUser?.user
              ?.profilePic ||
            "https://placehold.co/100"
          }
          alt=""
          className="
      w-12
      h-12
      rounded-full
      object-cover
    "
          onClick={() => nav(`/profile/${chatUser?.user?._id}`)}
        />

        <div>

          <p
            className="
        font-semibold
        text-white
      "
          >

            {
              chatUser?.user
                ?.username
            }

          </p>

          <p
            className="
        text-sm
        text-gray-400
      "
          >

            {
              chatUser?.isOnline
                ? "Online"
                : chatUser?.lastSeen
                  ? `Last seen ${new Date(
                    chatUser.lastSeen
                  ).toLocaleTimeString()}`
                  : "Offline"
            }

          </p>

        </div>

      </div>

      <div
        className="
          flex-1
          overflow-y-scroll
          px-4
          py-6
          space-y-4  no-scrollbar
        "
      >

        {
          messages.map(
            (message) => {

              const isMine =
                message.sender._id ===
                currentUserId;

              return (

                <div
                  key={
                    message._id
                  }
                  className={`
                    flex
                    ${isMine
                      ? "justify-end"
                      : "justify-start"
                    }
                  `}
                >

                  <div
                    className={`
                      max-w-[75%]
                      px-4
                      py-3
                      rounded-2xl
                      ${isMine
                        ? "bg-violet-600"
                        : "bg-[#1A1A1F]"
                      }
                    `}
                  >

                    {/* TEXT */}

                    {
                      message.text && (

                        <p>
                          {
                            message.text
                          }
                        </p>

                      )
                    }

                    {/* SHARED POST */}

                    {
                      message.sharedPost && (

                        <div
                          className="
                            mt-2
                            p-3
                            rounded-xl
                            bg-black/20
                          "
                          onClick={() => nav(`/post/${message.sharedPost._id}`)}
                        >

                          <img
                            src={
                              message.sharedPost
                                .media?.[0]?.url
                            }
                            alt=""
                            className="
                              w-full
                              rounded-xl
                            "
                          />

                          <p
                            className="
                              mt-2
                              text-sm
                            "
                          >

                            @
                            {
                              message.sharedPost
                                .user
                                ?.username
                            }

                          </p>

                        </div>

                      )
                    }
                    {
                      isMine &&
                      message.isSeen && (

                        <p
                          className="
        text-xs
        text-gray-300
        mt-1
      "
                        >
                          Seen
                        </p>

                      )
                    }
                  </div>

                </div>

              );

            }
          )
        }

        <div ref={bottomRef} />

      </div>

      {/* INPUT */}

      <div
        className="
          p-4
          border-t
          border-white/5
          flex
          gap-3
        "
      >

        <input
          type="text"
          value={text}
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          placeholder="Message..."
          className="
            flex-1
            px-4
            py-3
            rounded-xl
            bg-[#111115]
            outline-none
          "
        />

        <button
          onClick={
            sendMessage
          }
          className="
            px-5
            py-3
            bg-violet-600
            rounded-xl
          "
          disabled={disabled}
        >

          {disabled === true ? "sending..." : "send"}

        </button>

      </div>

    </div>

  );

};

export default ChatRoom;