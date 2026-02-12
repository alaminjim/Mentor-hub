"use client";

import { useState, useEffect } from "react";
import { TutorDataType } from "@/type/tutorDataTyp";
import Image from "next/image";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Clock,
  DollarSign,
  Edit2,
  Save,
  X,
  BookOpen,
  Star,
  Users,
  Calendar,
} from "lucide-react";
import { tutorService } from "@/components/service/tutor.service";

export default function TutorProfileDashboard() {
  const [profile, setProfile] = useState<TutorDataType | null>(null);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

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
          <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="text-sky-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Please create your tutor profile to get started.
          </p>
          <button className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors">
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-sky-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                Tutor Dashboard
              </h1>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <Edit2 size={18} />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <Save size={18} />
                  <span className="hidden sm:inline">
                    {saving ? "Saving..." : "Save"}
                  </span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <X size={18} />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Cover Image with Gradient */}
          <div className="h-40 sm:h-48 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Info Section */}
          <div className="relative px-6 pb-6">
            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-20">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-white overflow-hidden shadow-2xl">
                  {profile.profilePicture ? (
                    <Image
                      src={profile.profilePicture}
                      alt={profile.name || "Tutor"}
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-sky-300 to-blue-400 flex items-center justify-center">
                      <span className="text-5xl font-bold text-white">
                        {profile.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-2 right-2 bg-sky-500 hover:bg-sky-600 text-white p-2.5 rounded-full shadow-lg transition-all cursor-pointer group-hover:scale-110"
                >
                  {uploadingImage ? (
                    <div className="animate-spin">⏳</div>
                  ) : (
                    <Camera size={18} />
                  )}
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex-1 text-center sm:text-left sm:mb-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-3xl font-bold text-gray-800 mb-2 border-b-2 border-sky-300 focus:border-sky-500 outline-none bg-transparent w-full"
                  />
                ) : (
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                    {profile.name}
                  </h1>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.expertise || ""}
                    onChange={(e) =>
                      handleInputChange("expertise", e.target.value)
                    }
                    className="text-lg text-sky-600 font-medium mb-3 border-b border-sky-300 focus:border-sky-500 outline-none bg-transparent w-full"
                    placeholder="Your expertise..."
                  />
                ) : (
                  <p className="text-lg text-sky-600 font-medium mb-3">
                    {profile.expertise || "Expert Tutor"}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {profile.subjects
                    ?.slice(0, 4)
                    .map((subject: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 rounded-full text-sm font-medium shadow-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  {profile.subjects && profile.subjects.length > 4 && (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                      +{profile.subjects.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="text-green-500" size={24} />
              </div>
              <span className="text-xs text-gray-500 font-medium">
                STUDENTS
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">
              {profile.students || 0}
            </p>
            <p className="text-sm text-gray-600">Total Taught</p>
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
              ${profile.hourlyRate || 0}
            </p>
            <p className="text-sm text-gray-600">Per Hour</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Mail className="text-sky-500" size={18} />
                </div>
                Contact Info
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-sky-50 rounded-lg">
                  <Mail className="text-sky-500 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-2 py-1 border border-sky-300 rounded focus:ring-2 focus:ring-sky-500 text-sm"
                      />
                    ) : (
                      <p className="font-medium text-gray-800 text-sm break-all">
                        {profile.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-sky-50 rounded-lg">
                  <Phone className="text-sky-500 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full px-2 py-1 border border-sky-300 rounded focus:ring-2 focus:ring-sky-500 text-sm"
                      />
                    ) : (
                      <p className="font-medium text-gray-800 text-sm">
                        {profile.phone || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-sky-50 rounded-lg">
                  <MapPin className="text-sky-500 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.location || ""}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className="w-full px-2 py-1 border border-sky-300 rounded focus:ring-2 focus:ring-sky-500 text-sm"
                      />
                    ) : (
                      <p className="font-medium text-gray-800 text-sm">
                        {profile.location || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Subjects Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-sky-500" size={18} />
                </div>
                Subjects
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.subjects?.map((subject: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 text-sky-700 rounded-lg text-sm font-medium hover:shadow-md transition-shadow"
                  >
                    {subject}
                  </span>
                )) || (
                  <p className="text-gray-500 text-sm">No subjects added</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4">About Me</h2>
              {isEditing ? (
                <textarea
                  value={editedProfile.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none text-gray-700"
                  placeholder="Tell students about yourself, your teaching style, and what makes you a great tutor..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {profile.bio ||
                    "No bio provided yet. Click 'Edit Profile' to add information about yourself."}
                </p>
              )}
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-sky-500" size={18} />
                </div>
                Education
              </h2>
              {profile.education && profile.education.length > 0 ? (
                <div className="space-y-4">
                  {profile.education.map((edu: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border-l-4 border-sky-400"
                    >
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {edu.degree}
                      </h3>
                      <p className="text-sky-600 font-medium mb-1">
                        {edu.institution}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar size={14} />
                        {edu.year}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No education details provided.
                </p>
              )}
            </div>

            {/* Certifications Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Award className="text-sky-500" size={18} />
                </div>
                Certifications & Awards
              </h2>
              {profile.certifications && profile.certifications.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.certifications.map((cert: string, index: number) => (
                    <div
                      key={index}
                      className="p-3 bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-2">
                        <Award
                          className="text-sky-500 mt-0.5 flex-shrink-0"
                          size={16}
                        />
                        <p className="text-sm font-medium text-sky-700">
                          {cert}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No certifications added yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
