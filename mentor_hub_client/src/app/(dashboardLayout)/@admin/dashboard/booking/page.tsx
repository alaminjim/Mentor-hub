import { getAllBookings } from "@/components/service/booking.service";
import { CalendarDays } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-blue-500 text-white";
    case "COMPLETED":
      return "bg-green-500 text-white";
    case "CANCELLED":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const formatDateTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const AllBookingsPage = async () => {
  const { data: bookings } = await getAllBookings();

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-sky-500 to-sky-600 text-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarDays size={20} />
            All Bookings
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sky-50 text-sky-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Subject</th>

                <th className="px-6 py-3 text-left font-semibold">Scheduled</th>
                <th className="px-6 py-3 text-left font-semibold">Duration</th>
                <th className="px-6 py-3 text-left font-semibold">Price</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-sky-50">
              {Array.isArray(bookings) && bookings.length > 0 ? (
                bookings.map((booking: any) => (
                  <tr
                    key={booking._id || booking.id}
                    className="hover:bg-sky-50 transition"
                  >
                    <td className="px-6 py-4 text-gray-600 font-semibold">
                      {booking.subject}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {formatDateTime(booking.scheduledAt)}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {booking.duration} hour{booking.duration > 1 ? "s" : ""}
                    </td>

                    <td className="px-6 py-4 text-sky-600 font-semibold">
                      ৳{booking.totalPrice}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllBookingsPage;
