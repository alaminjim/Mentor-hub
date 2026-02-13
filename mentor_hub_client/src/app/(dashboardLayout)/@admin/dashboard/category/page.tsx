"use client";

import {
  Category,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/components/service/category.service";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createCategory(formData);
      setFormData({ name: "", description: "" });
      setIsCreating(false);
      await fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setLoading(true);
    setError("");

    try {
      const updateData: UpdateCategoryData = {
        name: formData.name,
        description: formData.description,
      };
      await updateCategory(editingId, updateData);
      setFormData({ name: "", description: "" });
      setEditingId(null);
      await fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update category",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError("");

    try {
      await deleteCategory(id);
      setDeleteConfirm(null);
      await fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category",
      );
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
    setError("");
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setFormData({ name: "", description: "" });
    setError("");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-sky-600">Categories</h1>
        {!editingId && (
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
          >
            {isCreating ? "Cancel" : "+ Create Category"}
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-sky-600 mb-4">
            {editingId ? "Edit Category" : "Create New Category"}
          </h2>
          <form
            onSubmit={editingId ? handleUpdate : handleCreate}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter category description (optional)"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? editingId
                    ? "Updating..."
                    : "Creating..."
                  : editingId
                    ? "Update Category"
                    : "Create Category"}
              </button>
              <button
                type="button"
                onClick={editingId ? cancelEdit : cancelCreate}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {error && !isCreating && !editingId && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-sky-200 text-sky-900">
            <tr>
              <th className="py-3 px-4 border-b text-left">Name</th>
              <th className="py-3 px-4 border-b text-left">Description</th>
              <th className="py-3 px-4 border-b text-left">Date</th>
              <th className="py-3 px-4 border-b text-left">Time</th>
              <th className="py-3 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((cat) => {
                const createdAt = new Date(cat.createdAt);
                const date = createdAt.toLocaleDateString();
                const time = createdAt.toLocaleTimeString();

                return (
                  <tr key={cat.id} className="hover:bg-sky-50">
                    <td className="py-2 px-4 border-b">{cat.name}</td>
                    <td className="py-2 px-4 border-b">
                      {cat.description || "-"}
                    </td>
                    <td className="py-2 px-4 border-b">{date}</td>
                    <td className="py-2 px-4 border-b">{time}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(cat)}
                          disabled={loading || !!editingId}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm disabled:opacity-50"
                        >
                          Edit
                        </button>
                        {deleteConfirm === cat.id ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDelete(cat.id)}
                              disabled={loading}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm disabled:opacity-50"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              disabled={loading}
                              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(cat.id)}
                            disabled={loading || !!editingId}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm disabled:opacity-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
