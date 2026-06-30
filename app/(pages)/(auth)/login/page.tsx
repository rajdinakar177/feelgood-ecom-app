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

  <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
    <div className="w-full max-w-md border border-zinc-200 rounded-2xl bg-white p-8 md:p-10">

      {/* Logo */}
      <div className="text-center">
        <Link href="/">
          <h1 className="text-3xl font-bold tracking-tight cursor-pointer">
            Feelgood
          </h1>
        </Link>

        <h2 className="text-4xl font-bold mt-8">
          Welcome Back
        </h2>

        <p className="text-zinc-500 mt-3">
          Sign in to continue shopping.
        </p>
      </div>

      {/* Email */}
      <div className="mt-10">
        <label className="block text-sm font-medium text-zinc-700 mb-2">
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
            rounded-xl
            border
            border-zinc-300
            px-4
            py-3.5
            outline-none
            focus:border-black
            focus:ring-1
            focus:ring-black
            transition
          "
        />
      </div>

      {/* Password */}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-zinc-700">
            Password
          </label>

          <Link
            href="/forgotpassword"
            className="text-sm text-zinc-500 hover:text-black transition"
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
            rounded-xl
            border
            border-zinc-300
            px-4
            py-3.5
            outline-none
            focus:border-black
            focus:ring-1
            focus:ring-black
            transition
          "
        />
      </div>

      {/* Button */}

      <button
        onClick={onLogin}
        disabled={buttonDisabled || loading}
        className="
          w-full
          mt-8
          py-3.5
          rounded-xl
          bg-black
          text-white
          font-medium
          hover:bg-zinc-800
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>

      {/* Divider */}

      <div className="flex items-center my-8">
        <div className="flex-1 h-px bg-zinc-200"></div>
        <span className="px-4 text-sm text-zinc-400">OR</span>
        <div className="flex-1 h-px bg-zinc-200"></div>
      </div>

      {/* Google */}

      <button
        className="
          w-full
          py-3.5
          rounded-xl
          border
          border-zinc-300
          hover:bg-zinc-50
          transition
          font-medium
        "
      >
        Continue with Google
      </button>

      {/* Signup */}

      <p className="text-center text-zinc-500 mt-8">
        Don't have an account?

        <Link
          href="/signup"
          className="ml-2 font-semibold text-black hover:underline"
        >
          Create Account
        </Link>
      </p>

    </div>
  </div>
</>
  );
}
