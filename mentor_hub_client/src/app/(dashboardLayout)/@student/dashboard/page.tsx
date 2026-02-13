"use client";

import {
  getStudentStats,
  StudentStats,
} from "@/components/service/student.service";
import { getSession } from "@/components/service/auth.service";
import { useEffect, useState } from "react";

interface UserSession {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, sessionData] = await Promise.all([
        getStudentStats(),
        getSession(),
      ]);

      if (statsData) {
        setStats(statsData);
      } else {
        setError("Failed to load dashboard stats");
      }

      if (sessionData?.data) {
        setUser(sessionData.data);
      }
    } catch (err) {
      setError("An error occurred while fetching dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const fillPercentage = Math.min(Math.max(rating - (star - 1), 0), 1);

          return (
            <span key={star} className="relative inline-block text-2xl">
              <span className="text-gray-300">★</span>

              <span
                className="absolute top-0 left-0 text-yellow-500 overflow-hidden"
                style={{ width: `${fillPercentage * 100}%` }}
              >
                ★
              </span>
            </span>
          );
        })}
        <span className="text-xl font-semibold text-gray-700 ml-2">
          {rating.toFixed(2)}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-sky-600"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-6">
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || "Failed to load dashboard"}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-sky-700 mb-2">
                Student Dashboard
              </h1>
              {user && user.name ? (
                <div className="mt-3">
                  <p className="text-xl text-gray-700 font-semibold">
                    Welcome, {user.name}!
                  </p>
                  <p className="text-gray-600 mt-1">
                    📧 {user.email || "No email"}
                  </p>
                  {user.role && (
                    <span className="inline-block mt-2 bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium">
                      {user.role}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 text-lg mt-2">
                  Welcome back! Here's your learning overview
                </p>
              )}
            </div>

            {user && user.name && (
              <div className="bg-sky-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold shadow-lg">
                {user.name}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  Total Tutors
                </p>
                <p className="text-4xl font-bold text-gray-800 mt-2">
                  {stats.totalTutors}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Available tutors on platform
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  Total Students
                </p>
                <p className="text-4xl font-bold text-gray-800 mt-2">
                  {stats.totalStudents}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Active learning community</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  Total Sessions
                </p>
                <p className="text-4xl font-bold text-gray-800 mt-2">
                  {stats.totalSessions}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Completed learning sessions
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  Average Rating
                </p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-full">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">{renderStars(stats.averageRating)}</div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Platform rating quality</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Quick Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-sky-100 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Learning Progress
                </h3>
                <p className="text-sm text-gray-600">
                  You've completed {stats.totalSessions} session
                  {stats.totalSessions !== 1 ? "s" : ""} so far. Keep up the
                  great work!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Available Tutors
                </h3>
                <p className="text-sm text-gray-600">
                  Choose from {stats.totalTutors} experienced tutors to enhance
                  your learning journey.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Quality Assured
                </h3>
                <p className="text-sm text-gray-600">
                  Our platform maintains an average rating of{" "}
                  {stats.averageRating.toFixed(2)} stars from all reviews.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Growing Community
                </h3>
                <p className="text-sm text-gray-600">
                  Join {stats.totalStudents} other students in our learning
                  community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
