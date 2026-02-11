import { getMyBookings } from "@/components/service/booking.service";
import { CalendarDays, XCircle } from "lucide-react";

const AllBookingsPage = async () => {
  const { data: bookings } = await getMyBookings();

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden">
        {/* Header */}
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
                <th className="px-6 py-3 text-left font-semibold">Duration</th>
                <th className="px-6 py-3 text-left font-semibold">Time</th>
                <th className="px-6 py-3 text-left font-semibold">Price</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-sky-50">
              {Array.isArray(bookings) &&
                bookings.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-sky-50 transition">
                    <td className="px-6 py-4 text-gray-600 font-semibold">
                      {booking.subject}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {booking.duration}
                    </td>

                    <td className="px-6 py-4 text-gray-600">{booking.time}</td>

                    <td className="px-6 py-4 text-sky-600 font-semibold">
                      {booking.totalPrice}$
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-sky-500 rounded-full">
                        {booking.status}
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

export default AllBookingsPage;
