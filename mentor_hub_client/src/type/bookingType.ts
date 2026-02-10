export type BookingDataType = {
  id: string;
  studentId: string;
  tutorId: string;
  categoryId: string;
  subject: string;
  scheduledAt: string;
  time?: string;
  duration: number;
  totalPrice: number;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingInput = {
  tutorId: string;
  studentId: string;
  categoryId: string;
  subject: string;
  scheduledAt: string;
  time?: string;
  duration: number;
  totalPrice: number;
};
