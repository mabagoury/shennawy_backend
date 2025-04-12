import express from "express";
import "express-async-errors"; // automatically catch asynchronous errors to call the global error handler
import "./types/utils/express.js"; // augment the Express namespace to add fields like pagination and databaseConnection
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { connect, disconnect } from "./config/databaseConnectionManager.js";
import logger from "./config/logger.js";
import { loadEnvironment, getEnvironment } from "./config/environment.js";
import { configureAWS, getAWS } from "./config/aws.js";
import * as routers from "./routers/index.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import injectDatabaseConnection from "./middlewares/injectDatabaseConnection.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";

(async () => {
    try {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        loadEnvironment(path.join(__dirname, "..", ".env"));
        logger.info("Successfully loaded the environment variables");

        configureAWS();
        logger.info("Successfully configured the AWS client");

        await connect();
        logger.info("Successfully connected to the database");

        const app = express();

        app.get("/health", (req, res) => {
            res.status(200).json({ message: "success" });
        });

        const docs = YAML.load(path.join(__dirname, "..", "openapi.yaml"));
        app.use("/docs", swaggerUi.serve, swaggerUi.setup(docs));

        app.use(
            cors({
                origin: "http://localhost:3000",
                methods: ["GET", "POST", "PUT", "DELETE"],
                allowedHeaders: ["Content-Type", "Authorization"],
            })
        );

        app.use(express.json());

        app.use(injectDatabaseConnection);

        app.use("/apartments", routers.apartments);
        app.use("/files", routers.files);

        app.use(globalErrorHandler);

        const { PORT } = getEnvironment();
        const server = app.listen(PORT, () => {
            logger.info(`Server is up and running on port ${PORT}...`);
        });

        process.on("SIGINT", () => {
            logger.info("Closing server...");
            server.close(async error => {
                if (error) {
                    logger.error("Error closing server:", error.message);
                    process.exit(1);
                }

                logger.info("Server closed");
                logger.info("Closing database connections...");

                // Notice that Mongoose doesn't buffer connection-closing
                // commands. So, if they arrive while a query is executing,
                // they just fail silently and are not retried. This keeps
                // the event loop running so, just call process.exit(0) after it
                // and let the OS clean up our resources.
                await disconnect();

                process.exit(0);
            });
        });
    } catch (error) {
        logger.error((error as Error).message);
        logger.close();
        process.exit(1);
    }
})();
