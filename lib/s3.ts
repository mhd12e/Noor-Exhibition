import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string
) {
  console.log(`Starting upload to R2: ${key} (${(buffer.length / 1024 / 1024).toFixed(2)}MB)`);
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  try {
    await s3Client.send(command);
    console.log(`Successfully uploaded to R2: ${key}`);
    return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
  } catch (error) {
    console.error(`R2 Upload Error (${key}):`, error);
    throw error;
  }
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  });

  await s3Client.send(command);
}
