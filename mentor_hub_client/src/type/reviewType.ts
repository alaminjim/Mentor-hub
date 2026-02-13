export interface CreateReviewData {
  tutorId: string; // Required
  rating: number; // Required (1-5)
  comment?: string; // Optional
  bookingId?: string; // Optional - যদি লাগে future এ
}

export interface ReviewDataType {
  id: string;
  studentId: string;
  tutorId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
