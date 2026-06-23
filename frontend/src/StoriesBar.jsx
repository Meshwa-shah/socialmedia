import {
  useEffect,
  useState
} from "react";

import API from "./axios";

import Cookies from "js-cookie";

import {
  useNavigate
} from "react-router-dom";

const StoriesBar = () => {

  const nav =
    useNavigate();

  const myId =
    Cookies.get("userId");

  const [stories,
    setStories] =
    useState([]);

  useEffect(() => {

    const fetchStories =
      async () => {

        try {

          const res =
            await API.get(
              "/status/feed"
            );

          setStories(
            res.data.stories
          );

        } catch (error) {

          console.log(error);

        }

      };

    fetchStories();

  }, []);

  const groupedStories =
    stories.reduce(
      (acc, story) => {

        if (
          !acc[story.user._id]
        ) {

          acc[story.user._id] = [];

        }

        acc[
          story.user._id
        ].push(story);

        return acc;

      },
      {}
    );

  return (
//h-screen
    <div
      className="
      flex
      gap-4
      overflow-x-auto
      py-4
      px-2
    "
    >

      {
        stories.map(
          (storygroup) => {
            const story = storygroup.statuses[0];
            console.log(story.viewers)

            const isMine =
              story.user._id ===
              myId;


            const hasSeen =
              storygroup.statuses.every(
                (story) =>
                  story.viewers?.some(
                    (viewer) =>
                      (viewer.user || viewer)
                        .toString() === myId
                  )
              );



            return (

              <div
                key={
                  story.user._id
                }
                onClick={() =>
                  nav(
                    `/story/${story.user._id}`
                  )
                }
                className="
                  flex
                  flex-col
                  items-center
                  cursor-pointer
                  min-w-[80px]
                "
              >

                <img
                  src={
                    story.user.profilePic
                    ||
                    "https://placehold.co/100"
                  }
                  alt=""
                  className={`
                    w-16
                    h-16
                    rounded-full
                    border-2
                    object-cover
                     ${
                isMine
                  ? "border-green-500"
                  : hasSeen
                  ? "border-gray-500"
                  : "border-pink-500"
              }
                  `}
                />

                <p
                  className="
                    text-xs
                    text-white
                    mt-1
                  "
                >

                  {
                    isMine
                      ? "Your Story"
                      : story.user.username
                  }

                </p>

              </div>

            );

          }
        )
      }

    </div>

  );

};

export default StoriesBar;