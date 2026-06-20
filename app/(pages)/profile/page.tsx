"use client";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  IconUser,
  IconMail,
  IconLogout,
  IconVideo,
  IconDeviceFloppy,
  IconChartBar,
  IconUpload,
  IconInbox,
} from "@tabler/icons-react";

type User = {
  firstName: string;
  lastName: string;
  email: string;
};


function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ?? "bg-blue-500/15 text-blue-400"}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userRes] = await Promise.all([
          axios.get("/api/users/me"),
        ]);
        setUser(userRes.data.user);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged out");
      window.location.href = "/login";
    } catch {
      toast.error("Logout failed");
    }
  };





if (loading) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );
}

return (
  <div className="min-h-screen bg-black text-white">
    <Toaster />

    {/* Background Effects */}
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/5 blur-[120px] rounded-full" />
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* Page Header */}

      <div className="mb-10">
        <p className="text-orange-400 uppercase tracking-[4px] text-xs font-semibold">
          My Account
        </p>

        <h1 className="text-5xl md:text-6xl font-black mt-3">
          Welcome Back
        </h1>

        <p className="text-zinc-500 mt-3">
          Manage your profile, orders and wishlist.
        </p>
      </div>

      {/* Hero Profile Card */}

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-10">

        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />

        <div className="relative flex flex-col lg:flex-row justify-between gap-8">

          <div className="flex items-center gap-6">

            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-4xl font-black shadow-xl shadow-orange-500/30">
              {user?.firstName?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                {user?.firstName} {user?.lastName}
              </h2>

              <div className="flex items-center gap-2 mt-3 text-zinc-400">
                <IconMail size={16} />
                {user?.email}
              </div>
            </div>

          </div>

          <button
            onClick={logout}
            className="
              self-start
              px-6
              py-3
              bg-orange-500
              hover:bg-orange-600
              rounded-xl
              font-semibold
              transition
              flex
              items-center
              gap-2
            "
          >
            <IconLogout size={18} />
            Logout
          </button>

        </div>
      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <StatCard
          icon={<IconInbox size={18} />}
          label="Orders"
          value="12"
          accent="bg-orange-500/15 text-orange-400"
        />

        <StatCard
          icon={<IconVideo size={18} />}
          label="Wishlist"
          value="08"
          accent="bg-orange-500/15 text-orange-400"
        />

        <StatCard
          icon={<IconChartBar size={18} />}
          label="Reward Points"
          value="240"
          accent="bg-orange-500/15 text-orange-400"
        />

      </div>

      {/* Quick Actions */}

      <div className="mt-8">

        <h3 className="text-xl font-bold mb-5">
          Quick Actions
        </h3>

        <div className="grid md:grid-cols-4 gap-5">

          <button className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition text-left">
            <IconInbox className="text-orange-400 mb-4" />
            <h4 className="font-semibold">My Orders</h4>
            <p className="text-sm text-zinc-500 mt-1">
              Track recent purchases
            </p>
          </button>

          <button className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition text-left">
            <IconVideo className="text-orange-400 mb-4" />
            <h4 className="font-semibold">Wishlist</h4>
            <p className="text-sm text-zinc-500 mt-1">
              Saved products
            </p>
          </button>

          <button className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition text-left">
            <IconUpload className="text-orange-400 mb-4" />
            <h4 className="font-semibold">Addresses</h4>
            <p className="text-sm text-zinc-500 mt-1">
              Manage shipping info
            </p>
          </button>

          <button className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition text-left">
            <IconDeviceFloppy className="text-orange-400 mb-4" />
            <h4 className="font-semibold">Settings</h4>
            <p className="text-sm text-zinc-500 mt-1">
              Account preferences
            </p>
          </button>

        </div>

      </div>

      {/* Account Details */}

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">

        <h3 className="text-2xl font-bold mb-8">
          Account Information
        </h3>

        <div className="grid md:grid-cols-2 gap-8">

          <div>
            <p className="text-zinc-500 text-sm mb-2">
              First Name
            </p>
            <p className="text-lg font-medium">
              {user?.firstName}
            </p>
          </div>

          <div>
            <p className="text-zinc-500 text-sm mb-2">
              Last Name
            </p>
            <p className="text-lg font-medium">
              {user?.lastName}
            </p>
          </div>

          <div>
            <p className="text-zinc-500 text-sm mb-2">
              Email Address
            </p>
            <p className="text-lg font-medium">
              {user?.email}
            </p>
          </div>

        </div>

      </div>

    </div>
  </div>
);
}
