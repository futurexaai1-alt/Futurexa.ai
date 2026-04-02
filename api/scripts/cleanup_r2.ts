import { S3Client, ListObjectsV2Command, DeleteObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config({ path: ".dev.vars" });

const r2Env = {
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || "",
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || "",
  R2_ENDPOINT: process.env.R2_ENDPOINT || "",
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME || "futurexaai",
};

const client = new S3Client({
  region: "auto",
  endpoint: r2Env.R2_ENDPOINT,
  credentials: {
    accessKeyId: r2Env.R2_ACCESS_KEY_ID,
    secretAccessKey: r2Env.R2_SECRET_ACCESS_KEY,
  },
});

const bucketName = r2Env.R2_BUCKET_NAME;

async function listAndDeleteAll() {
  console.log(`Connected to R2 bucket: ${bucketName}`);
  console.log(`Endpoint: ${r2Env.R2_ENDPOINT}`);
  console.log("\nListing all objects in bucket...\n");

  let cursor: string | undefined;
  let totalDeleted = 0;
  let totalFolders = 0;
  const foldersSeen = new Set<string>();

  do {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      ContinuationToken: cursor,
    });

    const response = await client.send(listCommand);

    if (response.Contents && response.Contents.length > 0) {
      console.log(`Found ${response.Contents.length} objects:\n`);

      for (const obj of response.Contents) {
        const key = obj.Key!;
        const size = obj.Size || 0;

        if (key.endsWith("/")) {
          foldersSeen.add(key);
          totalFolders++;
          console.log(`[FOLDER] ${key}`);
        } else {
          console.log(`[FILE] ${key} (${(size / 1024).toFixed(2)} KB)`);
        }
      }

      console.log("\nDeleting objects...\n");

      const deleteCommand = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: response.Contents.map((obj) => ({ Key: obj.Key! })),
          Quiet: false,
        },
      });

      const deleteResponse = await client.send(deleteCommand);

      if (deleteResponse.Deleted) {
        console.log(`Deleted ${deleteResponse.Deleted.length} objects`);
        totalDeleted += deleteResponse.Deleted.length;
      }

      if (deleteResponse.Errors) {
        console.log(`Errors:`, deleteResponse.Errors);
      }

      console.log("");
    } else {
      console.log("No more objects found.");
    }

    cursor = response.NextContinuationToken;
  } while (cursor);

  console.log(`\n=== Summary ===`);
  console.log(`Total objects deleted: ${totalDeleted}`);
  console.log(`Total folders seen: ${totalFolders}`);
  console.log(`Unique folders: ${foldersSeen.size}`);
}

listAndDeleteAll()
  .then(() => console.log("\nDone!"))
  .catch((e) => console.error("Error:", e));
