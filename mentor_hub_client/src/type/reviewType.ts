export interface CreateReviewData {
  tutorId: string;
  rating: number;
  comment?: string;
  bookingId?: string;
}

export interface ReviewDataType {
  id: string;
  studentId: string;
  tutorId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
