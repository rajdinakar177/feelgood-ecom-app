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
  <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-6 py-12">

    {/* Background Effects */}
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />

    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />

    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]" />

    <div className="relative grid lg:grid-cols-2 max-w-7xl w-full">

      {/* Left Side */}

      <div className="hidden lg:flex flex-col justify-center pr-20">

        <p className="uppercase tracking-[6px] text-orange-400 text-xs mb-8">
          Account Security
        </p>

        <h1 className="text-7xl font-black text-white leading-none">
          Reset
          <br />
          <span className="text-orange-500">
            Password
          </span>
        </h1>

        <p className="text-gray-400 text-lg mt-8 leading-relaxed max-w-lg">
          Create a secure new password and regain
          access to your SRADA account. Your new
          password will immediately replace the old one.
        </p>

        <div className="flex gap-12 mt-16">

          <div>
            <h3 className="text-4xl font-black text-white">
              Secure
            </h3>

            <p className="text-gray-500 uppercase tracking-[3px] text-xs mt-2">
              Authentication
            </p>
          </div>

          <div>
            <h3 className="text-4xl font-black text-white">
              24/7
            </h3>

            <p className="text-gray-500 uppercase tracking-[3px] text-xs mt-2">
              Protection
            </p>
          </div>

        </div>

      </div>

      {/* Right Side */}

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">

        <p className="uppercase tracking-[5px] text-orange-400 text-xs">
          Account Recovery
        </p>

        <h2 className="text-5xl font-black text-white mt-4">
          {loading
            ? "Verifying..."
            : success
              ? "Create Password"
              : "Invalid Link"}
        </h2>

        {!loading && (
          <p className="text-gray-400 mt-5 mb-10 leading-relaxed">
            {message}
          </p>
        )}

        {/* Success State */}

        {!loading && success && (
          <>
            <div className="mb-8">

              <label className="block text-xs uppercase tracking-[3px] text-gray-500 mb-3">
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter new password"
                className="
                  w-full
                  bg-white/5
                  border
                  border-white/10
                  rounded-xl
                  px-5
                  py-4
                  text-white
                  placeholder-gray-600
                  outline-none
                  focus:border-orange-500
                  transition
                "
              />

            </div>

            <button
              onClick={ResetPassword}
              disabled={updating || password.length < 6}
              className="
                w-full
                bg-orange-500
                text-white
                py-4
                rounded-xl
                font-bold
                tracking-wide
                hover:bg-orange-600
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {updating
                ? "Updating Password..."
                : "Update Password →"}
            </button>
          </>
        )}

        {/* Invalid Link */}

        {!loading && !success && (
          <Link
            href="/forgotpassword"
            className="
              inline-flex
              items-center
              text-orange-400
              hover:text-orange-300
              transition
              font-medium
            "
          >
            Request New Reset Link →
          </Link>
        )}

        {/* Login Link */}

        {!loading && (
          <p className="text-center text-gray-500 mt-10">

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
        )}

      </div>

    </div>

  </div>
);
}