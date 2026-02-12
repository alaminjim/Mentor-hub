export type TutorDataType = {
  _id: string;
  id: string;
  userId: string;
  name: string;
  bio: string | null;
  phone: string;
  email: string;
  subjects: string[];
  price: number;
  experience: number;
  rating: number;
  totalReviews: number;
  availability: {
    [day: string]: string[];
  } | null;
  hourlyRate: number;
  createdAt: string;
  updatedAt: string;
};
