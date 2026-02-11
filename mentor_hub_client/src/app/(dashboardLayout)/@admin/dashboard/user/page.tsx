import { getAllUsers } from "@/components/service/user.service";
import { Trash2, Shield, User } from "lucide-react";

const AllUsersPage = async () => {
  const { data: users } = await getAllUsers();

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-sky-500 to-sky-600 text-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User size={20} />
            All Users
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sky-50 text-sky-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Role</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-sky-50">
              {Array.isArray(users) &&
                users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-sky-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {user.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">{user.email}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          user.role === "ADMIN"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsersPage;
