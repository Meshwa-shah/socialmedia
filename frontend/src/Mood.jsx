import React from 'react'
import {
    useEffect,
    useState
} from "react";

import API from "./axios";

import {
    Heart,
    HandHeart,
    Flower2,
    Sparkles
} from "lucide-react";
import { toast } from "react-toastify";
import cookies from 'js-cookie'
import { useNavigate, useParams } from 'react-router-dom';



const reactions = [
    {
        type: "care",
        label: "Care",
        icon: <Heart size={18} />
    },
    {
        type: "hug",
        label: "Hug",
        icon: <HandHeart size={18} />
    },
    {
        type: "support",
        label: "Support",
        icon: <Flower2 size={18} />
    },
    {
        type: "strength",
        label: "Strength",
        icon: <Sparkles size={18} />
    }
];



const Mood = () => {
    const [selectedMood,
        setSelectedMood] =
        useState(null);

    const [note,
        setNote] =
        useState("");

    const [moods,
        setMoods] =
        useState([]);
    console.log(moods)

    const currentUserId = cookies.get("userId");
    const nav = useNavigate();
    const { mood } = useParams();

    const fetchMoods =
        async () => {

            try {

                const res =
                    await API.get(
                        `mood/${mood}`
                    );

                if (
                    res.data.success
                ) {
                    console.log(res.data.mood)
                    setMoods([res.data.mood]);

                } else {
                    toast.error(res.data.message);
                    nav('/feed');
                }

            } catch (error) {

                console.log(error);

            }

        };

    const postMood =
        async () => {

            if (!selectedMood)
                return;

            try {

                const res =
                    await API.post(
                        "/mood/create",
                        {
                            mood:
                                selectedMood.mood,
                            emoji:
                                selectedMood.emoji,
                            note
                        }
                    );

                if (
                    res.data.success
                ) {

                    setSelectedMood(
                        null
                    );

                    setNote("");

                    fetchMoods();
                    toast.success("mood updated")

                } else {
                    toast.error("something went wrong")
                }

            } catch (error) {

                console.log(error);

            }

        };

    const reactToMood =
        async (
            moodId,
            type
        ) => {

            try {

                const res = await API.post(
                    `/mood/react/${moodId}`,
                    { type: type }
                );
                if (res.data.success === true) {
                    toast.success("reaction added");
                    fetchMoods();

                }
                else {
                    toast.error("something went wrong")
                }

            } catch (error) {

                console.log(error);

            }

        };

    useEffect(() => {

        fetchMoods();

    }, []);
//min-h-screen
    return (
        <div
            className="
            min-h-screen
        bg-[#09090B]
        text-white
        px-4
        py-8
      "
        >
            <div
                className="
              px-6
              py-5
              border-b
              border-white/5 text-center
            "
            >

                <h1
                    className="
                text-4xl
                font-bold
                bg-gradient-to-r
                from-violet-400
                to-indigo-400
                bg-clip-text
                text-transparent
              "
                >
                    Mood 🌈
                </h1>

            </div>


            <div
                className="
          max-w-3xl
          mx-auto
          space-y-8
        "
            >{
                    moods.map(
                        (mood) => (

                            <div
                                key={
                                    mood._id
                                }
                                className="
                  bg-[#111115]
                  rounded-3xl
                  border
                  border-white/5
                  p-6
                "
                            >

                                <div
                                    className="
                    flex
                    items-center
                    gap-4
                  "
                                >

                                    <img
                                        src={
                                            mood.user
                                                ?.profilePic
                                        }
                                        alt=""
                                        className="
                      w-16
                      h-16
                      rounded-full
                    "
                                    />

                                    <div>

                                        <h2
                                            className="
                        text-2xl
                        font-bold
                      "
                                        >

                                            Feeling{" "}
                                            {
                                                mood.mood
                                            }{" "}
                                            {
                                                mood.emoji
                                            }

                                        </h2>

                                        <p
                                            className="
                        text-gray-400
                      "
                                        >

                                            {
                                                mood.user
                                                    ?.username
                                            }

                                        </p>

                                    </div>

                                </div>

                                {
                                    mood.note && (

                                        <p
                                            className="
                        mt-6
                        text-lg
                        text-center
                        text-gray-300
                      "
                                        >

                                            {
                                                mood.note
                                            }

                                        </p>

                                    )
                                }

                                <div
                                    className="
                    mt-6
                    grid
                    grid-cols-2
                    md:grid-cols-4
                    gap-3
                  "
                                >

                                    {
                                        reactions.map(
                                            (reaction) => {

                                                const hasReacted =
                                                    mood.reactions?.find(
                                                        (r) =>
                                                            r.user._id ===
                                                            currentUserId
                                                    );

                                                const isMyReaction =
                                                    hasReacted?.type ===
                                                    reaction.type;

                                                return (

                                                    <button
                                                        key={
                                                            reaction.type
                                                        }

                                                        disabled={
                                                            !!hasReacted
                                                        }

                                                        onClick={() =>
                                                            reactToMood(
                                                                mood._id,
                                                                reaction.type
                                                            )
                                                        }

                                                        className={`
            flex
            items-center
            justify-center
            gap-2
            p-3
            rounded-2xl
            transition
            ${isMyReaction
                                                                ? "bg-violet-600 text-white"
                                                                : "bg-[#1A1A1F]"
                                                            }
            ${hasReacted
                                                                ? "opacity-80"
                                                                : "hover:bg-violet-600"
                                                            }
          `}
                                                    >

                                                        {reaction.icon}

                                                        {reaction.label}

                                                    </button>

                                                );

                                            }
                                        )
                                    }
                                    <button
                                        onClick={() =>
                                            nav(
                                                `/moods/reactions/${mood._id}`
                                            )
                                        }
                                        className="
    mt-4
    text-violet-400
    text-sm
  "
                                    >
                                        See reactions
                                    </button>


                                </div>

                            </div>

                        )
                    )
                }

                {/* CREATE MOOD */}



            </div>
        </div>
    )
}

export default Mood