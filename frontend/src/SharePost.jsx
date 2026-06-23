import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import API from "./axios";
import Cookies from "js-cookie";

const SharePost = () => {

  const { postId } =
    useParams();

  const nav =
    useNavigate();

  const [conversations,
    setConversations] =
    useState([]);

  const currentUserId = Cookies.get("userId")

  const uniqueConversations =
  conversations.filter(
    (conversation, index, self) => {
      const otherUser =
        conversation.members.find(
          (member) =>
            member._id !== currentUserId
        );

      return (
        index ===
        self.findIndex((c) => {
          const user =
            c.members.find(
              (member) =>
                member._id !== currentUserId
            );

          return (
            user?._id ===
            otherUser?._id
          );
        })
      );
    }
  );

    console.log(conversations);

  useEffect(() => {

    const fetchConversations =
      async () => {

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

      };

    fetchConversations();

  }, []);

  const sharePost =
    async (
      conversationId
    ) => {

      const res =
        await API.post(
          `/chat/message/${conversationId}`,
          {
            sharedPost:
              postId
          }
        );

      if (
        res.data.success
      ) {

        nav(
          `/messages/${conversationId}`
        );

      }

    };

  return (

    <div
      className="
        min-h-screen
        bg-[#09090B]
        text-white
        p-5
      "
    >

      <h1
        className="
          text-3xl
          font-bold
          mb-5
        "
      >
        Share Post
      </h1>

      <div className="space-y-4">

        {
          uniqueConversations.map(
            (
              conversation
            ) => {



              const user =
                conversation.members.find(
                  member =>
                    member._id !==
                    currentUserId
                );

              return (

                <div
                  key={
                    conversation._id
                  }
                  onClick={() =>
                    sharePost(
                      conversation._id
                    )
                  }
                  className="
                    p-4
                    rounded-2xl
                    bg-[#111115]
                    cursor-pointer
                  "
                >
                  <div className="flex gap-2  items-center ">
                    <img src={user.profilePic} alt="" className="size-10 rounded-[50%] border-2 border-violet-500" />

                    {
                      user.username
                    }
                  </div>

                </div>

              );

            }
          )
        }

      </div>

    </div>

  );

};

export default SharePost;