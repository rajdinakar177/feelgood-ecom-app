"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Email validation
  useEffect(() => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    setButtonDisabled(!isValidEmail);
  }, [email]);

  // Send reset password email
  const onForgotPassword = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "/api/users/forgotpassword",
        {
          email,
        }
      );

      toast.success(
        response.data.message ||
          "Password reset link sent to your email 🎉"
      );

      // Redirect after success
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          "Failed to send password reset link"
      );
    } finally {
      setLoading(false);
    }
  };

return (
  <>
    <Toaster position="top-center" />

    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Glow Effects */}

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
              ACCOUNT RECOVERY
            </p>

            <h1 className="text-7xl font-black text-white leading-none">
              Reset
              <br />
              <span className="text-orange-500">
                Password.
              </span>
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed mt-8 max-w-md">
              Enter your registered email address and we'll
              send you a secure password reset link.
            </p>

            <div className="flex gap-10 mt-14">

              <div>
                <h3 className="text-white text-4xl font-black">
                  Secure
                </h3>

                <p className="text-zinc-500 text-xs uppercase tracking-[3px] mt-2">
                  Recovery
                </p>
              </div>

              <div>
                <h3 className="text-white text-4xl font-black">
                  24/7
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
              Forgot Password
            </p>

            <h2 className="text-5xl font-black text-white mt-4">
              Account Recovery
            </h2>

            <p className="text-zinc-400 mt-4 mb-10">
              Enter your email address and we'll send
              you a password reset link.
            </p>

            {/* Email */}

            <div className="mb-6">

              <label className="block text-sm text-zinc-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                autoComplete="email"
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
              onClick={onForgotPassword}
              disabled={buttonDisabled || loading}
              className="
                w-full
                py-4
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
                ? "Sending Reset Link..."
                : "Send Reset Link →"}
            </button>

            {/* Back to Login */}

            <p className="text-center text-zinc-400 mt-8">

              Remember your password?

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