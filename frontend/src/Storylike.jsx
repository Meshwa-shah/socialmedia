import {
    useEffect,
    useState,
} from "react";
import Cookies from 'js-cookie';
import API from "./axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Storylike = ({
    postId,
    onClose,
}) => {
    const currentUserId = Cookies.get("userId");

    const [likes, setlikes] = useState([]);
    const nav = useNavigate();



    const fetchlikes =
        async () => {

            const res =
                await API.get(
                    `/status/${postId}/likes`
                );
            if (res.data.success === true) {

                setlikes(
                    res.data.likes
                );
            }
            else {
                toast.error("something went wrong");
            }

        };

    useEffect(() => {

        fetchlikes();

    }, []);

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

            <div className="bg-[#111115] w-full max-w-lg rounded-3xl p-5  border border-gray-600">

                <h2 className="text-white text-xl mb-4">
                    Liked by
                </h2>

                <div className="h-[230px] overflow-y-scroll no-scrollbar">

                    {likes.map(
                        (comment) => (

                            <div
                                key={
                                    comment._id
                                }
                                onClick={() => nav(`/profile/${comment._id}`)}
                                className="flex gap-3 mb-4 items-center"
                            >

                                <img
                                    src={
                                        comment?.profilePic
                                    }
                                    alt=""
                                    className="w-10 h-10 rounded-full"
                                />

                                <div>

                                    <p className="text-white">

                                        <span className="font-semibold">

                                            {
                                                comment
                                                    ?.username
                                            }

                                        </span>



                                    </p>


                                </div>

                            </div>

                        )
                    )}

                </div>
                <button
                    onClick={onClose}
                    className="mt-4 text-gray-400"
                >
                    Close
                </button>

            </div>

        </div>
    )
}

export default Storylike