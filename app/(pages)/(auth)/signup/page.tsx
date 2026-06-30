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

  <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
    <div className="w-full max-w-lg border border-zinc-200 rounded-2xl bg-white p-8 md:p-10">

      {/* Logo */}

      <div className="text-center">

        <Link href="/">
          <h1 className="text-3xl font-bold tracking-tight cursor-pointer">
            Feelgood
          </h1>
        </Link>

        <h2 className="text-4xl font-bold mt-8">
          Create Account
        </h2>

        <p className="text-zinc-500 mt-3">
          Join Feelgood and start shopping your favourite styles.
        </p>

      </div>

      {/* Name */}

      <div className="grid grid-cols-2 gap-4 mt-10">

        <div>

          <label className="block text-sm font-medium text-zinc-700 mb-2">
            First Name
          </label>

          <input
            type="text"
            value={user.firstName}
            onChange={(e) =>
              setUser({
                ...user,
                firstName: e.target.value,
              })
            }
            placeholder="John"
            className="
              w-full
              px-4
              py-3.5
              rounded-xl
              border
              border-zinc-300
              outline-none
              focus:ring-1
              focus:ring-black
              focus:border-black
              transition
            "
          />

        </div>

        <div>

          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Last Name
          </label>

          <input
            type="text"
            value={user.lastName}
            onChange={(e) =>
              setUser({
                ...user,
                lastName: e.target.value,
              })
            }
            placeholder="Doe"
            className="
              w-full
              px-4
              py-3.5
              rounded-xl
              border
              border-zinc-300
              outline-none
              focus:ring-1
              focus:ring-black
              focus:border-black
              transition
            "
          />

        </div>

      </div>

      {/* Email */}

      <div className="mt-6">

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
            px-4
            py-3.5
            rounded-xl
            border
            border-zinc-300
            outline-none
            focus:ring-1
            focus:ring-black
            focus:border-black
            transition
          "
        />

      </div>

      {/* Password */}

      <div className="mt-6">

        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Password
        </label>

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
            py-3.5
            rounded-xl
            border
            border-zinc-300
            outline-none
            focus:ring-1
            focus:ring-black
            focus:border-black
            transition
          "
        />

      </div>

      {/* Button */}

      <button
        onClick={onSignup}
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
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      {/* Divider */}

      <div className="flex items-center my-8">
        <div className="flex-1 h-px bg-zinc-200"></div>
        <span className="px-4 text-sm text-zinc-400">
          OR
        </span>
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

      {/* Login */}

      <p className="text-center text-zinc-500 mt-8">

        Already have an account?

        <Link
          href="/login"
          className="ml-2 font-semibold text-black hover:underline"
        >
          Sign In
        </Link>

      </p>

    </div>
  </div>
</>
);
}