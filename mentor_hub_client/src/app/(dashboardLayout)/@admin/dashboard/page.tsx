"use client";

import {
  Users,
  BookOpen,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  UserCheck,
  ArrowUpRight,
  Clock,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { adminStatsService } from "@/components/service/adminStats.service";
import { StatsDataType } from "@/type/statsType";
import Link from "next/link";

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState<StatsDataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const { data } = await adminStatsService.getAdminStats();
      setStatsData(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const stats = statsData
    ? [
        {
          title: "Total Users",
          value: statsData.totalUsers?.toString() || "0",
          change: "+12.5%",
          trend: "up",
          icon: Users,
          color: "from-sky-400 to-cyan-500",
        },
        {
          title: "Total Tutors",
          value: statsData.totalTutors?.toString() || "0",
          change: "+8.2%",
          trend: "up",
          icon: UserCheck,
          color: "from-blue-400 to-sky-500",
        },
        {
          title: "Total Bookings",
          value: statsData.totalBookings?.toString() || "0",
          change: "+23.1%",
          trend: "up",
          icon: BookOpen,
          color: "from-cyan-400 to-blue-500",
        },
        {
          title: "Cancelled Bookings",
          value: statsData.cancelledBookings?.toString() || "0",
          change: "-5.3%",
          trend: "down",
          icon: Activity,
          color: "from-red-400 to-orange-500",
        },
      ]
    : [];

  const recentActivities = [
    {
      id: 1,
      type: "booking",
      message: "New booking created by Rahul Ahmed",
      time: "5 minutes ago",
      icon: BookOpen,
      color: "bg-sky-100 text-sky-600",
    },
    {
      id: 2,
      type: "user",
      message: "New tutor registered: Dr. Sarah Khan",
      time: "1 hour ago",
      icon: UserCheck,
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      id: 3,
      type: "review",
      message: "New 5-star review from Nadia Islam",
      time: "2 hours ago",
      icon: Star,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 4,
      type: "booking",
      message: "Booking confirmed for Tanvir Rahman",
      time: "3 hours ago",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  const quickStats = statsData
    ? [
        {
          label: "Total Users",
          value: statsData.totalUsers?.toString() || "0",
          color: "text-sky-600",
        },
        {
          label: "Total Bookings",
          value: statsData.totalBookings?.toString() || "0",
          color: "text-cyan-600",
        },
        {
          label: "Cancelled",
          value: statsData.cancelledBookings?.toString() || "0",
          color: "text-red-600",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="size-12 animate-spin text-sky-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-sky-50 text-lg">
              Here's what's happening with Mentor Hub today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="size-5" />
                <span className="font-semibold">Today's Date</span>
              </div>
              <p className="text-2xl font-bold">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30"
            >
              <p className="text-sky-50 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
              >
                <stat.icon className="size-7 text-white" />
              </div>
              <span className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp className="size-4" />
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {stat.title}
            </p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activities
            </h2>
            <button className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1">
              View All
              <ArrowUpRight className="size-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:bg-sky-50/30 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${activity.color} flex items-center justify-center shrink-0`}
                >
                  <activity.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-1">
                    {activity.message}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="size-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <Link href={"/signup"}>
              <button className="w-full bg-gradient-to-r from-sky-400 to-cyan-500 text-white rounded-lg p-4 font-medium hover:from-sky-500 hover:to-cyan-600 transition-all shadow-sm hover:shadow-md">
                + Add New User
              </button>
            </Link>
            <button className="w-full bg-sky-50 text-sky-700 rounded-lg p-4 font-medium hover:bg-sky-100 transition-colors border border-sky-200">
              View All Bookings
            </button>
            <button className="w-full bg-cyan-50 text-cyan-700 rounded-lg p-4 font-medium hover:bg-cyan-100 transition-colors border border-cyan-200">
              Manage Tutors
            </button>
            <button className="w-full bg-blue-50 text-blue-700 rounded-lg p-4 font-medium hover:bg-blue-100 transition-colors border border-blue-200">
              View Reports
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              System Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server</span>
                <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API</span>
                <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Platform Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <Users className="size-5 text-sky-600" />
            </div>
            <p className="text-3xl font-bold text-sky-600 mb-1">
              {statsData?.totalUsers || 0}
            </p>
            <p className="text-xs text-gray-500">All registered users</p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">
                Average Rating
              </p>
              <Star className="size-5 text-cyan-600" />
            </div>
            <p className="text-3xl font-bold text-cyan-600 mb-1">
              {statsData?.averageRating?.toFixed(1) || "0.0"}
            </p>
            <p className="text-xs text-gray-500">Across all tutors</p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Total Tutors</p>
              <UserCheck className="size-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {statsData?.totalTutors || 0}
            </p>
            <p className="text-xs text-gray-500">Active tutors</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
