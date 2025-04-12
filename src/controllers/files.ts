import { RequestHandler } from "express";
import { IFile } from "../types/dataTransferObjects/files.js";
import { getAWS } from "../config/aws.js";
import { getEnvironment } from "../config/environment.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getUploadUrl: RequestHandler<unknown, { url: string }, IFile, unknown> = async (
    req,
    res,
    next
) => {
    const { name, type } = req.body;

    const { s3 } = getAWS();
    const { AWS_APARTMENT_IMAGES_BUCKET } = getEnvironment();

    const command = new PutObjectCommand({
        Bucket: AWS_APARTMENT_IMAGES_BUCKET,
        Key: name,
        ContentType: type,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

    res.json({ url });
};
