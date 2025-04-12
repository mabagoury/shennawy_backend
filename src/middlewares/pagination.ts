import { Request, Response, NextFunction } from "express";

declare namespace Express {
  export interface Request {
    pagination?: {
      limit: number;
      offset: number;
    };
  }
}

export default function paginationMiddleware(req: Request, res: Response, next: NextFunction) {
    let limit = parseInt(req.query.limit as string) || 10;
    let offset = parseInt(req.query.offset as string) || 0;

    if (limit > 100) {
        res.status(400).json({ error: "Limit cannot exceed 100" });
        return; // Return with no values to avoid TypeScript errors
    }

    if (offset < 0) {
        res.status(400).json({ error: "Offset cannot be a negative number" });
        return; // Return with no values to avoid TypeScript errors
    }

    req.pagination = { limit, offset };

    next();
}