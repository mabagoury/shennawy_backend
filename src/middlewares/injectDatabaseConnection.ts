import { Request, Response, NextFunction} from "express";
import { connect } from "../config/databaseConnectionManager.js";


export default async function injectMetadataConnection(req: Request, res: Response, next: NextFunction) {
    req.databaseConnection = await connect();

    next();
};