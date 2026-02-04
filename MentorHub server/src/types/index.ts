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
