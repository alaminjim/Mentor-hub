export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface BookingDataType {
  _id: string;
  id?: string;
  tutorId:
    | string
    | {
        _id?: string;
        id?: string;
        name: string;
        email: string;
      };
  studentId:
    | string
    | {
        _id?: string;
        id?: string;
        name: string;
        email: string;
      };
  categoryId:
    | string
    | {
        _id?: string;
        id?: string;
        name: string;
      };
  subject: string;
  scheduledAt: string;
  duration: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingInput {
  tutorId: string;
  studentId: string;
  categoryId: string;
  subject: string;
  scheduledAt: string;
  duration: number;
  totalPrice: number;
}
