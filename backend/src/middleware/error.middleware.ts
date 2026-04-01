// Middleware: error handler
// + Prisma error handling
import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";

type ErrorDetail = {
  field: string;
  message: string;
};

type DriverAdapterCause = {
  originalCode?: string;
  originalMessage?: string;
  kind?: string;
  constraint?: unknown;
};

type DriverAdapterErrorMeta = {
  cause?: DriverAdapterCause;
};

type PrismaErrorMeta = {
  target?: unknown;
  modelName?: string;
  driverAdapterError?: DriverAdapterErrorMeta;
};

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const meta = error.meta as PrismaErrorMeta | undefined;


    if (error.code === "P2002") {
      let field = "unknown";
      let message = "Unique constraint failed";

      const target = meta?.target;
      const originalMessage = meta?.driverAdapterError?.cause?.originalMessage;

      if (Array.isArray(target) && target.length > 0) {
        field = String(target[0]);
      } else if (typeof target === "string") {
        field = target;
      }

      if (typeof originalMessage === "string" && originalMessage.trim() !== "") {
        message = originalMessage;
      } else if (field === "isbn") {
        message = "Book with this ISBN already exists";
      }

      res.status(400).json({
        error: "Validation failed",
        details: [
          {
            field,
            message,
          },
        ] satisfies ErrorDetail[],
      });
      return;
    }

    if (error.code === "P2003") {
      let field = "relation";
      let message = "Invalid related entity id";

      const target = meta?.target;

      if (Array.isArray(target) && target.length > 0) {
        field = String(target[0]);
      } else if (typeof target === "string") {
        field = target;
      }

      res.status(400).json({
        error: "Validation failed",
        details: [
          {
            field,
            message,
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

    res.status(400).json({
      error: "Database request failed",
      details: [
        {
          field: "database",
          message: error.message,
        },
      ] satisfies ErrorDetail[],
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      error: "Validation failed",
      details: [
        {
          field: "request",
          message: error.message,
        },
      ] satisfies ErrorDetail[],
    });
    return;
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