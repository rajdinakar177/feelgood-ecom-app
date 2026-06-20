"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (
      user.firstName &&
      user.lastName &&
      user.email &&
      user.password
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onSignup = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "/api/users/signup",
        user
      );

      toast.success("Account created successfully");

      console.log(response.data);

      router.push("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          "Something went wrong"
      );

      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

return (
  <>
    <Toaster position="top-center" />

    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10 overflow-hidden relative">

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
          shadow-2xl
        "
      >

        <div className="grid lg:grid-cols-2">

          {/* LEFT SIDE */}

          <div className="hidden lg:flex flex-col justify-center p-14 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent">

            <p className="text-orange-400 uppercase tracking-[4px] text-xs font-semibold mb-5">
              Join SRADA
            </p>

            <h1 className="text-7xl font-black text-white leading-none">
              Become
              <br />
              Part Of
              <span className="block text-orange-500">
                The Culture.
              </span>
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed mt-8 max-w-md">
              Create your account and unlock exclusive
              collections, early-access drops and premium
              member benefits.
            </p>

            <div className="flex gap-10 mt-14">

              <div>
                <h3 className="text-white text-4xl font-black">
                  12K+
                </h3>

                <p className="text-zinc-500 text-xs uppercase tracking-[3px] mt-2">
                  Members
                </p>
              </div>

              <div>
                <h3 className="text-white text-4xl font-black">
                  500+
                </h3>

                <p className="text-zinc-500 text-xs uppercase tracking-[3px] mt-2">
                  Styles
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="p-8 md:p-12 lg:p-14">

            <p className="text-orange-400 uppercase tracking-[4px] text-xs font-semibold">
              Create Account
            </p>

            <h2 className="text-5xl font-black text-white mt-4">
              Welcome
            </h2>

            <p className="text-zinc-400 mt-4 mb-10">
              Enter your details below to create your
              SRADA account.
            </p>

            {/* Names */}

            <div className="grid md:grid-cols-2 gap-5 mb-5">

              <input
                type="text"
                placeholder="First Name"
                value={user.firstName}
                onChange={(e) =>
                  setUser({
                    ...user,
                    firstName: e.target.value,
                  })
                }
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

              <input
                type="text"
                placeholder="Last Name"
                value={user.lastName}
                onChange={(e) =>
                  setUser({
                    ...user,
                    lastName: e.target.value,
                  })
                }
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

            {/* Email */}

            <div className="mb-5">

              <input
                type="email"
                placeholder="Email Address"
                value={user.email}
                onChange={(e) =>
                  setUser({
                    ...user,
                    email: e.target.value,
                  })
                }
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

              <input
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={(e) =>
                  setUser({
                    ...user,
                    password: e.target.value,
                  })
                }
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

            {/* Button */}

            <button
              disabled={buttonDisabled || loading}
              onClick={onSignup}
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
              {loading
                ? "Creating Account..."
                : "Create Account →"}
            </button>

            {/* Login */}

            <p className="text-center text-zinc-400 mt-8">
              Already have an account?

              <Link
                href="/login"
                className="
                  ml-2
                  text-orange-400
                  hover:text-orange-300
                  transition
                "
              >
                Sign In
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  </>
);
}