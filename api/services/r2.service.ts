import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface R2Env {
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_ENDPOINT: string;
  R2_BUCKET_NAME?: string;
}

let r2Client: S3Client | null = null;

function getR2Client(env: R2Env): S3Client {
  if (!r2Client) {
    r2Client = new S3Client({
      region: "auto",
      endpoint: env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return r2Client;
}

export interface UploadResult {
  key: string;
  url: string;
}

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
];

export const ALLOWED_EXTENSIONS = [
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg",
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".csv",
  ".txt", ".zip",
];

export const MAX_FILE_SIZE = 100 * 1024 * 1024;

export function validateFile(file: { name: string; size: number; type: string }): { valid: boolean; error?: string } {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `File type ${ext} is not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}` };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: `MIME type ${file.type} is not allowed` };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB` };
  }

  return { valid: true };
}

export function generateR2Key(organizationId: string, organizationName: string, fileName: string, folder?: string): string {
  const timestamp = Date.now();
  const ext = fileName.split(".").pop() || "";
  const baseName = fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9.-]/g, "_");
  const cleanFileName = `${timestamp}_${baseName}${ext ? "." + ext : ""}`;
  const cleanOrgName = organizationName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const orgFolder = `${organizationId}_${cleanOrgName}`;

  if (folder) {
    return `org/${orgFolder}/${folder}/${cleanFileName}`;
  }
  return `org/${orgFolder}/${cleanFileName}`;
}

export async function uploadFileToR2(
  env: R2Env,
  fileData: ArrayBuffer | Uint8Array,
  fileName: string,
  contentType: string,
  organizationId: string,
  organizationName: string,
  folder?: string
): Promise<UploadResult> {
  const client = getR2Client(env);
  const bucketName = env.R2_BUCKET_NAME || "futurexaai";
  const key = generateR2Key(organizationId, organizationName, fileName, folder);

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileData,
      ContentType: contentType,
    })
  );

  const url = `https://pub.${env.R2_ENDPOINT.replace("https://", "")}/${key}`;

  return { key, url };
}

export async function uploadFileToR2Direct(
  env: R2Env,
  fileName: string,
  contentType: string,
  organizationId: string,
  organizationName: string,
  folder?: string,
  expiresIn = 3600
): Promise<{ key: string; uploadUrl: string }> {
  const client = getR2Client(env);
  const bucketName = env.R2_BUCKET_NAME || "futurexaai";
  const key = generateR2Key(organizationId, organizationName, fileName, folder);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn });
  const url = `https://pub.${env.R2_ENDPOINT.replace("https://", "")}/${key}`;

  return { key, uploadUrl: uploadUrl.replace(`${env.R2_ENDPOINT}/${bucketName}`, `https://pub.${env.R2_ENDPOINT.replace("https://", "")}`) };
}

export async function deleteFileFromR2(env: R2Env, key: string): Promise<void> {
  const client = getR2Client(env);
  const bucketName = env.R2_BUCKET_NAME || "futurexaai";

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
}

export async function deleteAllFilesWithPrefix(env: R2Env, prefix: string): Promise<void> {
  const bucketName = env.R2_BUCKET_NAME || "futurexaai";
  const endpoint = env.R2_ENDPOINT.replace(/^https?:\/\//, "");

  let isTruncated = true;
  let continuationToken: string | undefined;

  while (isTruncated) {
    const listUrl = new URL(`https://${endpoint}/${bucketName}`);
    listUrl.searchParams.set("prefix", prefix);
    if (continuationToken) {
      listUrl.searchParams.set("continuation-token", continuationToken);
    }

    const listResponse = await fetch(listUrl.toString(), {
      headers: {
        "X-Access-Key-Id": env.R2_ACCESS_KEY_ID,
        "X-Secret-Access-Key": env.R2_SECRET_ACCESS_KEY,
      },
    });

    if (!listResponse.ok) {
      const text = await listResponse.text();
      throw new Error(`Failed to list R2 objects: ${listResponse.status} ${text}`);
    }

    const listXml = await listResponse.text();
    const contents = parseListObjectsXml(listXml);

    if (contents.length === 0) {
      break;
    }

    const deleteUrl = new URL(`https://${endpoint}/${bucketName}/?delete`);
    const deleteBody = `<?xml version="1.0" encoding="UTF-8"?><Delete>${contents.map((c) => `<Object><Key>${escapeXml(c)}</Key></Object>`).join("")}<Quiet>true</Quiet></Delete>`;

    const deleteResponse = await fetch(deleteUrl.toString(), {
      method: "POST",
      headers: {
        "X-Access-Key-Id": env.R2_ACCESS_KEY_ID,
        "X-Secret-Access-Key": env.R2_SECRET_ACCESS_KEY,
        "Content-Type": "application/xml",
      },
      body: deleteBody,
    });

    if (!deleteResponse.ok) {
      const text = await deleteResponse.text();
      console.error(`Failed to delete R2 objects: ${deleteResponse.status} ${text}`);
    }

    const resultXml = await listResponse.text();
    const isTruncatedMatch = resultXml.match(/<IsTruncated>(true|false)<\/IsTruncated>/);
    isTruncated = isTruncatedMatch ? isTruncatedMatch[1] === "true" : false;

    const nextTokenMatch = resultXml.match(/<NextContinuationToken>(.*?)<\/NextContinuationToken>/);
    continuationToken = nextTokenMatch ? nextTokenMatch[1] : undefined;
  }
}

function parseListObjectsXml(xml: string): string[] {
  const keys: string[] = [];
  const regex = /<Key>(.*?)<\/Key>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    keys.push(match[1]);
  }
  return keys;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function getPresignedDownloadUrl(
  env: R2Env,
  key: string,
  expiresIn = 3600
): Promise<string> {
  const client = getR2Client(env);
  const bucketName = env.R2_BUCKET_NAME || "futurexaai";

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn });
  return signedUrl.replace(`${env.R2_ENDPOINT}/${bucketName}`, `https://pub.${env.R2_ENDPOINT.replace("https://", "")}`);
}

export async function getPresignedUploadUrl(
  env: R2Env,
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  const client = getR2Client(env);
  const bucketName = env.R2_BUCKET_NAME || "futurexaai";

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(client, command, { expiresIn });
}

export async function getFileMetadata(
  env: R2Env,
  key: string
): Promise<{ contentType: string; contentLength: number } | null> {
  const client = getR2Client(env);
  const bucketName = env.R2_BUCKET_NAME || "futurexaai";

  try {
    const response = await client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
    return {
      contentType: response.ContentType || "application/octet-stream",
      contentLength: response.ContentLength || 0,
    };
  } catch {
    return null;
  }
}

export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

export function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}