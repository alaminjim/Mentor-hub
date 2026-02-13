// src/app/actions/booking.actions.ts
"use server";

import { cookies } from "next/headers";
import { CreateBookingInput } from "@/type/bookingType";
import { env } from "../../../env";

const API_URL = env.BACKEND_URL;

export async function createBooking(bookingData: CreateBookingInput) {
  try {
    const cookieStore = await cookies();

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

export async function getAllBookings() {
  try {
    const cookieStore = await cookies();

    const response = await fetch(`${API_URL}/api/booking`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch bookings");
    }

    const data = await response.json();

    return { success: true, data: data.data || data };
  } catch (error: any) {
    return { success: false, error: error.message, data: null };
  }
}

export async function updateBookingStatus(bookingId: string, status: string) {
  try {
    if (!bookingId || bookingId === "undefined") {
      return {
        success: false,
        error: "Invalid booking ID",
      };
    }

    const cookieStore = await cookies();

    const response = await fetch(`${API_URL}/api/booking/status/${bookingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.message || "Failed to update booking status");
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
