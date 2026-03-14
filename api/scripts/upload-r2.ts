import "dotenv/config";
import { S3Client, ListBucketsCommand, PutObjectCommand } from "@aws-sdk/client-s3";

async function main() {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint = process.env.R2_ENDPOINT;

  if (!accessKeyId || !secretAccessKey || !endpoint) {
    console.error("Missing R2 credentials in .env");
    process.exit(1);
  }

  const S3 = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  try {
    console.log("Listing buckets...");
    const list = await S3.send(new ListBucketsCommand({}));
    console.log("Buckets:", list.Buckets?.map(b => b.Name).join(", "));

    let bucketName = list.Buckets?.[0]?.Name;
    if (!bucketName) {
      console.log("No buckets found. Attempting to upload to 'futurexa-test' (might fail if not exists)...");
      bucketName = "futurexa-test";
    }

    console.log(`Uploading to bucket: ${bucketName}`);
    await S3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: "test-script-upload.txt",
      Body: "Hello R2 from local script!",
    }));

    console.log("Upload successful! File: test-script-upload.txt");
  } catch (error: any) {
    console.error("Error:", error.message);
    if (error.stack) console.error(error.stack);
  }
}

main();
