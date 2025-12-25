import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Log environment variables (without exposing secrets)
        console.log("S3 Config:", {
            region: process.env.S3_REGION,
            bucket: process.env.S3_BUCKET_NAME,
            hasAccessKey: !!process.env.S3_ACCESS_KEY,
            hasSecretKey: !!process.env.S3_SECRET_ACCESS_KEY,
        });

        const { fileName, fileType, folder } = await request.json();
        console.log("Request payload:", { fileName, fileType, folder });

        if (!process.env.S3_REGION || !process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_ACCESS_KEY || !process.env.S3_BUCKET_NAME) {
            throw new Error("Missing S3 environment variables");
        }

        const s3Client = new S3Client({
            region: process.env.S3_REGION,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
        });

        const key = `${folder}/${fileName.replace(/\s+/g, "").trim()}`;
        console.log("S3 Key:", key);

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            ContentType: fileType,
        });

        const presignedUrl = await getSignedUrl(s3Client as any, command, {
            expiresIn: 3600,
        });

        console.log("Presigned URL generated successfully");
        return NextResponse.json({ presignedUrl, key });

    } catch (error: any) {
        console.error("Detailed error:", {
            message: error.message,
            name: error.name,
            stack: error.stack,
        });

        return NextResponse.json(
            { error: "Failed to generate upload URL", details: error.message },
            { status: 500 }
        );
    }
}