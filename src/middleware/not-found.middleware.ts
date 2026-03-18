// Middleware: simple 404 handler
import { Request, Response, NextFunction } from "express";

export function notFoundMiddleware(
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(404).json({
    error: "Route not found",
  });
}