import { S3Client } from "@aws-sdk/client-s3";
import { getEnvironment } from "./environment.js";

interface AWSServices {
    s3: S3Client;
}

let aws: AWSServices | null = null;

export function configureAWS() {
    const environment = getEnvironment();

    const s3 = new S3Client({
        region: environment.AWS_REGION,
        credentials: {
            accessKeyId: environment.AWS_ACCESS_KEY_ID,
            secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
        },
    });

    aws = { s3 };
}

export function getAWS(): AWSServices {
    if (!aws) {
        throw new Error("AWS hasn't been configured. Call configureAWS() first.");
    }

    return aws;
}
