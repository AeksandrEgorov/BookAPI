// Middleware: error handler
// + Prisma error handling
import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";

type ErrorDetail = {
  field: string;
  message: string;
};

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      let field = "unknown";

      if (Array.isArray(target) && target.length > 0) {
        const firstTarget = target[0];

        if (typeof firstTarget === "string") {
          field = firstTarget;
        }
      }

      res.status(400).json({
        error: "Validation failed",
        details: [
          {
            field,
            message:
              field === "isbn"
                ? "Book with this ISBN already exists"
                : "Unique constraint failed",
          },
        ] satisfies ErrorDetail[],
      });
      return;
    }

    if (error.code === "P2003") {
      res.status(400).json({
        error: "Validation failed",
        details: [
          {
            field: "relation",
            message: "Invalid related entity id",
          },
        ] satisfies ErrorDetail[],
      });
      return;
    }

    if (error.code === "P2025") {
      res.status(404).json({
        error: "Not found",
        details: [
          {
            field: "resource",
            message: "Requested resource was not found",
          },
        ] satisfies ErrorDetail[],
      });
      return;
    }
  }

  if (error instanceof Error) {
    res.status(500).json({
      error: "Internal server error",
      details: [
        {
          field: "server",
          message: error.message,
        },
      ] satisfies ErrorDetail[],
    });
    return;
  }

  res.status(500).json({
    error: "Internal server error",
    details: [
      {
        field: "server",
        message: "Unknown error",
      },
    ] satisfies ErrorDetail[],
  });
}