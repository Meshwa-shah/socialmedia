import React from 'react'
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import CommentModal from "./CommentModal";
import Likes from './Likes';
import { Swiper, SwiperSlide } from "swiper/react";
import { formatDistanceToNow } from "date-fns";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
    Heart,
    MessageCircle,
    Send,
    Trash2,
} from "lucide-react";

import API from "./axios";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Posts = () => {

    const currentUserId =
        Cookies.get("userId");

    const [post, setPost] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [disabled, setdisabled] = useState(false);

    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedPost2, setSelectedPost2] = useState(null);
    const { id } = useParams();
    const nav = useNavigate();

    const fetchPosts =
        async () => {

            try {

                const res =
                    await API.get(
                        `/posts/get/${id}`
                    );

                if (
                    res.data.success === true
                ) {

                    setPost(
                        res.data.post
                    );


                } else {
                    toast.error(res.data.message)
                }

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

    useEffect(() => {

        fetchPosts();

    }, []);

    const handleLike =
        async (postId) => {

            try {
                setdisabled(true)
                const res =
                    await API.put(
                        `/posts/like/${postId}`
                    );

                if (
                    res.data.success === true
                ) {

                    fetchPosts();

                }

            } catch (error) {

                console.log(error);

            }
            finally {
                setdisabled(false)
            }

        };

    const handleDelete =
        async (postId) => {

            try {
                setdisabled(true)
                const res =
                    await API.delete(
                        `/posts/${postId}`
                    );

                if (
                    res.data.success
                ) {

                    toast.success(
                        "Post deleted"
                    );

                    setPost(
                        (prev) =>
                            prev.filter(
                                (post) =>
                                    post._id !==
                                    postId
                            )
                    );

                }

            } catch (error) {

                console.log(error);

                toast.error(
                    "Failed to delete post"
                );

            }
            finally {
                setdisabled(false);
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
        <div className=" bg-[#09090B] flex justify-center px-4 py-8">

            <div className="w-full max-w-2xl space-y-8">

                {post.map(
                    (post) => {

                        const isLiked =
                            post.likes?.some(
                                (id) =>
                                    id.toString() ===
                                    currentUserId
                            );

                        return (

                            <div
                                key={post._id}
                                className="bg-[#111115]/80 border border-violet-900 rounded-[28px] overflow-hidden backdrop-blur-xl"
                            >

                                {/* HEADER */}

                                <div className="flex justify-between items-center p-5">

                                    <div className="flex items-center gap-3">

                                        <img
                                            src={
                                                post.user
                                                    ?.profilePic ||
                                                "https://placehold.co/100"
                                            }
                                            onClick={() => nav(`/profile/${post.user._id}`)}
                                            alt=""
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>

                                            <h2 className="text-white font-semibold">
                                                {
                                                    post.user
                                                        ?.username
                                                }
                                            </h2>
                                            <h2 className="text-gray-400 font-semibold">
                                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                            </h2>
                                        </div>

                                    </div>

                                    {post.user
                                        ?._id ===
                                        currentUserId && (

                                            <button
                                                disabled={disabled}
                                                onClick={() =>
                                                    handleDelete(
                                                        post._id
                                                    )
                                                }
                                                className="text-red-500"
                                            >

                                                <Trash2
                                                    size={20}
                                                />

                                            </button>

                                        )}

                                </div>

                                {/* MEDIA */}
                                <Swiper
                                    modules={[
                                        Navigation,
                                        Pagination,
                                    ]}
                                    navigation={
                                        post.media.length > 1
                                    }
                                    pagination={{
                                        clickable: true,
                                    }}
                                    className="w-full"
                                >

                                    {post.media?.map(
                                        (item, index) => (

                                            <SwiperSlide
                                                key={index}
                                            >

                                                {item.mediaType ===
                                                    "image" ? (

                                                    <img
                                                        src={item.url}
                                                        alt=""
                                                        className="w-full max-h-[700px] object-cover"
                                                    />

                                                ) : (

                                                    <video
                                                        src={item.url}
                                                        controls
                                                        className="w-full max-h-[700px]"
                                                    />

                                                )}

                                            </SwiperSlide>

                                        )
                                    )}

                                </Swiper>

                                {/* ACTIONS */}

                                <div className="p-5">

                                    <div className="flex items-center gap-5 mb-3">

                                        <button
                                            disabled={disabled}
                                            onClick={() =>
                                                handleLike(
                                                    post._id
                                                )
                                            }
                                            className={
                                                isLiked
                                                    ? "text-red-500"
                                                    : "text-white"
                                            }
                                        >

                                            <Heart
                                                size={26}
                                                fill={
                                                    isLiked
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                            />

                                        </button>

                                        <button className="text-white flex" onClick={() => setSelectedPost(post)}>

                                            <MessageCircle
                                                size={26}
                                            />

                                        </button>

                                        <button className="text-white" onClick={() => nav(`/share-post/${post._id}`)}>

                                            <Send
                                                size={24}
                                            />

                                        </button>

                                    </div>
                                    <div className="flex gap-2">

                                        <p className="text-sm text-gray-300 mb-3" onClick={() => setSelectedPost2(post)}>

                                            {
                                                post.likes
                                                    ?.length
                                            }{" "}
                                            likes

                                        </p>

                                        <span className="text-gray-300 text-sm">
                                            {
                                                post.comments?.length || 0
                                            } comments
                                        </span>
                                    </div>

                                    <p className="text-gray-300">

                                        <span className="font-semibold text-white mr-2">

                                            {
                                                post.user
                                                    ?.username
                                            }

                                        </span>

                                        {
                                            post.caption
                                        }

                                    </p>

                                </div>

                            </div>

                        );

                    }
                )}

            </div>
            {
                selectedPost && (

                    <CommentModal
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

                    <Likes
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
    )
}

export default Posts