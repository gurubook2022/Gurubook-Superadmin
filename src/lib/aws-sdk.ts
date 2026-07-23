import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Ensure the environment variables are defined
const S3_BUCKET = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string;
const REGION = process.env.NEXT_PUBLIC_AWS_REGION as string;
const ACCESS_KEY = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY as string;
const SECRET_KEY = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string;


// Create an S3 client instance
const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,
    },
    requestChecksumCalculation: "WHEN_REQUIRED"
});
const uploadFileToAWSS3Bucket = async (file: File, folder: string, fileNameOverride?: string) => {
    // Step 1: Get presigned URL from your backend
    const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fileName: fileNameOverride ?? file.name,
            fileType: file.type,
            folder: folder,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to get upload URL");
    }

    const { presignedUrl, key } = await response.json();
    console.log("Presigned URL:", presignedUrl);

    // Step 2: Upload directly to S3 using presigned URL
    const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        // Try without Content-Type header
    });

    if (!uploadResponse.ok) {
        // Get the error response text
        const errorText = await uploadResponse.text();
        console.error("S3 Upload Error:", errorText);
        console.error("Status:", uploadResponse.status);
        throw new Error(`Failed to upload file: ${errorText}`);
    }

    return key;

    // const key = `${folder}/${file.name?.replace(/\s+/g, '')?.trim()}`
    // // File parameters
    // const params = {
    //     Bucket: S3_BUCKET,
    //     Key: key,
    //     Body: file,
    //     ContentType: file.type,
    // };

    // const command = new PutObjectCommand(params);
    // const response = await s3Client.send(command);
    // // const url = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${folder}/${(file.name)?.replace(/\s+/g, '')?.trim()}`;
    // return key;
};

export default uploadFileToAWSS3Bucket;