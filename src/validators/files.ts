import { body } from "express-validator";
import validationMiddleware from "../middlewares/validation.js";

export const getUploadUrl = [
    body("name").isString().notEmpty().withMessage("Name must be a non-empty string"),
    body("type")
        .isString()
        .isIn(["image/jpeg", "image/png", "image/gif", "image/webp"])
        .withMessage("Type must be a valid image MIME type"),
    validationMiddleware,
];
