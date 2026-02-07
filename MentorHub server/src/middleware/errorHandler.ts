import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Internal server error";

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Invalid query: missing or wrong field type";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
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
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
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
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
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
    timestamp: new Date(),
  });
}

export default errorHandler;
