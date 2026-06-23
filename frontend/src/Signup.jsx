import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cookies from "js-cookie";
import { generateToken } from "./firebase";
import {
  User,
  Mail,
  Lock,
} from "lucide-react";
import { toast } from 'react-toastify';
import useAuthStore from "./useAuthStore";


import API from "./axios";

const Signup = () => {

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const nav = useNavigate();
  const { setUser } = useAuthStore();

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const res = await API.post(
        "/auth/register",
        formData
      );
      if (res.data.success === true) {
        const token =
          await generateToken();

        if (token) {

          await API.post(
            "/auth/save-fcm",
            { token: token }
          );

        }
        nav('/setup-profile')
        toast.success(res.data.message);
        cookies.set("userId", res.data.user._id, { expires: 1 });
        setUser(res.data.user);
        console.log(res.data.user);
      }
      else {
        toast.error(res.data.message);
      }

      console.log(res.data);

    } catch (error) {

      console.log(
        error.response?.data
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="h-screen bg-[#09090B] flex items-center justify-center px-6 relative overflow-hidden">

      {/* BACKGROUND LIGHTS */}

      <div className="absolute top-[-150px] left-[-100px] w-[350px] h-[350px] bg-violet-700/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] bg-indigo-700/20 rounded-full blur-3xl"></div>

      {/* SIGNUP CARD */}

      <div className="relative z-10 w-full max-w-lg bg-[#111115]/80 backdrop-blur-xl border border-white/10 rounded-[28px] p-7 md:p-8 shadow-[0_0_40px_rgba(139,92,246,0.15)]">

        {/* HEADER */}

        <div className="text-center mb-7">

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Create Account
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            Join the community
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* FULL NAME */}

          <div className="flex items-center bg-[#1A1A22] border border-[#2A2A35] rounded-2xl px-5">

            <User
              size={18}
              className="text-gray-500"
            />

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-gray-500 text-sm"
            />

          </div>

          {/* USERNAME */}

          <div className="flex items-center bg-[#1A1A22] border border-[#2A2A35] rounded-2xl px-5">

            <User
              size={18}
              className="text-gray-500"
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-gray-500 text-sm"
            />

          </div>

          {/* EMAIL */}

          <div className="flex items-center bg-[#1A1A22] border border-[#2A2A35] rounded-2xl px-5">

            <Mail
              size={18}
              className="text-gray-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-gray-500 text-sm"
            />

          </div>

          {/* PASSWORD */}

          <div className="flex items-center bg-[#1A1A22] border border-[#2A2A35] rounded-2xl px-5">

            <Lock
              size={18}
              className="text-gray-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-gray-500 text-sm"
            />

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-base hover:opacity-90 transition-all duration-300"
          >
            {
              loading
                ? "Loading..."
                : "Create Account"
            }
          </button>

        </form>

        {/* FOOTER */}

        <p className="text-center text-gray-400 mt-6 text-sm">

          Already have an account?

          <Link
            to="/login"
            className="text-violet-400 ml-2 hover:text-violet-300"
          >
            Login
          </Link>

        </p>

      </div>
    </div>
  );
};

export default Signup;