import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';

export default function validationMiddleware(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return; // Return with no values to avoid TypeScript errors
  }

  // Replace req.body/query/params with sanitized + validated data
  req.body = matchedData(req, { locations: ['body'] });
  req.query = matchedData(req, { locations: ['query'] });
  req.params = matchedData(req, { locations: ['params'] });

  next();
}
