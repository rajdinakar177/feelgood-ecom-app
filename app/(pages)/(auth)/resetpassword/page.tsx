"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verifying your reset password link...");
  const [password, setPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  // Get token safely from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    setToken(t);

    const verifyToken = async () => {
      try {
        if (!t) {
          setMessage("Invalid reset password link");
          setSuccess(false);
          setLoading(false);
          return;
        }

        const response = await axios.post("/api/users/verifyresettoken", {
          token: t,
        });

        setSuccess(true);
        setMessage(response.data.message || "Reset password link is valid 🎉");
      } catch (error: any) {
        setSuccess(false);
        setMessage(
          error?.response?.data?.error ||
          "Reset password link expired or invalid"
        );
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Update password
  const ResetPassword = async () => {
    try {
      setUpdating(true);

      const response = await axios.post("/api/users/resetpassword", {
        token,
        password,
      });

      toast.success(
        response.data.message || "Password updated successfully"
      );
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      alert(
        error?.response?.data?.error ||
        "Something went wrong while updating password"
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6 py-16">

      <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-8 md:p-10 shadow-sm">

        {/* Logo */}

        <div className="text-center">

          <Link href="/">
            <h1 className="text-3xl font-bold tracking-tight">
              Feelgood
            </h1>
          </Link>

          {loading ? (

            <div className="flex justify-center mt-10">
              <div className="h-16 w-16 rounded-full border-4 border-zinc-200 border-t-black animate-spin" />
            </div>

          ) : success ? (

            <div className="flex justify-center mt-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl">
                🔒
              </div>
            </div>

          ) : (

            <div className="flex justify-center mt-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 text-3xl">
                ✕
              </div>
            </div>

          )}

          <p className="mt-8 text-xs uppercase tracking-[3px] text-zinc-500 font-semibold">
            Password Recovery
          </p>

          <h2 className="mt-3 text-4xl font-bold text-zinc-900">

            {loading
              ? "Verifying..."
              : success
                ? "Create New Password"
                : "Invalid Reset Link"}

          </h2>

          {!loading && (

            <p className="mt-4 text-zinc-500 leading-relaxed">
              {message}
            </p>

          )}

        </div>

        {/* Password */}

        {!loading && success && (

          <div className="mt-10">

            <label className="block text-sm font-medium text-zinc-700 mb-2">
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              className="
            w-full
            rounded-xl
            border
            border-zinc-300
            px-4
            py-3.5
            outline-none
            transition
            focus:border-black
            focus:ring-1
            focus:ring-black
          "
            />

            <button
              onClick={ResetPassword}
              disabled={updating || password.length < 6}
              className="
            mt-8
            w-full
            rounded-xl
            bg-black
            py-3.5
            font-medium
            text-white
            transition
            hover:bg-zinc-800
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
            >
              {updating
                ? "Updating Password..."
                : "Update Password"}
            </button>

          </div>

        )}

        {/* Invalid Link */}

        {!loading && !success && (

          <Link
            href="/forgotpassword"
            className="
          mt-10
          block
          w-full
          rounded-xl
          border
          border-zinc-300
          py-3.5
          text-center
          font-medium
          transition
          hover:bg-zinc-100
        "
          >
            Request New Reset Link
          </Link>

        )}

        {/* Login */}

        {!loading && (

          <p className="mt-8 text-center text-zinc-500">

            Remember your password?

            <Link
              href="/login"
              className="ml-2 font-semibold text-black hover:underline"
            >
              Sign In
            </Link>

          </p>

        )}

      </div>

    </div>
  );
}