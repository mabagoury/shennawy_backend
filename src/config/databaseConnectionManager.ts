import mongoose, { Connection } from 'mongoose';
import logger from './logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { getEnvironment } from './environment.js';
import compileModels from '../utils/compileModels.js';
import loadPackage from '../utils/loadPackage.js';
import modelNamesRegistry from '../modelNamesRegistry.js';

// This connection manager currently handles a single connection
// However, we inject the returned connection into the controllers
// So, if we develop the manager in the future to manage
// multiple connections, the changes are encapsulated here.
// Examples include multi-tenancy, sharding, and using separate connection pools for
// a bunch of long-running queries to avoid head-of-line blocking
let connection: Connection | null = null;

async function createConnection(uri: string): Promise<Connection> {
  const connection = mongoose.createConnection(uri);

  // TODO: We should replace the full URI with shorter version excluding username and password
  connection.on('connecting', () => logger.info(`Connecting to central database: ${uri}...`));
  connection.on('connected', () => logger.info(`Connected to central database: ${uri}`));
  connection.on('reconnected', () => logger.info(`Reconnected to central database: ${uri}`));
  connection.on('error', (error) => logger.error(`Connection error at central database ${uri}: ${error}`));
  connection.on('disconnecting', () => logger.info(`Disconnecting from central database: ${uri}...`));
  connection.on('disconnected', () => logger.info(`Disconnected from central database: ${uri}`));

  // ensures the connection is in `connected` state before proceeding
  await connection.asPromise();

  return connection;
}


export async function connect(): Promise<Connection> {
  if (connection) return connection;

  const environment = getEnvironment();
  const uri = environment.DATABASE_URL;

  const newConnection = await createConnection(uri);

  // Compile and internally attach common and metadata models to the connection
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const schemasPackagePath = path.resolve(__dirname, "..", 'schemas');
  const schemasRegistry = await loadPackage(schemasPackagePath);
  compileModels(newConnection, schemasRegistry, modelNamesRegistry);

  // Only cache the connection after correctly compiling its models
  connection = newConnection;

  return connection;
}

export async function disconnect(): Promise<void> {
  if (!connection) return;

  await connection.close();
  connection = null;
}
