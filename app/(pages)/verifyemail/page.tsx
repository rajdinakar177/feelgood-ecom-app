"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function VerifyEmailPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verifying your email...");

  const [token, setToken] = useState<string | null>(null);

  // Get token safely (client-only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []);

  // Verify email
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          setMessage("Invalid verification link");
          setSuccess(false);
          setLoading(false);
          return;
        }

        const response = await axios.post("/api/users/verifyemail", {
          token,
        });

        setSuccess(true);
        setMessage(response.data.message || "Email verified successfully 🎉");

        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } catch (error: any) {
        setSuccess(false);
        setMessage(
          error?.response?.data?.error ||
          "Something went wrong while verifying email"
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

 return (
  <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">

    <div className="grid lg:grid-cols-2 max-w-6xl w-full bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden">

      {/* Left Side */}

      <div className="hidden lg:flex items-center justify-center p-16 bg-gradient-to-br from-orange-500/10 via-black to-black">

        <div>

          <p className="uppercase tracking-[6px] text-orange-500 text-xs mb-6">
            ACCOUNT VERIFICATION
          </p>

          <h1 className="text-white text-7xl font-black leading-none">
            Verify
            <br />
            <span className="text-orange-500">
              Email
            </span>
          </h1>

          <p className="text-white/60 mt-8 text-lg leading-relaxed max-w-md">
            Secure your SRADA account and unlock access
            to exclusive collections, member rewards,
            and premium shopping experiences.
          </p>

          <div className="flex gap-10 mt-16">

            <div>
              <h3 className="text-white text-4xl font-black">
                Secure
              </h3>

              <p className="text-white/40 uppercase tracking-[3px] text-xs mt-2">
                Access
              </p>
            </div>

            <div>
              <h3 className="text-white text-4xl font-black">
                Premium
              </h3>

              <p className="text-white/40 uppercase tracking-[3px] text-xs mt-2">
                Membership
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Right Side */}

      <div className="p-8 md:p-14 lg:p-16 flex flex-col justify-center">

        {/* Status Icon */}

        <div className="mb-8">

          {loading ? (
            <div className="w-16 h-16 border-2 border-white/20 border-t-orange-500 rounded-full animate-spin" />
          ) : success ? (
            <div className="w-16 h-16 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500 text-3xl">
              ✓
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500 text-3xl">
              ✕
            </div>
          )}

        </div>

        <p className="uppercase tracking-[5px] text-orange-500 text-xs">
          Email Verification
        </p>

        <h2 className="text-white text-5xl font-black mt-4">

          {loading
            ? "Verifying..."
            : success
              ? "Verification Successful"
              : "Verification Failed"}

        </h2>

        <p className="text-gray-400 mt-6 leading-relaxed max-w-md">
          {message}
        </p>

        {!loading && (

          <div className="flex flex-col gap-4 mt-10">

            <Link
              href="/login"
              className="
                bg-orange-500
                hover:bg-orange-600
                text-white
                py-4
                text-center
                rounded-xl
                font-semibold
                tracking-wide
                transition
              "
            >
              Go To Login →
            </Link>

            {!success && (

              <Link
                href="/signup"
                className="
                  border
                  border-white/10
                  text-white
                  py-4
                  text-center
                  rounded-xl
                  hover:border-orange-500/40
                  hover:text-orange-400
                  transition
                "
              >
                Back To Signup
              </Link>

            )}

          </div>

        )}

        {success && !loading && (

          <p className="text-sm text-gray-500 mt-6">
            Redirecting to login in 3 seconds...
          </p>

        )}

      </div>

    </div>

  </div>
);
}