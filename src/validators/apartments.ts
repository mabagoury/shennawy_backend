import { body, query, param } from "express-validator";
import validationMiddleware from "../middlewares/validation.js";

export const createApartment = [
    body("title").isString().notEmpty().withMessage("Title must be a non-empty string"),
    body("description")
        .optional()
        .isString()
        .notEmpty()
        .withMessage("Description must be a non-empty string"),
    body("location").isString().notEmpty().withMessage("Location must be a non-empty string"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),
    body("number").notEmpty().isString().withMessage("Number must be a non-empty string"),
    body("project")
        .optional()
        .isString()
        .notEmpty()
        .withMessage("Project must be a non-empty string"),
    body("thumbnail").isURL().withMessage("Thumbnail must be a valid URL"),
    body("images").optional().isArray().withMessage("Images must be an array"),
    body("images.*").isURL().withMessage("Each image must be a valid URL"),
    validationMiddleware,
];

export const getApartments = [
    query("title").optional().isString().notEmpty().withMessage("Title cannot be an empty string"),
    query("number")
        .optional()
        .isString()
        .notEmpty()
        .withMessage("Number cannot be an empty string"),
    query("project")
        .optional()
        .isString()
        .notEmpty()
        .withMessage("Number cannot be an empty string"),
    query("limit")
        .default(10)
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be an integer between 1 and 100"),
    query("offset")
        .default(0)
        .isInt({ min: 0 })
        .withMessage("Offset must be a non-negative integer"),
    validationMiddleware,
];

export const getApartment = [
    param("id").isMongoId().withMessage("Invalid ID format"),
    validationMiddleware,
];
