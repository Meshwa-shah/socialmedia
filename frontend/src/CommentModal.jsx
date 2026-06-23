import {
    useEffect,
    useState,
} from "react";
import { formatDistanceToNow } from "date-fns";
import API from "./axios";
import socket from "./socket/socket";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const CommentModal = ({
    postId,
    onClose,
}) => {

    const currentUserId =
        Cookies.get("userId");

    const [comments, setComments] =
        useState([]);

    const [text, setText] =
        useState("");
    const [disabled, setdisabled] = useState(false);
    const nav = useNavigate();

    useEffect(() => {

        socket.on(
            "new_comment",
            (data) => {

                if (
                    data.postId ===
                    postId
                ) {

                    setComments(
                        (prev) => [
                            ...prev,
                            data.comment,
                        ]
                    );

                }

            }
        );

        return () => {

            socket.off(
                "new_comment"
            );

        };

    }, [postId]);

    const fetchComments =
        async () => {

            const res =
                await API.get(
                    `/posts/comments/${postId}`
                );
            if (res.data.success === true) {

                setComments(
                    res.data.comments
                );
            }
            else {
                toast.error("something went wrong");
            }

        };

    useEffect(() => {

        fetchComments();

    }, []);

    const addComment =
        async () => {
            try {
                setdisabled(true);
                if (!text.trim())
                    return;

                const res =
                    await API.post(
                        `/posts/comment/${postId}`,
                        { text }
                    );
                if (res.data.success === true) {
                    toast.success("comment added")
                }
                else {
                    toast.error(res.data.message);
                }

                setText("");
            }
            catch (err) {
                toast.error(err);
            }
            finally {
                setdisabled(false);
            }
        };

    const deleteComment =
        async (commentId) => {

            try {

                const res = await API.delete(
                    `/posts/comment/${postId}/${commentId}`
                );

                setComments(
                    prev =>
                        prev.filter(
                            comment =>
                                comment._id !==
                                commentId
                        )
                );
                if (res.data.success === true) {
                    toast.success("comment deleted");
                }
                else {
                    toast.error("something went wrong");
                }

            } catch (error) {

                console.log(error);

            }

        };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

            <div className="bg-[#111115] w-full max-w-lg rounded-3xl p-5  border border-gray-600">

                <h2 className="text-white text-xl mb-4">
                    Comments
                </h2>

                <div className="h-[230px] overflow-y-scroll no-scrollbar">

                    {comments.map(
                        (comment) => (

                            <div
                                key={
                                    comment._id
                                }
                                onClick={() => nav(`/profile/${comment.user._id}`)}
                                className="flex gap-3 mb-4"
                            >

                                <img
                                    src={
                                        comment.user
                                            ?.profilePic
                                    }
                                    alt=""
                                    className="w-10 h-10 rounded-full"
                                />

                                <div>

                                    <p className="text-white">

                                        <span className="font-semibold">

                                            {
                                                comment
                                                    .user
                                                    ?.username
                                            }

                                        </span>{" "}

                                        {comment.text}

                                    </p>
                                    <div className="flex gap-1.5">
                                    {
                                        comment.user?._id ===
                                        currentUserId && (
                                            <button
                                                onClick={() =>
                                                    deleteComment(
                                                        comment._id
                                                    )
                                                }
                                                className="
        text-red-500
        text-sm
      "
                                            >
                                                Delete
                                            </button>

                                        )
                                    }
                                <p className="text-violet-300 text-sm">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p></div>
                                </div>

                            </div>

                        )
                    )}

                </div>

                <div className="flex gap-2 mt-4">

                    <input
                        value={text}
                        onChange={(e) =>
                            setText(
                                e.target.value
                            )
                        }
                        placeholder="Add comment..."
                        className="flex-1 bg-[#1A1A22] text-white rounded-xl px-4 py-3 outline-none"
                    />

                    <button
                        onClick={
                            addComment
                        }
                        disabled={disabled}
                        className="bg-violet-600 px-5 rounded-xl text-white"
                    >
                        Send
                    </button>

                </div>

                <button
                    onClick={onClose}
                    className="mt-4 text-gray-400"
                >
                    Close
                </button>

            </div>

        </div>
    );
};

export default CommentModal;