import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { generateToken } from "./firebase";
import {
  Mail,
  Lock,
} from "lucide-react";
import { toast } from 'react-toastify';
import useAuthStore from "./useAuthStore";
import cookies from 'js-cookie'

import API from "./axios";

const Login = () => {

  const [formData, setFormData] = useState({
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
        "/auth/login",
        formData
      );
      if (res.data.success === true) {
        toast.success(res.data.message);
        const token =
          await generateToken();

        if (token) {

          await API.post(
            "/auth/save-fcm",
            { token: token }
          );

        }
        nav('/feed');
        setUser(res.data.user);
        cookies.set("userId", res.data.user._id, { expires: 1 });
      }
      else {
        toast.error(res.data.message)
      }

      console.log(res.data);

    } catch (error) {

      toast.error(
        error.response?.data
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-6 relative overflow-hidden">

      {/* BACKGROUND LIGHTS */}

      <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-violet-700/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-indigo-700/20 rounded-full blur-3xl"></div>

      {/* LOGIN CARD */}

      <div className="relative z-10 w-full max-w-lg bg-[#111115]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-10 shadow-[0_0_40px_rgba(139,92,246,0.15)]">

        {/* HEADER */}

        <div className="text-center mb-10">

          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="text-gray-400 mt-3 text-base">
            Login to continue
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* EMAIL */}

          <div className="flex items-center bg-[#1A1A22] border border-[#2A2A35] rounded-2xl px-5">

            <Mail
              size={20}
              className="text-gray-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full bg-transparent px-4 py-5 text-white outline-none placeholder:text-gray-500 text-base"
            />

          </div>

          {/* PASSWORD */}

          <div className="flex items-center bg-[#1A1A22] border border-[#2A2A35] rounded-2xl px-5">

            <Lock
              size={20}
              className="text-gray-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full bg-transparent px-4 py-5 text-white outline-none placeholder:text-gray-500 text-base"
            />

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg hover:opacity-90 transition-all duration-300"
          >
            {
              loading
                ? "Loading..."
                : "Login"
            }
          </button>

        </form>

        {/* FOOTER */}

        <p className="text-center text-gray-400 mt-8 text-sm">

          Don’t have an account?

          <Link
            to="/signup"
            className="text-violet-400 ml-2 hover:text-violet-300"
          >
            Sign Up
          </Link>

        </p>

      </div>
    </div>
  );
};

export default Login;