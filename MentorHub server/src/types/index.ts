import { Status } from "../../generated/prisma/enums";
import { Role } from "./role";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
        status: Status;
      };
    }
  }
}

export interface IAdminStats {
  totalUsers: number;
  totalTutors: number;
  totalBookings: number;
  cancelledBookings: number;
  averageRating: number;
}
