import { Status } from "../../generated/prisma/client/index.js";
import { Role } from "./role.js";

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
