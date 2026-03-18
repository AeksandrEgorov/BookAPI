// Middleware: error handler
import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(error);

  if (error instanceof Error) {
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    error: "Internal server error",
  });
}