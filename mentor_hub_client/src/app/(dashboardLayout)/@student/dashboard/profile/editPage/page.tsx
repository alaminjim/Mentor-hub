// src/app/student/profile/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  getAuthMe,
  updateStudentProfile,
  type StudentProfile,
  type UpdateProfileData,
} from "@/components/service/student.service";
export const dynamic = "force-dynamic";
export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<UpdateProfileData>({
    name: "",
    email: "",
    role: "STUDENT",
    status: "UnBAN",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await getAuthMe();

      if (!userData) {
        toast.error("Please signin to continue");
        router.push("/signin");
        return;
      }

      if (userData.role !== "STUDENT") {
        toast.error("Access denied. Students only.");
        router.push("/signin");
        return;
      }

      setProfile(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
      });
    } catch (error) {
      toast.error("Failed to load profile");
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const result = await updateStudentProfile(profile.id, formData);

      if (result.success) {
        toast.success("Profile updated successfully!");
        router.push("/dashboard/profile");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-50">
        <div className="text-lg text-gray-600">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Link
            href="dashboard/student/profile"
            className="text-sky-600 hover:text-sky-700 flex items-center gap-2 mb-6"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Profile
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Edit Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              >
                <option value="STUDENT">STUDENT</option>
                <option value="TEACHER">TUTOR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              >
                <option value="UNBANNED">UnBAN</option>
                <option value="BANNED">BANNED</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-sky-500 text-white py-3 rounded-lg hover:bg-sky-600 disabled:opacity-50 font-medium"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href="dashboard/student/profile"
                className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-medium text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
