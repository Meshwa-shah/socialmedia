import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import API from "./axios";

import { Image } from "lucide-react";

const ProfileSetup = () => {

const nav = useNavigate();


    const [image, setImage] =
        useState(null);

    const [preview, setPreview] =
        useState("");

    const [bio, setBio] =
        useState("");

    const [loading, setLoading] =
        useState(false);

   

    // IMAGE CHANGE
    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setImage(file);

        setPreview(
            URL.createObjectURL(file)
        );
    };

    // SUBMIT
    const handleSubmit = async () => {

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append(
                "profilePic",
                image
            );
            formData.append("bio", bio);

            const res = await API.put(
                "/auth/profile-picture",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );
            if(res.data.success === true){
                toast.success(res.data.message);
                nav('/feed');
            }
            else{
                toast.error("something went wrong");
            }

            console.log(res.data);

        } catch (error) {

            toast.error(error);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="h-screen bg-[#09090B] flex items-center justify-center px-6 relative overflow-hidden">

            {/* GLOW */}

            <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-violet-700/20 rounded-full blur-3xl"></div>

            <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-indigo-700/20 rounded-full blur-3xl"></div>

            {/* CARD */}

            <div className="relative z-10 w-full max-w-lg bg-[#111115]/80 backdrop-blur-xl border border-white/10 rounded-[28px] p-8">

                {/* TITLE */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-white">
                        Setup Your Profile
                    </h1>

                    <p className="text-gray-400 mt-2 text-sm">
                        Add a profile picture and bio
                    </p>

                </div>

                {/* PROFILE IMAGE */}

                <div className="flex flex-col items-center mb-6">

                    <label className="cursor-pointer relative">

                        <img
                            src={
                                preview ||
                                "https://placehold.co/150x150"
                            }
                            alt=""
                            className="w-28 h-28 rounded-full object-cover border-4 border-violet-500"
                        />

                        <div className="absolute bottom-0 right-0 bg-violet-600 p-2 rounded-full">

                            <Image size={18} />

                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImage}
                        />

                    </label>

                </div>

                {/* BIO */}

                <textarea
                    placeholder="Write your bio..."
                    value={bio}
                    onChange={(e) =>
                        setBio(e.target.value)
                    }
                    className="w-full h-28 bg-[#1A1A22] border border-[#2A2A35] rounded-2xl p-4 text-white outline-none resize-none placeholder:text-gray-500"
                />

                {/* BUTTON */}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold"
                >
                    {
                        loading
                            ? "Saving..."
                            : "Continue"
                    }
                </button>

            </div>
        </div>
    );
};

export default ProfileSetup;