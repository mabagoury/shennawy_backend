import { RequestHandler } from "express";
import PaginationResponse from "../types/utils/paginationResponse.js";
import ModelNamesRegistry from "../modelNamesRegistry.js";
import { IApartment } from "../types/dataTransferObjects/apartments.js";
import { NotFoundError } from 'http-errors-enhanced';
import { RootFilterQuery } from "mongoose";

export const createApartment: RequestHandler<unknown, IApartment, IApartment, unknown> = async (
    req,
    res,
    next
) => {
    const Apartment = req.databaseConnection.model<IApartment>(ModelNamesRegistry.apartment);

    const apartment = await Apartment.create(req.body);

    res.status(201).json(apartment);
};

export const getApartment: RequestHandler<{ id: string }, IApartment, unknown, unknown> = async (
    req,
    res,
    next
) => {
    const Apartment = req.databaseConnection.model<IApartment>(ModelNamesRegistry.apartment);

    const { id } = req.params;

    const apartment = await Apartment.findById(id).lean();

    if (!apartment) {
        return next(new NotFoundError("Apartment NOT found"));
    }

    res.status(200).json(apartment);
};

export const getApartments: RequestHandler<
    unknown,
    PaginationResponse<IApartment>,
    unknown,
    Pick<IApartment, "title" | "number" | "project">
> = async (req, res, next) => {
    const Apartment = req.databaseConnection.model<IApartment>(ModelNamesRegistry.apartment);

    const { limit, offset } = req.pagination!;
    const { title, number, project } = req.query;
    
    const filter: RootFilterQuery<IApartment> = {
        ...(number && { number }),
        ...(project && { project }),
    };

    if (title) {
      filter.$text = { $search: title };
    }

    const apartments = await Apartment.find(filter).skip(offset).limit(limit).lean();

    const total = await Apartment.countDocuments(filter);

    res.status(200).json({
        data: apartments,
        pagination: {
            total,
            limit,
            offset,
        },
    });
};
