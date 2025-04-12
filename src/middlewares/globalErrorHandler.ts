import { Request, Response, NextFunction } from "express";
import logger from "../config/logger.js";

export default function globalErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    logger.error(err.stack || err);

    res.status(statusCode).json({
        status: "error",
        message: message,
    });
}
