"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      await axios.post("/api/users/login", user);
      toast.success("Login successful 🎉");
      // Use window.location to force a full navigation so Header re-mounts and fetches user
      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
  }, [user]);

return (
  <>
    <Toaster position="top-center" />

    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />

      <div
        className="
          relative
          w-full
          max-w-6xl
          rounded-3xl
          overflow-hidden
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-xl
        "
      >

        <div className="grid lg:grid-cols-2">

          {/* Left Side */}

          <div className="hidden lg:flex flex-col justify-center p-14 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent">

            <p className="text-orange-400 uppercase tracking-[4px] text-xs font-semibold mb-5">
              MEMBER ACCESS
            </p>

            <h1 className="text-7xl font-black text-white leading-none">
              Welcome
              <br />
              <span className="text-orange-500">
                Back.
              </span>
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed mt-8 max-w-md">
              Access your account to explore exclusive
              collections, saved favourites, orders and
              premium member benefits.
            </p>

            <div className="flex gap-10 mt-14">

              <div>
                <h3 className="text-white text-4xl font-black">
                  25K+
                </h3>

                <p className="text-zinc-500 text-xs uppercase tracking-[3px] mt-2">
                  Members
                </p>
              </div>

              <div>
                <h3 className="text-white text-4xl font-black">
                  VIP
                </h3>

                <p className="text-zinc-500 text-xs uppercase tracking-[3px] mt-2">
                  Access
                </p>
              </div>

            </div>

          </div>

          {/* Right Side */}

          <div className="p-8 md:p-12 lg:p-14">

            <p className="text-orange-400 uppercase tracking-[4px] text-xs font-semibold">
              Sign In
            </p>

            <h2 className="text-5xl font-black text-white mt-4">
              Login
            </h2>

            <p className="text-zinc-400 mt-4 mb-10">
              Enter your credentials to continue.
            </p>

            {/* Email */}

            <div className="mb-5">

              <label className="block text-sm text-zinc-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={user.email}
                onChange={(e) =>
                  setUser({
                    ...user,
                    email: e.target.value,
                  })
                }
                placeholder="john@example.com"
                className="
                  w-full
                  px-4
                  py-4
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-white
                  placeholder-zinc-500
                  focus:outline-none
                  focus:border-orange-500
                  transition
                "
              />

            </div>

            {/* Password */}

            <div>

              <div className="flex justify-between items-center mb-2">

                <label className="text-sm text-zinc-300">
                  Password
                </label>

                <Link
                  href="/forgotpassword"
                  className="text-sm text-orange-400 hover:text-orange-300 transition"
                >
                  Forgot Password?
                </Link>

              </div>

              <input
                type="password"
                value={user.password}
                onChange={(e) =>
                  setUser({
                    ...user,
                    password: e.target.value,
                  })
                }
                placeholder="••••••••"
                className="
                  w-full
                  px-4
                  py-4
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-white
                  placeholder-zinc-500
                  focus:outline-none
                  focus:border-orange-500
                  transition
                "
              />

            </div>

            {/* Login Button */}

            <button
              onClick={onLogin}
              disabled={buttonDisabled || loading}
              className="
                w-full
                py-4
                mt-8
                rounded-xl
                bg-orange-500
                hover:bg-orange-600
                text-white
                font-semibold
                transition
                shadow-xl
                shadow-orange-500/20
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Signing In..." : "Sign In →"}
            </button>

            {/* Signup Link */}

            <p className="text-center text-zinc-400 mt-8">

              Don't have an account?

              <Link
                href="/signup"
                className="
                  ml-2
                  text-orange-400
                  hover:text-orange-300
                  transition
                "
              >
                Create Account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  </>
);
}
