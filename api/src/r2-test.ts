import { Hono } from "hono";
import { S3Client, ListBucketsCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const app = new Hono();

app.get("/", async (c) => {
  return c.text("R2 Test Worker");
});

app.get("/test-r2", async (c) => {
  try {
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const endpoint = process.env.R2_ENDPOINT;

    if (!accessKeyId || !secretAccessKey || !endpoint) {
      return c.json({
        error: "Missing R2 credentials",
        env: {
          hasAccessKey: !!accessKeyId,
          hasSecretKey: !!secretAccessKey,
          hasEndpoint: !!endpoint,
        },
      }, 500);
    }

    const S3 = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const list = await S3.send(new ListBucketsCommand({}));
    const bucketName = list.Buckets?.[0]?.Name;

    if (!bucketName) {
      return c.json({ message: "No buckets found. Please create one in Cloudflare R2 dashboard." }, 404);
    }

    await S3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: "test-upload.txt",
      Body: "Hello R2 from Futurexa!",
    }));

    return c.json({
      success: true,
      message: "File uploaded successfully",
      bucket: bucketName,
      file: "test-upload.txt",
    });
  } catch (error: any) {
    return c.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, 500);
  }
});

export default app;
