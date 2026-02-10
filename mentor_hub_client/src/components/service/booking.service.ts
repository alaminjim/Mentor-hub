// app/components/service/booking.service.ts
"use server";

import { cookies } from "next/headers";
import { CreateBookingInput, BookingDataType } from "@/type/bookingType";
import { env } from "../../../env";

const API_URL = env.BACKEND_URL;

export async function createBooking(bookingData: CreateBookingInput) {
  try {
    const cookieStore = cookies();

    const res = await fetch(`${API_URL}/api/booking/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(bookingData),
    });

    if (!res.ok) {
      const error = await res.json();
      return { data: null, error: error.message || "Failed to create booking" };
    }

    const result = await res.json();
    return { data: result.data || null, error: undefined };
  } catch (err) {
    console.error("Create booking error:", err);
    return { data: null, error: "Network error" };
  }
}

export async function getMyBookings(): Promise<{
  data: BookingDataType[] | null;
  error?: string;
}> {
  try {
    const cookieStore = cookies();

    const res = await fetch(`${API_URL}/api/booking`, {
      method: "GET",
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { data: null, error: "Failed to fetch bookings" };
    }

    const result = await res.json();
    return { data: result.data || [], error: undefined };
  } catch (error) {
    console.error("getMyBookings error:", error);
    return { data: null, error: "Network error" };
  }
}
