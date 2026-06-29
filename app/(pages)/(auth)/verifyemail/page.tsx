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
  <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6 py-16">
  <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm">

    {/* Logo */}

    <div className="text-center">

      <Link href="/">
        <h1 className="text-3xl font-bold tracking-tight">
          Feelgood
        </h1>
      </Link>

      {/* Status */}

      <div className="flex justify-center mt-10">

        {loading ? (
          <div className="h-16 w-16 rounded-full border-4 border-zinc-200 border-t-black animate-spin" />
        ) : success ? (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
            ✓
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
            ✕
          </div>
        )}

      </div>

      <p className="mt-8 text-xs font-semibold uppercase tracking-[3px] text-zinc-500">
        Email Verification
      </p>

      <h2 className="mt-3 text-4xl font-bold text-zinc-900">

        {loading
          ? "Verifying..."
          : success
          ? "Verification Successful"
          : "Verification Failed"}

      </h2>

      <p className="mt-4 text-zinc-500 leading-relaxed">
        {message}
      </p>

    </div>

    {!loading && (

      <div className="mt-10 space-y-4">

        <Link
          href="/login"
          className="
            block
            w-full
            rounded-xl
            bg-black
            py-3.5
            text-center
            font-medium
            text-white
            transition
            hover:bg-zinc-800
          "
        >
          Continue to Login
        </Link>

        {!success && (

          <Link
            href="/signup"
            className="
              block
              w-full
              rounded-xl
              border
              border-zinc-300
              py-3.5
              text-center
              font-medium
              text-zinc-900
              transition
              hover:bg-zinc-100
            "
          >
            Back to Signup
          </Link>

        )}

      </div>

    )}

    {success && !loading && (

      <p className="mt-6 text-center text-sm text-zinc-500">
        Redirecting to login in 3 seconds...
      </p>

    )}

  </div>
</div>
);
}