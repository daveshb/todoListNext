
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const sanitizedName = fileName.trim().replace(/\s+/g, '-');
  const nameWithoutExt = sanitizedName.replace(/\.[^/.]+$/, '');


  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'productos',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else if (result) resolve(result.secure_url);
        else reject(new Error('Upload failed'));
      }
    );
    stream.end(buffer);
  });
}



