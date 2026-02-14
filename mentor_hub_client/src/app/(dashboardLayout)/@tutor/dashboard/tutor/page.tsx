"use client";

import { useState, useEffect } from "react";

import { TutorDataType } from "@/type/tutorDataTyp";

import { Clock, DollarSign, BookOpen, Star, Calendar } from "lucide-react";
import { tutorService } from "@/components/service/tutor.service";

export const dynamic = "force-dynamic";

export default function TutorProfileDashboard() {
  const [profile, setProfile] = useState<TutorDataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await tutorService.getOwnProfile();
    if (data) {
      setProfile(data);
    } else {
      console.error("Error fetching profile:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-sky-500 mx-auto mb-4"></div>
          <p className="text-sky-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Please create your tutor profile to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Tutor Dashboard
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="h-32 sm:h-48 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500 relative"></div>

          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-20">
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-gradient-to-br from-sky-300 to-blue-400 flex items-center justify-center shadow-2xl">
                  <span className="text-5xl sm:text-6xl font-bold text-white">
                    {profile.name?.charAt(0).toUpperCase() || "T"}
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left sm:mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                  {profile.name || "Tutor Name"}
                </h1>
                <p className="text-lg text-sky-600 font-medium mb-1">
                  {profile?.email || "No email provided"}
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {profile.subjects?.map((subject: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 rounded-full text-sm font-medium shadow-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="text-sky-500" size={24} />
              </div>
              <span className="text-xs text-gray-500 font-medium">
                EXPERIENCE
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">
              {profile.experience || 0}
            </p>
            <p className="text-sm text-gray-600">Years Teaching</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-lg flex items-center justify-center">
                <Star className="text-yellow-500" size={24} />
              </div>
              <span className="text-xs text-gray-500 font-medium">RATING</span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">
              {profile.rating || 0}⭐
            </p>
            <p className="text-sm text-gray-600">Average Score</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-purple-500" size={24} />
              </div>
              <span className="text-xs text-gray-500 font-medium">RATE</span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">
              ${profile.hourlyRate || profile.price || 0}
            </p>
            <p className="text-sm text-gray-600">Per Hour</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">About Me</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {profile.bio || "No bio provided yet."}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-sky-500" size={18} />
              </div>
              Availability
            </h2>
            {profile.availability &&
            typeof profile.availability === "object" ? (
              <div className="space-y-3">
                {Object.entries(profile.availability).map(
                  ([day, slots]: [string, any]) => (
                    <div
                      key={day}
                      className="p-3 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border-l-4 border-sky-400"
                    >
                      <h3 className="font-semibold text-gray-800 capitalize mb-1">
                        {day}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(slots) ? (
                          slots.map((slot: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-white text-sky-700 rounded text-sm font-medium shadow-sm"
                            >
                              {slot}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-1 bg-white text-sky-700 rounded text-sm font-medium shadow-sm">
                            {slots}
                          </span>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No availability information provided.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
