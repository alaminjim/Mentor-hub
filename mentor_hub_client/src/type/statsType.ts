export interface StatsDataType {
  totalUsers?: number;
  totalTutors?: number;
  totalStudents?: number;
  totalBookings?: number;
  totalSessions?: number;
  cancelledBookings?: number;
  averageRating?: number;
  recentActivities?: IRecentActivity[];
}

export interface IRecentActivity {
  id: string;
  type: "booking" | "user" | "review";
  message: string;
  time: string;
  createdAt: Date;
}
