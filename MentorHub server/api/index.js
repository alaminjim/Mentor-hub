var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express7 from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id              String        @id\n  name            String\n  email           String\n  emailVerified   Boolean       @default(false)\n  image           String?\n  createdAt       DateTime      @default(now())\n  updatedAt       DateTime      @updatedAt\n  sessions        Session[]\n  accounts        Account[]\n  studentBookings Booking[]     @relation("StudentBookings")\n  reviews         Review[]\n  tutorProfile    TutorProfile?\n\n  role   String @default("STUDENT")\n  status Status @default(UnBAN)\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel TutorProfile {\n  id     String @id @default(uuid())\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  name         String\n  bio          String?\n  phone        String?\n  email        String?\n  subjects     String[]\n  price        Float\n  experience   Int      @default(0)\n  rating       Float    @default(0)\n  totalReviews Int      @default(0)\n  availability Json?\n  hourlyRate   Float\n\n  categories Category[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  bookings Booking[] @relation("TutorBookings")\n  reviews  Review[]\n}\n\nmodel Category {\n  id          String   @id @default(uuid())\n  name        String   @unique\n  description String?\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  tutors   TutorProfile[]\n  bookings Booking[]\n}\n\nmodel Booking {\n  id String @id @default(uuid())\n\n  studentId String\n  student   User   @relation("StudentBookings", fields: [studentId], references: [id], onDelete: Cascade)\n\n  tutorId String\n  tutor   TutorProfile @relation("TutorBookings", fields: [tutorId], references: [id], onDelete: Cascade)\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  subject     String\n  scheduledAt DateTime\n  time        String?\n  duration    Int\n  totalPrice  Float\n\n  status    BookingStatus @default(CONFIRMED)\n  createdAt DateTime      @default(now())\n  updatedAt DateTime      @updatedAt\n}\n\nmodel Review {\n  id        String       @id @default(uuid())\n  studentId String\n  student   User         @relation(fields: [studentId], references: [id], onDelete: Cascade)\n  tutorId   String\n  tutor     TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  rating    Int\n  comment   String?\n  createdAt DateTime     @default(now())\n}\n\nenum Role {\n  ADMIN\n  STUDENT\n  TUTOR\n}\n\nenum Status {\n  UnBAN\n  BANNED\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"Status"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"name","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"subjects","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"availability","kind":"scalar","type":"Json"},{"name":"hourlyRate","kind":"scalar","type":"Float"},{"name":"categories","kind":"object","type":"Category","relationName":"CategoryToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Booking","relationName":"TutorBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"tutors","kind":"object","type":"TutorProfile","relationName":"CategoryToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToCategory"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorBookings"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"BookingToCategory"},{"name":"subject","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"time","kind":"scalar","type":"String"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  TutorProfile: "TutorProfile",
  Category: "Category",
  Booking: "Booking",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  name: "name",
  bio: "bio",
  phone: "phone",
  email: "email",
  subjects: "subjects",
  price: "price",
  experience: "experience",
  rating: "rating",
  totalReviews: "totalReviews",
  availability: "availability",
  hourlyRate: "hourlyRate",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BookingScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorId: "tutorId",
  categoryId: "categoryId",
  subject: "subject",
  scheduledAt: "scheduledAt",
  time: "time",
  duration: "duration",
  totalPrice: "totalPrice",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorId: "tutorId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        input: true
      },
      status: {
        type: "string",
        defaultValue: "UnBAN"
      }
    }
  },
  emailAndPassword: {
    enabled: true
  }
});

// src/modules/auth/auth.route.ts
import express from "express";

// src/modules/auth/auth.service.ts
var authGetMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  return user;
};
var getAll = async (userId, role) => {
  const existUser = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    }
  });
  if (!existUser) {
    throw new Error("User can not exist");
  }
  if (role !== "ADMIN" /* ADMIN */) {
    throw new Error("Only Admin can access");
  }
  const result = await prisma.user.findMany({
    where: {
      role: {
        not: "ADMIN" /* ADMIN */
      }
    }
  });
  return result;
};
var updateStatus = async (statusId, currentUser, data) => {
  if (currentUser.role !== "ADMIN" /* ADMIN */) {
    throw new Error("Only Admin can access");
  }
  await prisma.user.findUniqueOrThrow({ where: { id: statusId } });
  const result = await prisma.user.update({
    where: {
      id: statusId,
      role: {
        not: "ADMIN" /* ADMIN */
      }
    },
    data
  });
  return result;
};
var adminStatsService = async () => {
  try {
    const [
      totalUsers,
      totalTutors,
      totalBookings,
      cancelledBookings,
      averageRatingResult
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { role: "TUTOR" }
      }),
      prisma.booking.count(),
      prisma.booking.count({
        where: { status: "CANCELLED" }
      }),
      prisma.review.aggregate({
        _avg: {
          rating: true
        }
      })
    ]);
    const averageRating = averageRatingResult._avg.rating || 0;
    return {
      totalUsers,
      totalTutors,
      totalBookings,
      cancelledBookings,
      averageRating: Number(averageRating.toFixed(2))
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw new Error("Failed to fetch admin statistics");
  }
};
var userDelete = async (userId, role) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    }
  });
  if (role !== "ADMIN") {
    throw new Error("Only admin can delete this user");
  }
  return await prisma.user.delete({
    where: {
      id: userId
    }
  });
};
var authService = {
  authGetMe,
  getAll,
  updateStatus,
  adminStatsService,
  userDelete
};

// src/modules/auth/auth.controller.ts
var getMe = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }
    const user = await authService.authGetMe(session.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    if (user.status === "BANNED") {
      return res.status(403).json({
        success: false,
        message: "Account is banned"
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
var getAll2 = async (req, res, next) => {
  try {
    const user = req?.user;
    const result = await authService.getAll(
      user?.id,
      user?.role
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateStatus2 = async (req, res, next) => {
  try {
    const { statusId } = req.params;
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    const result = await authService.updateStatus(
      statusId,
      currentUser,
      req.body
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
var getAdminStats = async (req, res, next) => {
  try {
    const stats = await authService.adminStatsService();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
var userDelete2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req?.user;
    const result = await authService.userDelete(
      id,
      user?.role
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
var authController = {
  getMe,
  getAll: getAll2,
  updateStatus: updateStatus2,
  getAdminStats,
  userDelete: userDelete2
};

// src/middleware/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session?.user) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized"
        });
      }
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        status: session.user.status
      };
      if (req.user.status === "BANNED") {
        return res.status(403).json({
          success: false,
          message: "Your account has been banned"
        });
      }
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission to access this resource"
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Authentication error",
        error: error.message
      });
    }
  };
};
var auth_default = auth2;

// src/modules/auth/auth.route.ts
var router = express.Router();
router.get("/authMe", auth_default(), authController.getMe);
router.get("/admin/users", auth_default("ADMIN" /* ADMIN */), authController.getAll);
router.delete("/admin/remove/:id", auth_default("ADMIN" /* ADMIN */), authController.userDelete);
router.get("/admin/stats", auth_default("ADMIN" /* ADMIN */), authController.getAdminStats);
router.patch(
  "/admin/user/:statusId",
  auth_default("ADMIN" /* ADMIN */),
  authController.updateStatus
);
var authRouter = router;

// src/modules/tutor/tutor.route.ts
import express2 from "express";

// src/modules/tutor/tutor.service.ts
var tutorProfile = async (data, userId, role) => {
  const exist = await prisma.tutorProfile.findUnique({
    where: {
      userId
    }
  });
  if (exist) {
    throw new Error("Tutor profile already exists");
  }
  if (role !== "TUTOR") {
    throw new Error("Only Tutor can create this profile");
  }
  const result = await prisma.tutorProfile.create({
    data: {
      ...data,
      userId,
      availability: data.availability ?? prismaNamespace_exports.DbNull
    }
  });
  return result;
};
var updateTutorProfile = async (profileId, data, currentUserId, role) => {
  const exist = await prisma.tutorProfile.findUnique({
    where: { id: profileId }
  });
  if (!exist) throw new Error("Tutor profile does not exist");
  if (role !== "TUTOR" /* TUTOR */)
    throw new Error("Only Tutor can update this profile");
  if (exist.userId !== currentUserId)
    throw new Error("This user cannot update others' tutor profile");
  const { categoryId, availability, ...profileData } = data;
  const updateData = {
    ...profileData
  };
  if (availability !== void 0) {
    updateData.availability = availability ?? prismaNamespace_exports.DbNull;
  }
  if (categoryId) {
    updateData.categories = {
      set: categoryId.map((id) => ({ id }))
    };
  }
  const result = await prisma.tutorProfile.update({
    where: { id: profileId },
    data: updateData,
    include: { categories: true }
  });
  return result;
};
var updateModerateAvailability = async (profileId, data, currentUserId, role) => {
  const exist = await prisma.tutorProfile.findUnique({
    where: { id: profileId }
  });
  if (!exist) throw new Error("Tutor profile does not exist");
  if (role !== "TUTOR" /* TUTOR */)
    throw new Error("Only Tutor can update this profile");
  if (exist.userId !== currentUserId)
    throw new Error("This user cannot update others' tutor profile");
  if (data.availability === void 0) {
    return exist;
  }
  const result = await prisma.tutorProfile.update({
    where: { id: profileId },
    data: {
      availability: data.availability ?? prismaNamespace_exports.DbNull
    }
  });
  return result;
};
var getAllTutorProfileFilter = async (payload) => {
  const SearchAndFiltering = [];
  if (payload.subject.length > 0) {
    SearchAndFiltering.push({
      subjects: {
        hasSome: payload.subject
      }
    });
  }
  const result = await prisma.tutorProfile.findMany({
    where: {
      AND: SearchAndFiltering
    },
    ...payload.sortBy && {
      orderBy: {
        [payload.sortBy]: payload.sortOrder || "asc"
      }
    },
    include: {
      reviews: true
    }
  });
  return result;
};
var getAllTutorProfile = async () => {
  const result = await prisma.tutorProfile.findMany({
    include: {
      reviews: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  return result;
};
var getAllTutorProfileOwn = async (tutorId) => {
  const result = await prisma.tutorProfile.findUniqueOrThrow({
    where: {
      id: tutorId
    },
    include: {
      reviews: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  return result;
};
var getTutorDashboard = async (tutorUserId) => {
  const now = /* @__PURE__ */ new Date();
  const tutorProfile3 = await prisma.tutorProfile.findUnique({
    where: { userId: tutorUserId }
  });
  if (!tutorProfile3) throw new Error("Tutor profile not found");
  const tutorId = tutorProfile3.id;
  const totalSessions = await prisma.booking.count({ where: { tutorId } });
  const upcomingSessions = await prisma.booking.count({
    where: { tutorId, scheduledAt: { gt: now } }
  });
  const pastSessions = await prisma.booking.count({
    where: { tutorId, scheduledAt: { lt: now }, status: "COMPLETED" }
  });
  const confirmedSessions = await prisma.booking.count({
    where: { tutorId, status: "CONFIRMED" }
  });
  const completedSessions = pastSessions;
  const cancelledSessions = await prisma.booking.count({
    where: { tutorId, status: "CANCELLED" }
  });
  const completedPercentage = totalSessions ? Math.round(completedSessions / totalSessions * 100) : 0;
  return {
    totalSessions,
    upcomingSessions,
    pastSessions,
    statusBreakdown: {
      confirmed: confirmedSessions,
      completed: completedSessions,
      cancelled: cancelledSessions
    },
    quickStats: {
      completedPercentage
    }
  };
};
var ownProfile = async (id, role) => {
  if (role !== "TUTOR") {
    throw new Error("Only This can see own Profile");
  }
  return await prisma.tutorProfile.findUniqueOrThrow({
    where: {
      userId: id
    },
    include: {
      reviews: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
};
var ownProfileDelete = async (id, role) => {
  if (role !== "TUTOR") {
    throw new Error("Only This can delete own Profile");
  }
  return await prisma.tutorProfile.delete({
    where: {
      id
    }
  });
};
var ownProfileUpdate = async (id, role, data) => {
  if (role !== "TUTOR") {
    throw new Error("Only This can update own Profile");
  }
  return await prisma.tutorProfile.update({
    where: {
      id
    },
    data: {
      ...data,
      availability: data.availability ?? prismaNamespace_exports.DbNull
    }
  });
};
var tutorService = {
  tutorProfile,
  updateTutorProfile,
  getAllTutorProfile,
  getAllTutorProfileOwn,
  updateModerateAvailability,
  getTutorDashboard,
  getAllTutorProfileFilter,
  ownProfile,
  ownProfileDelete,
  ownProfileUpdate
};

// src/modules/tutor/tutor.controller.ts
var tutorProfile2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "unAuthorized"
      });
    }
    const result = await tutorService.tutorProfile(
      req.body,
      user?.id,
      user?.role
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateTutorProfile2 = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "unAuthorized"
      });
    }
    const result = await tutorService.updateTutorProfile(
      profileId,
      req.body,
      user?.id,
      user?.role
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateModerateAvailability2 = async (req, res, next) => {
  try {
    const { tutorId } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "unAuthorized"
      });
    }
    const result = await tutorService.updateModerateAvailability(
      tutorId,
      req.body,
      user?.id,
      user?.role
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllTutorProfileFilter2 = async (req, res, next) => {
  try {
    const { search, sortBy, sortOrder } = req.query;
    const searchBySubjects = search ? search.split(",") : [];
    const result = await tutorService.getAllTutorProfileFilter({
      subject: searchBySubjects,
      sortBy: sortBy || void 0,
      sortOrder: sortOrder || void 0
    });
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllTutorProfile2 = async (req, res, next) => {
  try {
    const result = await tutorService.getAllTutorProfile();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllTutorProfileOwn2 = async (req, res, next) => {
  try {
    const { tutorId } = req.params;
    if (!tutorId) {
      return res.status(400).json({
        success: false,
        message: "Tutor id is required"
      });
    }
    const result = await tutorService.getAllTutorProfileOwn(tutorId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getTutorDashboard2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    if (user.role !== "TUTOR") {
      return res.status(403).json({
        success: false,
        message: "Only tutors can access this dashboard"
      });
    }
    const dashboardData = await tutorService.getTutorDashboard(user.id);
    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    next(error);
  }
};
var ownProfile2 = async (req, res, next) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await tutorService.ownProfile(user?.id, user?.role);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var ownProfileDelete2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await tutorService.ownProfileDelete(
      id,
      user?.role
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var ownProfileUpdate2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await tutorService.ownProfileUpdate(
      id,
      user?.role,
      req.body
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var tutorProfileController = {
  tutorProfile: tutorProfile2,
  updateTutorProfile: updateTutorProfile2,
  getAllTutorProfile: getAllTutorProfile2,
  getAllTutorProfileOwn: getAllTutorProfileOwn2,
  updateModerateAvailability: updateModerateAvailability2,
  getTutorDashboard: getTutorDashboard2,
  getAllTutorProfileFilter: getAllTutorProfileFilter2,
  ownProfile: ownProfile2,
  ownProfileDelete: ownProfileDelete2,
  ownProfileUpdate: ownProfileUpdate2
};

// src/modules/tutor/tutor.route.ts
var router2 = express2.Router();
router2.get("/", tutorProfileController.getAllTutorProfile);
router2.get("/filter", tutorProfileController.getAllTutorProfileFilter);
router2.get(
  "/dashboard",
  auth_default("TUTOR" /* TUTOR */),
  tutorProfileController.getTutorDashboard
);
router2.get("/:tutorId", tutorProfileController.getAllTutorProfileOwn);
router2.get("/own/profile", auth_default("TUTOR" /* TUTOR */), tutorProfileController.ownProfile);
router2.delete(
  "/own/profile/:id",
  auth_default("TUTOR" /* TUTOR */),
  tutorProfileController.ownProfileDelete
);
router2.patch(
  "/profile/update/:id",
  auth_default("TUTOR" /* TUTOR */),
  tutorProfileController.ownProfileUpdate
);
router2.post("/profile", auth_default("TUTOR" /* TUTOR */), tutorProfileController.tutorProfile);
router2.put(
  "/update/:profileId",
  auth_default("TUTOR" /* TUTOR */),
  tutorProfileController.updateTutorProfile
);
router2.patch(
  "/availability/:tutorId",
  auth_default("TUTOR" /* TUTOR */),
  tutorProfileController.updateModerateAvailability
);
var tutorRouter = router2;

// src/modules/review/review.route.ts
import express3 from "express";

// src/modules/review/review.service.ts
var createReview = async (payload) => {
  const student = await prisma.user.findUnique({
    where: { id: payload.studentId }
  });
  if (!student || student.role !== "STUDENT") {
    throw new Error("Invalid student");
  }
  const tutorProfile3 = await prisma.tutorProfile.findUnique({
    where: { id: payload.tutorId }
  });
  if (!tutorProfile3) {
    throw new Error("Tutor not found");
  }
  if (payload.rating >= 1 !== payload.rating <= 5) {
    throw new Error("You Rating Will be 1-5");
  }
  const result = await prisma.review.create({
    data: {
      studentId: payload.studentId,
      tutorId: tutorProfile3.id,
      rating: payload.rating,
      comment: payload.comment ?? null
    }
  });
  const reviews = await prisma.review.findMany({
    where: { tutorId: tutorProfile3.id },
    select: { rating: true }
  });
  const totalReviews = reviews.length;
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;
  await prisma.tutorProfile.update({
    where: { id: tutorProfile3.id },
    data: {
      totalReviews,
      rating: avgRating
    }
  });
  return result;
};
var updateReview = async (userId, reviewId, role, data) => {
  const exists = await prisma.review.findFirstOrThrow({
    where: {
      id: reviewId
    }
  });
  if (role !== "STUDENT") {
    throw new Error("Only students can update reviews");
  }
  if (userId !== exists.studentId) {
    throw new Error("You can only update your own reviews");
  }
  return await prisma.review.update({
    where: {
      id: reviewId
    },
    data
  });
};
var getReview = async () => {
  return await prisma.review.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getOwnReview = async (id, role) => {
  if (role !== "STUDENT") {
    throw new Error("Only this student can see this review");
  }
  return await prisma.review.findMany({
    where: {
      studentId: id
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var deleteReview = async (userId, reviewId, role) => {
  const exists = await prisma.review.findFirstOrThrow({
    where: {
      id: reviewId
    }
  });
  if (role !== "STUDENT") {
    throw new Error("Only students can Delete reviews");
  }
  if (userId !== exists.studentId) {
    throw new Error("You can only delete your own reviews");
  }
  return await prisma.review.delete({
    where: {
      id: reviewId
    }
  });
};
var reviewService = {
  createReview,
  updateReview,
  getReview,
  deleteReview,
  getOwnReview
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const payload = {
      studentId: user.id,
      tutorId: req.body.tutorId,
      rating: Number(req.body.rating),
      comment: req.body.comment
    };
    const result = await reviewService.createReview(payload);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateReview2 = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await reviewService.updateReview(
      user?.id,
      reviewId,
      user?.role,
      req.body
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getReview2 = async (req, res, next) => {
  try {
    const result = await reviewService.getReview();
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getOwnReview2 = async (req, res, next) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await reviewService.getOwnReview(user?.id, user?.role);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteReview2 = async (req, res, next) => {
  try {
    const { deleteId } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await reviewService.deleteReview(
      user?.id,
      deleteId,
      user?.role
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var reviewController = {
  createReview: createReview2,
  updateReview: updateReview2,
  getReview: getReview2,
  deleteReview: deleteReview2,
  getOwnReview: getOwnReview2
};

// src/modules/review/review.route.ts
var router3 = express3.Router();
router3.get("/", reviewController.getReview);
router3.get("/own", auth_default("STUDENT" /* STUDENT */), reviewController.getOwnReview);
router3.post("/create", auth_default("STUDENT" /* STUDENT */), reviewController.createReview);
router3.put("/:reviewId", auth_default("STUDENT" /* STUDENT */), reviewController.updateReview);
router3.delete(
  "/remove/:deleteId",
  auth_default("STUDENT" /* STUDENT */),
  reviewController.deleteReview
);
var reviewRouter = router3;

// src/modules/students/student.route.ts
import express4 from "express";

// src/modules/students/student.service.ts
var manageProfile = async (studentId, role, data) => {
  const exists = await prisma.user.findUniqueOrThrow({
    where: {
      id: studentId
    }
  });
  if (role !== "STUDENT" /* STUDENT */) {
    throw new Error("Only Student can manage This profile");
  }
  if (studentId !== exists.id) {
    throw new Error("You can only Manage your own Profile");
  }
  delete data.role;
  delete data.status;
  const updated = await prisma.user.update({
    where: { id: studentId },
    data
  });
  return updated;
};
var deleteProfile = async (studentId, role) => {
  const exists = await prisma.user.findUniqueOrThrow({
    where: {
      id: studentId
    }
  });
  if (role !== "STUDENT" /* STUDENT */) {
    throw new Error("Only Student can Delete This profile");
  }
  if (studentId !== exists.id) {
    throw new Error("You can only Delete your own Profile");
  }
  const updated = await prisma.user.delete({
    where: { id: studentId }
  });
  return updated;
};
var getDashboardSummary = async (userId, role) => {
  if (role !== "STUDENT") {
    throw new Error("Only Student can see that data");
  }
  const now = /* @__PURE__ */ new Date();
  const totalBookings = await prisma.booking.count({
    where: { studentId: userId }
  });
  const upcomingSessions = await prisma.booking.count({
    where: { studentId: userId, scheduledAt: { gt: now } }
  });
  const pastSessions = await prisma.booking.count({
    where: { studentId: userId, scheduledAt: { lt: now }, status: "COMPLETED" }
  });
  const cancelledBookings = await prisma.booking.count({
    where: { studentId: userId, status: "CANCELLED" }
  });
  const completedPercentage = totalBookings ? Math.round(pastSessions / totalBookings * 100) : 0;
  return {
    totalBookings,
    upcomingSessions,
    pastSessions,
    quickStats: {
      completedPercentage,
      cancelledBookings
    }
  };
};
var getStatsService = async () => {
  try {
    const totalTutors = await prisma.tutorProfile.count();
    const totalStudents = await prisma.user.count({
      where: {
        role: "STUDENT"
      }
    });
    const totalSessions = await prisma.booking.count({
      where: {
        status: "COMPLETED"
      }
    });
    const ratingAggregate = await prisma.review.aggregate({
      _avg: {
        rating: true
      }
    });
    const averageRating = ratingAggregate._avg.rating || 0;
    return {
      totalTutors,
      totalStudents,
      totalSessions,
      averageRating: parseFloat(averageRating.toFixed(2))
    };
  } catch (error) {
    console.error("getStatsService error:", error);
    throw new Error("Failed to fetch stats from database");
  }
};
var student_bookingService = {
  manageProfile,
  getDashboardSummary,
  deleteProfile,
  getStatsService
};

// src/modules/students/student.controller.ts
var manageProfile2 = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await student_bookingService.manageProfile(
      studentId,
      user.role,
      req.body
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteProfile2 = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await student_bookingService.deleteProfile(
      studentId,
      user.role
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getDashboardSummary2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const summary = await student_bookingService.getDashboardSummary(
      user.id,
      user.role
    );
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};
var getStats = async (req, res) => {
  try {
    const stats = await student_bookingService.getStatsService();
    return res.status(200).json({
      success: true,
      data: stats,
      message: "Stats retrieved successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || "Failed to retrieve stats"
    });
  }
};
var student_bookingController = {
  manageProfile: manageProfile2,
  deleteProfile: deleteProfile2,
  getDashboardSummary: getDashboardSummary2,
  getStats
};

// src/modules/students/student.route.ts
var router4 = express4.Router();
router4.get(
  "/dashboard",
  auth_default("STUDENT" /* STUDENT */),
  student_bookingController.getDashboardSummary
);
router4.get("/stats", student_bookingController.getStats);
router4.put(
  "/profile/:studentId",
  auth_default("STUDENT" /* STUDENT */),
  student_bookingController.manageProfile
);
router4.delete(
  "/remove/:studentId",
  auth_default("STUDENT" /* STUDENT */, "ADMIN" /* ADMIN */),
  student_bookingController.deleteProfile
);
var studentRouter = router4;

// src/modules/categories/categories.route.ts
import express5 from "express";

// src/modules/categories/categories.service.ts
var createCategory = async (role, data) => {
  if (role !== "ADMIN") {
    throw new Error("Only Admin can create this category");
  }
  return await prisma.category.create({
    data
  });
};
var getCategory = async () => {
  return await prisma.category.findMany();
};
var updateCategory = async (createId, role, data) => {
  await prisma.category.findUniqueOrThrow({
    where: {
      id: createId
    }
  });
  if (role !== "ADMIN") {
    throw new Error("Only Admin can update this category");
  }
  return await prisma.category.update({
    where: {
      id: createId
    },
    data
  });
};
var deleteCategory = async (createId, role) => {
  await prisma.category.findUniqueOrThrow({
    where: {
      id: createId
    }
  });
  if (role !== "ADMIN") {
    throw new Error("Only Admin can delete this category");
  }
  return await prisma.category.delete({
    where: {
      id: createId
    }
  });
};
var categoryService = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory
};

// src/modules/categories/categories.controller.ts
var createCategory2 = async (req, res, next) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await categoryService.createCategory(user?.role, req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getCategory2 = async (req, res, next) => {
  try {
    const result = await categoryService.getCategory();
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateCategory2 = async (req, res, next) => {
  try {
    const { createId } = req.params;
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await categoryService.updateCategory(
      createId,
      user?.role,
      req.body
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteCategory2 = async (req, res, next) => {
  try {
    const { deleteId } = req.params;
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await categoryService.deleteCategory(
      deleteId,
      user?.role
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var categoryController = {
  createCategory: createCategory2,
  getCategory: getCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/categories/categories.route.ts
var router5 = express5.Router();
router5.post("/create", auth_default("ADMIN" /* ADMIN */), categoryController.createCategory);
router5.get("/", categoryController.getCategory);
router5.put(
  "/update/:createId",
  auth_default("ADMIN" /* ADMIN */),
  categoryController.updateCategory
);
router5.delete(
  "/delete/:deleteId",
  auth_default("ADMIN" /* ADMIN */),
  categoryController.deleteCategory
);
var categoryRouter = router5;

// src/modules/bookings/bookings.route.ts
import express6 from "express";

// src/modules/bookings/booking.service.ts
var createBookings = async (userId, role, payload) => {
  if (role !== "STUDENT") {
    throw new Error("Only students can create bookings");
  }
  await prisma.user.findUniqueOrThrow({
    where: { id: userId }
  });
  const tutor = await prisma.tutorProfile.findUniqueOrThrow({
    where: { id: payload.tutorId }
  });
  await prisma.category.findUniqueOrThrow({
    where: { id: payload.categoryId }
  });
  const totalPrice = tutor.hourlyRate * payload.duration;
  return prisma.booking.create({
    data: {
      studentId: userId,
      tutorId: payload.tutorId,
      categoryId: payload.categoryId,
      subject: payload.subject,
      scheduledAt: payload.scheduledAt,
      duration: payload.duration,
      time: payload.time,
      totalPrice
    }
  });
};
var getBookings = async (userId, role, filter) => {
  if (role === "ADMIN") {
    return await prisma.booking.findMany();
  }
  if (role === "TUTOR") {
    const tutorProfile3 = await prisma.tutorProfile.findUnique({
      where: { userId }
    });
    if (!tutorProfile3) {
      throw new Error("Tutor profile not found");
    }
    return await prisma.booking.findMany({
      where: { tutorId: tutorProfile3.id }
    });
  }
  if (role !== "STUDENT") {
    throw new Error("Only students can view bookings");
  }
  const now = /* @__PURE__ */ new Date();
  let whereClause = { studentId: userId };
  if (filter === "upcoming") {
    whereClause.scheduledAt = { gt: now };
  } else if (filter === "past") {
    whereClause.scheduledAt = { lt: now };
    whereClause.status = "COMPLETED";
  }
  return await prisma.booking.findMany({
    where: whereClause,
    orderBy: { scheduledAt: filter === "upcoming" ? "asc" : "desc" }
  });
};
var moderateStatus = async (data, role, statusId) => {
  if (role !== "TUTOR") {
    throw new Error("Only Update Tutor");
  }
  await prisma.booking.findFirstOrThrow({
    where: {
      id: statusId
    }
  });
  return await prisma.booking.update({
    where: {
      id: statusId
    },
    data
  });
};
var getBookingById = async (userId, role, bookingId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true, category: true, student: true }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (role === "STUDENT" && booking.studentId !== userId) {
    throw new Error("Access denied");
  }
  if (role === "TUTOR" && booking.tutor.userId !== userId) {
    throw new Error("Access denied");
  }
  return booking;
};
var bookingsService = {
  createBookings,
  getBookings,
  moderateStatus,
  getBookingById
};

// src/modules/bookings/booking.controller.ts
var createBookings2 = async (req, res, next) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await bookingsService.createBookings(
      user?.id,
      user?.role,
      req.body
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getBookings2 = async (req, res, next) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const filter = req.query.filter;
    const result = await bookingsService.getBookings(
      user.id,
      user.role,
      filter
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var moderateStatus2 = async (req, res, next) => {
  try {
    const { statusId } = req.params;
    const user = req?.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await bookingsService.moderateStatus(
      req.body,
      user?.role,
      statusId
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getBookingById2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const bookingId = req.params.id;
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required"
      });
    }
    const booking = await bookingsService.getBookingById(
      user.id,
      user.role,
      bookingId
    );
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
var bookingsController = {
  createBookings: createBookings2,
  getBookings: getBookings2,
  moderateStatus: moderateStatus2,
  getBookingById: getBookingById2
};

// src/modules/bookings/bookings.route.ts
var router6 = express6.Router();
router6.get(
  "/",
  auth_default("ADMIN" /* ADMIN */, "STUDENT" /* STUDENT */, "TUTOR" /* TUTOR */),
  bookingsController.getBookings
);
router6.get(
  "/:id",
  auth_default("ADMIN" /* ADMIN */, "STUDENT" /* STUDENT */, "TUTOR" /* TUTOR */),
  bookingsController.getBookingById
);
router6.post("/create", auth_default("STUDENT" /* STUDENT */), bookingsController.createBookings);
router6.put(
  "/status/:statusId",
  auth_default("TUTOR" /* TUTOR */),
  bookingsController.moderateStatus
);
var bookingsRouter = router6;

// src/middleware/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route Not Found",
    path: req.originalUrl,
    date: Date()
  });
}

// src/middleware/errorHandler.ts
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = "Internal server error";
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Invalid query: missing or wrong field type";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 400;
        errorMessage = "Unique constraint failed";
        break;
      case "P2025":
        statusCode = 404;
        errorMessage = "Record not found or dependent record missing";
        break;
      default:
        statusCode = 400;
        errorMessage = `Database error (${err.code})`;
        break;
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    switch (err.errorCode) {
      case "P1000":
        statusCode = 400;
        errorMessage = "Authentication failed or wrong credentials";
        break;
      case "P1001":
        statusCode = 500;
        errorMessage = "Database connection failed";
        break;
      case "P1002":
        statusCode = 500;
        errorMessage = "Database URL missing or invalid";
        break;
      default:
        statusCode = 500;
        errorMessage = "Database initialization error";
        break;
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Prisma engine not connected / unknown error";
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: err,
    path: req.originalUrl,
    timestamp: /* @__PURE__ */ new Date()
  });
}
var errorHandler_default = errorHandler;

// src/app.ts
var app = express7();
app.use(express7.json());
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true
  })
);
app.use("/api/auth", authRouter);
app.use("/api/tutor", tutorRouter);
app.use("/api/review", reviewRouter);
app.use("/api/student", studentRouter);
app.use("/api/category", categoryRouter);
app.use("/api/booking", bookingsRouter);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.send({ message: "SkillBridge API Running" });
});
app.use(notFound);
app.use(errorHandler_default);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
