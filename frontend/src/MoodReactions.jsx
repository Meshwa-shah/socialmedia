import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";
import {toast} from 'react-toastify';

import API from "./axios";

const reactionEmoji = {
  care: "❤️",
  hug: "🫂",
  support: "🌼",
  strength: "✨"
};

const MoodReactions = () => {

  const { moodId } =
    useParams();

  const [reactions,
    setReactions] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const fetchReactions =
    async () => {

      try {

        const res =
          await API.get(
            `/mood/reactions/${moodId}`
          );

        if (
          res.data.success
        ) {

          setReactions(
            res.data.reactions
          );

        }

      } catch (error) {

        toast.error(error);

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchReactions();

  }, []);

  if (loading) {

    return (
      <div
        className="
          min-h-screen
          bg-[#09090B]
          text-white
          flex
          items-center
          justify-center
        "
      >
        Loading...
      </div>
    );

  }

  return (

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
            mb-6
          "
        >
          Mood Reactions
        </h1>

        {
          reactions.length === 0 ? (

            <p
              className="
                text-gray-400
              "
            >
              No reactions yet
            </p>

          ) : (

            <div
              className="
                space-y-4
              "
            >

              {
                reactions.map(
                  (
                    reaction,
                    i
                  ) => (

                    <div
                      key={i}
                      className="
                        flex
                        items-center
                        gap-4
                        p-4
                        rounded-2xl
                        bg-[#111115]
                      "
                    >

                      <img
                        src={
                          reaction.user
                            ?.profilePic
                        }
                        alt=""
                        className="
                          w-12
                          h-12
                          rounded-full
                          object-cover
                        "
                      />

                      <div>

                        <p
                          className="
                            font-semibold
                          "
                        >
                          {
                            reaction.user
                              ?.username
                          }
                        </p>

                        <p
                          className="
                            text-gray-400
                          "
                        >
                          {
                            reactionEmoji[
                              reaction.type
                            ]
                          }{" "}
                          {
                            reaction.type
                          }
                        </p>

                      </div>

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

export default MoodReactions;