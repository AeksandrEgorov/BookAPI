// Middleware: input validators using zod
import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";

type ValidationErrorDetail = {
  field: string;
  message: string;
};

function formatZodError(error: ZodError): ValidationErrorDetail[] {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

// validate body
export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        details: formatZodError(result.error),
      });
      return;
    }

    res.locals.validatedBody = result.data;
    next();
  };
}

// validate query
export function validateQuery(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        details: formatZodError(result.error),
      });
      return;
    }

    res.locals.validatedQuery = result.data;
    next();
  };
}