import { v2 as cloudinary } from "cloudinary";


export async function POST(request: Request) {
    const data = await request.json();
    const { url } = data;
    if (!url) {
        return Response.json({ message: "URL is required." });
    }

    cloudinary.config({
        cloud_name: "ddhmnfjrf",
        api_key: "176614543747825",
        api_secret: "sXvEoMGHfUuDLku2VtH-x9rpuIY",
    });
    const cloudinaryRegex = /upload\/v(\d+)\/(.+?)\.(\w+)/;
    const matches = url.match(cloudinaryRegex);

    const resourceType = url.includes(".mp4") ? "video" : url.includes(".xlsx") ? "raw" : "image"
    try {
        if (matches) {
            const publicId = matches[2];
            await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
            return Response.json({ message: "Successfully Deleted" });
        } else {
            return Response.json({ message: "URL is not a valid Cloudinary URL." });
        }
    } catch (error) {
        // @ts-ignore
        if (error?.response && error?.response.status === 404) {
            return Response.json({ message: "Image not found." });
        } else {
            return Response.json({ message: "Something Went Wrong." });
        }
    }
}
