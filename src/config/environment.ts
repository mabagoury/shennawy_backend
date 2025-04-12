import dotenv from 'dotenv';

interface Environment {
  LOGGER_LEVEL?: string;
  PORT?: number;
  DATABASE_URL: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  AWS_APARTMENT_IMAGES_BUCKET: string;
}

let environment: Environment | null = null;

function initializeEnvironment(): void {  
  environment = {
    LOGGER_LEVEL: process.env.LOGGER_LEVEL,
    PORT: parseInt(process.env.PORT as string) || 8000,
    DATABASE_URL: process.env.DATABASE_URL!,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    AWS_REGION: process.env.AWS_REGION!,
    AWS_APARTMENT_IMAGES_BUCKET: process.env.AWS_APARTMENT_IMAGES_BUCKET!,
  };
}

export function loadEnvironment(path: string): void {
  if (!path) {
    throw new Error('Missing .env file path. You must pass a valid path.');
  }

  dotenv.config({ path });
  initializeEnvironment();
}

export function getEnvironment(): Environment {
  if (!environment) {
    throw new Error('Environment has not been initialized. Call loadEnvironment() first.');
  }

  return environment;
}
