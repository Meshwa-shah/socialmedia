import {
    useState,
    useEffect,
} from "react";

import API from "./axios";
import { toast } from 'react-toastify';

import {
    useNavigate,
} from "react-router-dom";

const EditProfile = () => {

    const nav =
        useNavigate();

    const [username,
        setUsername] =
        useState("");

    const [bio,
        setBio] =
        useState("");

    const [profilePic,
        setProfilePic] =
        useState(null);

    useEffect(() => {

        const loadProfile =
            async () => {

                const res =
                    await API.get(
                        "/users/me"
                    );
                if (res.data.success === true) {

                    setUsername(
                        res.data.user.username
                    );
                }
                else {
                    toast.error("something went wrong");
                }

                setBio(
                    res.data.user.bio || ""
                );

            };

        loadProfile();

    }, []);

    const handleSubmit =
        async () => {

            const formData =
                new FormData();

            formData.append(
                "username",
                username
            );

            formData.append(
                "bio",
                bio
            );

            if (profilePic) {

                formData.append(
                    "profilePic",
                    profilePic
                );

            }

            const res =
                await API.put(
                    "/users/edit-profile",
                    formData
                );

            if (
                res.data.success === true
            ) {

                nav("/profile");

            } else {
                toast.error("something went wrong");
            }

        };

    return (

        <div className=" bg-[#09090B] flex justify-center p-6">

            <div className="w-full max-w-xl bg-[#111115] rounded-3xl p-6">

                <h1 className="text-3xl text-white font-bold mb-6">
                    Edit Profile
                </h1>

                <input
                    value={username}
                    onChange={(e) =>
                        setUsername(
                            e.target.value
                        )
                    }
                    placeholder="Username"
                    className="w-full mb-4 bg-[#1A1A22] text-white p-4 rounded-xl"
                />

                <textarea
                    value={bio}
                    onChange={(e) =>
                        setBio(
                            e.target.value
                        )
                    }
                    placeholder="Bio"
                    className="w-full h-32 bg-[#1A1A22] text-white p-4 rounded-xl"
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setProfilePic(
                            e.target.files[0]
                        )
                    }
                    className="text-white mt-4"
                />

                <button
                    onClick={handleSubmit}
                    className="w-full mt-6 bg-violet-600 text-white py-4 rounded-xl"
                >
                    Save Changes
                </button>

            </div>

        </div>

    );

};

export default EditProfile;