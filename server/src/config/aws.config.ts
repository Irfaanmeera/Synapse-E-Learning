import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_S3_ACCESS_SECRET_KEY!,
  },
});

export const uploadToS3 = async (
  file: Express.Multer.File
): Promise<string> => {
  const key = `videos/${uuidv4()}-${file.originalname}`;
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);

  return key;
};

export default s3;
