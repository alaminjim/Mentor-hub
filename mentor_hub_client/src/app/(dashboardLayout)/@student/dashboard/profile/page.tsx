"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  getAuthMe,
  deleteStudentProfile,
  type StudentProfile,
} from "@/components/service/student.service";

export const dynamic = "force-dynamic";

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    } catch (error) {
      toast.error("Failed to load profile");
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!profile) return;

    setDeleting(true);
    try {
      const result = await deleteStudentProfile(profile.id);

      if (result.success) {
        toast.success("Profile deleted successfully!");
        router.push("/signin");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete profile");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-sky-500 p-6 text-white">
            <div className="flex items-center gap-4">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white text-sky-500 flex items-center justify-center text-3xl font-bold border-4 border-white">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-sky-100">{profile.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="border-l-4 border-sky-400 pl-4 py-2 bg-sky-50">
              <p className="text-sm text-gray-600 font-semibold">Name</p>
              <p className="text-lg text-gray-800">{profile.name}</p>
            </div>

            <div className="border-l-4 border-sky-400 pl-4 py-2 bg-sky-50">
              <p className="text-sm text-gray-600 font-semibold">Email</p>
              <p className="text-lg text-gray-800">{profile.email}</p>
            </div>

            <div className="border-l-4 border-sky-400 pl-4 py-2 bg-sky-50">
              <p className="text-sm text-gray-600 font-semibold">Role</p>
              <p className="text-lg text-gray-800">{profile.role}</p>
            </div>

            <div className="border-l-4 border-sky-400 pl-4 py-2 bg-sky-50">
              <p className="text-sm text-gray-600 font-semibold">Status</p>
              <p
                className={`text-lg font-bold ${
                  profile.status === "BANNED"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {profile.status}
              </p>
            </div>

            <div className="border-l-4 border-sky-400 pl-4 py-2 bg-sky-50">
              <p className="text-sm text-gray-600 font-semibold">
                Member Since
              </p>
              <p className="text-lg text-gray-800">
                {new Date(profile.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 flex gap-3">
            <Link
              href="/dashboard/profile/editPage"
              className="flex-1 bg-sky-500 text-white text-center py-3 rounded-lg hover:bg-sky-600 font-medium"
            >
              Edit Profile
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Confirm Delete
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
