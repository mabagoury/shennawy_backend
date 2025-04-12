import { Connection } from "mongoose";

declare global {
    namespace Express {
        export interface Request {
            databaseConnection: Connection;
            pagination?: {
                limit: number;
                offset: number;
            };
        }
    }
}
