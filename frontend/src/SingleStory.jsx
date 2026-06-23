import { useEffect, useState, useRef } from "react";

import {
    useParams,
    useNavigate,
} from "react-router-dom";

import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import Storylike from "./Storylike";
import Storyview from "./Storyview";
import { formatDistanceToNow } from "date-fns";

import API from "./axios";

import {
    Heart,
    Trash2,
    ChevronLeft,
    ChevronRight,
    HeartIcon, Eye
} from "lucide-react";

const SingleStory = () => {

    const { storyId } =
        useParams();

    const [paused,
        setPaused] =
        useState(false);

    const videoRef =
        useRef(null);

    const nav =
        useNavigate();

    const currentUserId =
        Cookies.get("userId");

    const [stories, setStories] =
        useState([]);

    const [current, setCurrent] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    console.log(stories);

    const [disabled, setdisabled] = useState(false);

    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedPost2, setSelectedPost2] = useState(null);



    const gradients = [
        "from-pink-500 via-purple-500 to-indigo-600",
        "from-orange-500 via-red-500 to-pink-500",
        "from-cyan-500 via-blue-500 to-indigo-600",
        "from-emerald-500 via-green-500 to-teal-600",
        "from-violet-500 via-fuchsia-500 to-pink-500",
    ];

    const gradient =
        gradients[
        current %
        gradients.length
        ];



    useEffect(() => {

        const fetchStories =
            async () => {

                try {

                    const res =
                        await API.get(
                            `/status/single/${storyId}`
                        );

                    if (
                        res.data.success === true
                    ) {

                        setStories(
                            [res.data.story]
                        );

                    } else {
                        toast.error(res.data.message);
                        nav('/notification')
                    }

                } catch (error) {

                    toast.error(error);

                } finally {

                    setLoading(false);

                }

            };

        fetchStories();

    }, [storyId]);

    const story =
        stories[current];

    const isMine =
        story?.user?._id ===
        currentUserId;


    const isLiked =
        story?.likes?.some(
            (like) =>
                (like._id || like)
                    .toString() ===
                currentUserId
        );

    // MARK VIEWED

    useEffect(() => {

        if (
            !story ||
            isMine
        ) return;

        API.put(
            `/status/view/${story._id}`
        );

    }, [story]);

    // AUTO NEXT FOR IMAGES

    useEffect(() => {

        if (
            !story ||
            paused
        ) return;

        if (
            story.media?.mediaType ===
            "video"
        ) return;

        const timer =
            setTimeout(() => {

                if (
                    current <
                    stories.length - 1
                ) {

                    setCurrent(
                        (prev) =>
                            prev + 1
                    );

                } else {

                    nav("/feed");

                }

            }, 5000);

        return () =>
            clearTimeout(timer);

    }, [
        story,
        paused,
        current,
        stories.length,
        nav
    ]);

    const handleHoldStart =
        () => {

            setPaused(true);

            if (
                story?.media
                    ?.mediaType ===
                "video"
            ) {

                videoRef.current?.pause();

            }

        };

    const handleHoldEnd =
        () => {

            setPaused(false);

            if (
                story?.media
                    ?.mediaType ===
                "video"
            ) {

                videoRef.current?.play();

            }

        };

    // LIKE

    const handleLike =
        async () => {

            try {
                setdisabled(true)
                await API.put(
                    `/status/like/${story._id}`
                );

                const updated =
                    [...stories];

                const likes =
                    updated[current]
                        .likes;

                const alreadyLiked =
                    likes.includes(
                        currentUserId
                    );

                if (
                    alreadyLiked
                ) {

                    updated[current]
                        .likes =
                        likes.filter(
                            (id) =>
                                id !==
                                currentUserId
                        );

                } else {

                    updated[current]
                        .likes.push(
                            currentUserId
                        );

                }

                setStories(
                    updated
                );

            } catch (error) {

                toast.error(error);

            }
            finally {
                setdisabled(false)
            }

        };

    // DELETE

    const handleDelete =
        async () => {

            try {

                await API.delete(
                    `/status/${story._id}`
                );

                const updated =
                    stories.filter(
                        (s) =>
                            s._id !==
                            story._id
                    );

                if (
                    updated.length === 0
                ) {

                    nav("/feed");

                    return;

                }

                setStories(
                    updated
                );

                setCurrent(0);

            } catch (error) {

                console.log(error);

            }

        };

    if (
        loading ||
        !story
    ) {

        return (

            <div
                className="
        h-screen
        bg-black
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

        <div
            className="
       h-[100dvh]
      bg-black
      relative
      overflow-hidden
    "
            onMouseDown={
                handleHoldStart
            }

            onMouseUp={
                handleHoldEnd
            }

            onTouchStart={
                handleHoldStart
            }

            onTouchEnd={
                handleHoldEnd
            }
        >


            {/* PROGRESS */}

            <div
                className="
        absolute
        top-3
        left-3
        right-3
        flex
        gap-1
        z-50
      "
            >

                {
                    stories.map(
                        (_, index) => (

                            <div
                                key={index}
                                className="
                flex-1
                h-1
                bg-white/20
                rounded-full
                overflow-hidden
              "
                            >

                                <div
                                    className={`
                  h-full
                  bg-white
                  ${index <= current
                                            ? "w-full"
                                            : "w-0"
                                        }
                `}
                                />

                            </div>

                        )
                    )
                }

            </div>

            {/* HEADER */}

            <div
                className="
        absolute
        top-8
        left-4
        right-4
        z-50
        flex
        items-center
        gap-3
      "
            >

                <img
                    src={
                        story.user
                            ?.profilePic ||
                        "https://placehold.co/100"
                    }
                    alt=""
                    className="
          w-10
          h-10
          rounded-full
          object-cover
        "
                />
                <div>

                <p className="text-white font-semibold">

                    {
                        isMine
                            ? "Your Story"
                            : story.user
                                ?.username
                    }

                </p>

                <p className="text-white font-semibold">
                     {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
                </p>
                </div>
            </div>

            {/* MEDIA */}

            {
                story.media
                    ?.mediaType ===
                    "video"

                    ? (

                        <video
                            src={
                                story.media.url
                            }
                            controls
                            autoPlay
                            className="
              w-full
              h-full
              object-contain
            "
                        />

                    )

                    : (

                        <img
                            src={
                                story.media.url
                            }
                            alt=""
                            className="
              w-full
              h-full
              object-contain
            "
                        />

                    )
            }

            {/* TEXT */}

            {
                story.text && (

                    <div
                        className={`
        absolute
        inset-0
        ${story.media.url.length > 0 ? "" : ` bg-gradient-to-br
        ${gradient}`}
        flex
        items-center
        justify-center
        p-8
      `}
                    >

                        <div
                            className="
          
          px-10
          py-8
          max-w-3xl
          relative
        "
                        >

                            <h1
                                className={`
    absolute
    text-3xl
    font-bold
    md:text-6xl
  `}
                                style={{
                                    left:
                                        `${story.textPosition?.x}px`,
                                    top:
                                        `${story.textPosition?.y}px`,
                                    color:
                                        `${story.textcolor}`
                                }}

                            >
                                {story.text}
                            </h1>
                            {
                                story.taggedUsers?.map(
                                    (user) => (
                                        <span key={user._id} 
                                        style={{ color:`${story.textcolor}`}}
                                        className="
            text-center
            text-3xl
            md:text-6xl
            font-bold underline bg-black/10 p-3 rounded-2xl backdrop-blur-2xl" onClick={() => nav(`/profile/${user._id}`)}>
                                            @{user.username}
                                        </span>
                                    )
                                )
                            }


                        </div>

                    </div>
                )
            }

            {/* PREV */}

            <button
                onClick={() => {

                    if (
                        current > 0
                    ) {

                        setCurrent(
                            current - 1
                        );

                    }

                }}
                className="
        absolute
        left-4
        top-1/2
        z-50
        text-white
      "
            >

                <ChevronLeft
                    size={40}
                />

            </button>

            {/* NEXT */}

            <button
                onClick={() => {

                    if (
                        current <
                        stories.length - 1
                    ) {

                        setCurrent(
                            current + 1
                        );

                    } else {

                        nav("/feed");

                    }

                }}
                className="
        absolute
        right-4
        top-1/2
        z-50
        text-white
      "
            >

                <ChevronRight
                    size={40}
                />

            </button>

            {/* BOTTOM */}

            <div
                className="
        absolute
        bottom-6
       
        right-10
        flex
        justify-center
      "
            >

                {
                    isMine

                        ? (
                            <div className="flex gap-5">
                                <button
                                    onClick={
                                        handleDelete
                                    }
                                    className="
                bg-red-500
                p-4
                rounded-full
              "
                                >

                                    <Trash2 />

                                </button>

                                <button
                                    onClick={
                                        () => setSelectedPost(stories[current])
                                    }
                                    className="
                bg-white
                text-black
                p-4
                rounded-full
              "
                                >

                                    <HeartIcon />

                                </button>
                                <button
                                    onClick={
                                        () => setSelectedPost2(stories[current])
                                    }
                                    className="
                bg-white
                text-black
                p-4
                rounded-full
              "
                                >

                                    <Eye />

                                </button>
                            </div>
                        )

                        : (

                            <button
                                disabled={disabled}
                                onClick={
                                    handleLike
                                }
                                className="
                bg-white
                p-4
                rounded-full
                text-red-500
              "
                            >

                                <Heart
                                    fill={isLiked ? "#fb2c36" : "none"}
                                />

                            </button>

                        )
                }


            </div>
            {
                selectedPost && (

                    <Storylike
                        postId={
                            selectedPost._id
                        }
                        onClose={() =>
                            setSelectedPost(null)
                        }
                    />

                )
            }

            {
                selectedPost2 && (

                    <Storyview
                        postId={
                            selectedPost2._id
                        }
                        onClose={() =>
                            setSelectedPost2(null)
                        }
                    />

                )
            }

        </div>

    );

};

export default SingleStory;

