"use client";

import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { deleteUser } from "@/components/service/user.service";
import { useRouter } from "next/navigation";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
  userRole: string;
}

export default function DeleteUserButton({
  userId,
  userName,
  userRole,
}: DeleteUserButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  if (userRole === "ADMIN") {
    return (
      <button
        disabled
        className="px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg text-xs font-medium cursor-not-allowed"
        title="Cannot delete admin users"
      >
        <Trash2 size={14} />
      </button>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Deleting user...");

    try {
      const result = await deleteUser(userId);

      if (result.success) {
        toast.success(result.message || "User deleted successfully!", {
          id: toastId,
        });
        setShowConfirm(false);

        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete user", {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user", {
        id: toastId,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
      >
        <Trash2 size={14} />
        Delete
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-600" size={32} />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Delete User?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">{userName}</span>?
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={20} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
