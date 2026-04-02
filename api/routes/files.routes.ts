import { Hono } from "hono";
import { getSupabaseClient } from "../services/supabase.service";
import type { Env } from "../types";
import { isAdminCrmRequest, getOrgIdFromHeader, decodeJwtPayload, extractBearerToken } from "../middleware/auth";
import { requireActiveClientProfile } from "../middleware/require";
import { deleteFileFromR2, getPresignedDownloadUrl, validateFile, generateR2Key, isImageMimeType, ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from "../services/r2.service";
import { createActivityLog } from "../services/notification.service";

export const filesRoutes = new Hono<{ Bindings: Env }>();

filesRoutes.get("/api/files/config", async (c) => {
  return c.json({
    allowedExtensions: ALLOWED_EXTENSIONS,
    maxFileSize: MAX_FILE_SIZE,
    maxFileSizeMB: MAX_FILE_SIZE / (1024 * 1024),
  });
});

filesRoutes.get("/api/files", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);

  const projectId = c.req.query("projectId") || undefined;
  const status = c.req.query("status") || "ACTIVE";
  const search = c.req.query("search") || undefined;
  const uploadedById = c.req.query("uploadedById") || undefined;
  const sortBy = c.req.query("sortBy") || "createdAt";
  const sortOrder = c.req.query("sortOrder") === "asc" ? "asc" : "desc";
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = parseInt(c.req.query("offset") || "0");

  if (orgId) {
    if (!adminMode) {
      try {
        await requireActiveClientProfile(c as any, supabase, orgId);
      } catch (e: any) {
        return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
      }
    }

    let query = supabase
      .from("FileAsset")
      .select("*", { count: "exact" })
      .eq("organizationId", orgId)
      .eq("status", status);

    if (projectId) {
      query = query.eq("projectId", projectId);
    }

    if (uploadedById) {
      query = query.eq("uploadedById", uploadedById);
    }

    if (search) {
      query = query.ilike("originalFilename", `%${search}%`);
    }

    const validSortFields = ["createdAt", "originalFilename", "fileSize", "mimeType"];
    const orderField = validSortFields.includes(sortBy) ? sortBy : "createdAt";

    query = query.order(orderField, { ascending: sortOrder === "asc" });
    query = query.range(offset, offset + limit - 1);

    const { data: files, count: total, error } = await query;

    if (error) {
      console.error("Error fetching files:", error);
      console.error("Query params - orgId:", orgId, "projectId:", projectId, "status:", status);
      console.error("Supabase URL:", c.env.SUPABASE_URL ? "set" : "NOT SET");
      return c.json({ error: "Failed to fetch files" }, 500);
    }

    const enrichedFiles = await Promise.all((files || []).map(async (file: any) => {
      const isImage = isImageMimeType(file.mimeType);
      let previewUrl: string | null = null;
      if (isImage) {
        try {
          previewUrl = await getPresignedDownloadUrl(
            {
              R2_ACCESS_KEY_ID: c.env.R2_ACCESS_KEY_ID,
              R2_SECRET_ACCESS_KEY: c.env.R2_SECRET_ACCESS_KEY,
              R2_ENDPOINT: c.env.R2_ENDPOINT,
              R2_BUCKET_NAME: c.env.R2_BUCKET_NAME,
            },
            file.r2ObjectKey,
            3600
          );
        } catch {}
      }
      return { ...file, isImage, previewUrl };
    }));

    return c.json({
      data: enrichedFiles,
      pagination: {
        total: total || 0,
        limit,
        offset,
        hasMore: offset + (files?.length || 0) < (total || 0),
      },
    });
  }

  if (!adminMode) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  const targetOrgId = c.req.query("targetOrgId") || undefined;

  let query = supabase
    .from("FileAsset")
    .select("*", { count: "exact" })
    .eq("status", status);

  if (targetOrgId) {
    query = query.eq("organizationId", targetOrgId);
  }

  if (projectId) {
    query = query.eq("projectId", projectId);
  }

  if (search) {
    query = query.ilike("originalFilename", `%${search}%`);
  }

  const validSortFields = ["createdAt", "originalFilename", "fileSize", "mimeType"];
  const orderField = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  query = query.order(orderField, { ascending: sortOrder === "asc" });
  query = query.range(offset, offset + limit - 1);

  const { data: files, count: total, error } = await query;

  if (error) {
    console.error("Error fetching files:", error);
    return c.json({ error: "Failed to fetch files" }, 500);
  }

  const enrichedAdminFiles = await Promise.all((files || []).map(async (file: any) => {
    const isImage = isImageMimeType(file.mimeType);
    let previewUrl: string | null = null;
    if (isImage) {
      try {
        previewUrl = await getPresignedDownloadUrl(
          {
            R2_ACCESS_KEY_ID: c.env.R2_ACCESS_KEY_ID,
            R2_SECRET_ACCESS_KEY: c.env.R2_SECRET_ACCESS_KEY,
            R2_ENDPOINT: c.env.R2_ENDPOINT,
            R2_BUCKET_NAME: c.env.R2_BUCKET_NAME,
          },
          file.r2ObjectKey,
          3600
        );
      } catch {}
    }
    return { ...file, isImage, previewUrl };
  }));

  return c.json({
    data: enrichedAdminFiles,
    pagination: {
      total: total || 0,
      limit,
      offset,
      hasMore: offset + (files?.length || 0) < (total || 0),
    },
  });
});

filesRoutes.get("/api/files/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);
  const id = c.req.param("id");

  if (!orgId) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  if (!adminMode) {
    try {
      await requireActiveClientProfile(c as any, supabase, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const { data: file, error } = await supabase
    .from("FileAsset")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !file) {
    return c.json({ error: "File not found" }, 404);
  }

  if (file.organizationId !== orgId && !adminMode) {
    return c.json({ error: "Access denied" }, 403);
  }

  const authHeader = c.req.header("authorization");
  const token = extractBearerToken(authHeader || "");
  const decodedToken = token ? decodeJwtPayload(token) : null;
  const userId = decodedToken?.sub || null;

  await supabase.from("FileAuditLog").insert({
    organizationId: file.organizationId,
    userId: userId,
    fileAssetId: file.id,
    action: "PREVIEWED",
    ipAddress: c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || null,
    userAgent: c.req.header("user-agent") || null,
  });

  const isImage = isImageMimeType(file.mimeType);
  const previewUrl = isImage ? await getPresignedDownloadUrl(
    {
      R2_ACCESS_KEY_ID: c.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: c.env.R2_SECRET_ACCESS_KEY,
      R2_ENDPOINT: c.env.R2_ENDPOINT,
      R2_BUCKET_NAME: c.env.R2_BUCKET_NAME,
    },
    file.r2ObjectKey,
    3600
  ) : null;

  return c.json({
    data: { ...file, isImage, previewUrl },
  });
});

filesRoutes.get("/api/files/:id/download", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);
  const id = c.req.param("id");

  if (!orgId) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  if (!adminMode) {
    try {
      await requireActiveClientProfile(c as any, supabase, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const { data: file, error } = await supabase
    .from("FileAsset")
    .select("id, organizationId, r2ObjectKey, originalFilename, mimeType, fileSize")
    .eq("id", id)
    .single();

  if (error || !file) {
    return c.json({ error: "File not found" }, 404);
  }

  if (file.organizationId !== orgId && !adminMode) {
    return c.json({ error: "Access denied" }, 403);
  }

  const authHeader = c.req.header("authorization");
  const token = extractBearerToken(authHeader || "");
  const decodedToken = token ? decodeJwtPayload(token) : null;
  const userId = decodedToken?.sub || null;

  await supabase.from("FileAuditLog").insert({
    organizationId: file.organizationId,
    userId: userId,
    fileAssetId: file.id,
    action: "DOWNLOADED",
    ipAddress: c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || null,
    userAgent: c.req.header("user-agent") || null,
  });

  const signedUrl = await getPresignedDownloadUrl(
    {
      R2_ACCESS_KEY_ID: c.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: c.env.R2_SECRET_ACCESS_KEY,
      R2_ENDPOINT: c.env.R2_ENDPOINT,
      R2_BUCKET_NAME: c.env.R2_BUCKET_NAME,
    },
    file.r2ObjectKey,
    3600
  );

  return c.json({
    downloadUrl: signedUrl,
    filename: file.originalFilename,
    mimeType: file.mimeType,
    fileSize: file.fileSize,
  });
});

filesRoutes.post("/api/files/upload-url", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);

  if (!orgId) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  if (!adminMode) {
    try {
      await requireActiveClientProfile(c as any, supabase, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const { data: organization, error: orgError } = await supabase
    .from("Organization")
    .select("id, name")
    .eq("id", orgId)
    .single();

  if (orgError || !organization) {
    return c.json({ error: "Organization not found" }, 404);
  }

  const body = await c.req.json();
  const { filename, contentType, fileSize, projectId, folder } = body;

  if (!filename || !contentType) {
    return c.json({ error: "filename and contentType are required" }, 400);
  }

  const fileValidation = validateFile({ name: filename, size: fileSize || 0, type: contentType });
  if (!fileValidation.valid) {
    return c.json({ error: fileValidation.error }, 400);
  }

  const key = generateR2Key(orgId, organization.name, filename, folder);

  const { getPresignedUploadUrl } = await import("../services/r2.service");
  const uploadUrl = await getPresignedUploadUrl(
    {
      R2_ACCESS_KEY_ID: c.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: c.env.R2_SECRET_ACCESS_KEY,
      R2_ENDPOINT: c.env.R2_ENDPOINT,
      R2_BUCKET_NAME: c.env.R2_BUCKET_NAME,
    },
    key,
    contentType,
    3600
  );

  return c.json({
    uploadUrl,
    key,
    r2ObjectKey: key,
  });
});

filesRoutes.post("/api/files/complete-upload", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);

  if (!orgId) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  if (!adminMode) {
    try {
      await requireActiveClientProfile(c as any, supabase, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const authHeader = c.req.header("authorization");
  const token = extractBearerToken(authHeader || "");
  const decodedToken = token ? decodeJwtPayload(token) : null;
  const userId = decodedToken?.sub || null;

  const body = await c.req.json();
  const { key, originalFilename, mimeType, fileSize, projectId, folder } = body;

  if (!key || !originalFilename || !mimeType) {
    return c.json({ error: "key, originalFilename, and mimeType are required" }, 400);
  }

  const url = `https://pub.${c.env.R2_ENDPOINT.replace("https://", "")}/${key}`;
  const uploadedByRole = adminMode ? "ADMIN" : "CLIENT";

  const { data: file, error: fileError } = await supabase
    .from("FileAsset")
    .insert({
      organizationId: orgId,
      projectId: projectId || null,
      uploadedById: userId,
      uploadedByRole: uploadedByRole,
      originalFilename: originalFilename,
      r2ObjectKey: key,
      mimeType: mimeType,
      fileSize: fileSize || 0,
      folder: folder || null,
      fileUrl: url,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (fileError) {
    console.error("Error creating file record:", fileError);
    return c.json({ error: "Failed to create file record" }, 500);
  }

  await supabase.from("FileAuditLog").insert({
    organizationId: orgId,
    userId: userId,
    fileAssetId: file.id,
    action: "UPLOADED",
    ipAddress: c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || null,
    userAgent: c.req.header("user-agent") || null,
    metadata: { filename: originalFilename, mimeType, fileSize, projectId, folder },
  });

  return c.json({ data: file });
});

filesRoutes.post("/api/files", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);

  if (!orgId) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  if (!adminMode) {
    try {
      await requireActiveClientProfile(c as any, supabase, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const authHeader = c.req.header("authorization");
  const token = extractBearerToken(authHeader || "");
  const decodedToken = token ? decodeJwtPayload(token) : null;
  const userId = decodedToken?.sub || null;

  const { data: organization } = await supabase
    .from("Organization")
    .select("name")
    .eq("id", orgId)
    .single();

  const orgName = organization?.name || "unknown";

  const contentType = c.req.header("content-type") || "";
  const isFormData = contentType.includes("multipart/form-data");

  if (!isFormData) {
    return c.json({ error: "Content-Type must be multipart/form-data for file uploads" }, 400);
  }

  const formData = await c.req.formData();
  const files = formData.getAll("files") as File[];
  const projectId = formData.get("projectId") as string | null;
  const folder = formData.get("folder") as string | null;

  if (files.length === 0) {
    return c.json({ error: "No files provided" }, 400);
  }

  const { uploadFileToR2 } = await import("../services/r2.service");
  const uploadedFiles = [];

  for (const file of files) {
    const fileValidation = validateFile({ name: file.name, size: file.size, type: file.type });
    if (!fileValidation.valid) {
      continue;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await uploadFileToR2(
        {
          R2_ACCESS_KEY_ID: c.env.R2_ACCESS_KEY_ID,
          R2_SECRET_ACCESS_KEY: c.env.R2_SECRET_ACCESS_KEY,
          R2_ENDPOINT: c.env.R2_ENDPOINT,
          R2_BUCKET_NAME: c.env.R2_BUCKET_NAME,
        },
        new Uint8Array(arrayBuffer),
        file.name,
        file.type,
        orgId,
        orgName,
        folder || undefined
      );

      const uploadedByRole = adminMode ? "ADMIN" : "CLIENT";

      const { data: fileRecord, error: fileError } = await supabase
        .from("FileAsset")
        .insert({
          organizationId: orgId,
          projectId: projectId || null,
          uploadedById: userId,
          uploadedByRole: uploadedByRole,
          originalFilename: file.name,
          r2ObjectKey: result.key,
          mimeType: file.type,
          fileSize: file.size,
          folder: folder || null,
          fileUrl: result.url,
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (fileError) {
        console.error("Error creating file record:", fileError);
        continue;
      }

      await createActivityLog(supabase, {
        organizationId: orgId,
        userId: userId || "",
        action: `File uploaded: ${file.name}`,
        entityType: "File",
        entityId: fileRecord.id,
        metadata: { filename: file.name, mimeType: file.type, fileSize: file.size, projectId, folder, role: uploadedByRole },
      });

      await supabase.from("FileAuditLog").insert({
        organizationId: orgId,
        userId: userId,
        fileAssetId: fileRecord.id,
        action: "UPLOADED",
        ipAddress: c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || null,
        userAgent: c.req.header("user-agent") || null,
        metadata: { filename: file.name, mimeType: file.type, fileSize: file.size, projectId, folder },
      });

      uploadedFiles.push(fileRecord);
    } catch (err) {
      console.error("Failed to upload file:", file.name, err);
    }
  }

  return c.json({
    data: uploadedFiles,
    uploadedCount: uploadedFiles.length,
    totalProvided: files.length,
  });
});

filesRoutes.patch("/api/files/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);

  if (!orgId) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  if (!adminMode) {
    try {
      await requireActiveClientProfile(c as any, supabase, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const id = c.req.param("id");
  const { projectId, folder } = await c.req.json();

  const { data: existingFile } = await supabase
    .from("FileAsset")
    .select("id, organizationId, projectId, folder")
    .eq("id", id)
    .single();

  if (!existingFile) {
    return c.json({ error: "File not found" }, 404);
  }

  if (existingFile.organizationId !== orgId && !adminMode) {
    return c.json({ error: "Access denied" }, 403);
  }

  const { data: file, error: updateError } = await supabase
    .from("FileAsset")
    .update({
      projectId: projectId ?? existingFile.projectId,
      folder: folder ?? existingFile.folder,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return c.json({ error: "Failed to update file" }, 500);
  }

  return c.json({ data: file });
});

filesRoutes.delete("/api/files/:id", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);

  if (!orgId) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  if (!adminMode) {
    try {
      await requireActiveClientProfile(c as any, supabase, orgId);
    } catch (e: any) {
      return c.json({ error: e?.message ?? "Unauthorized" }, e?.status ?? 401);
    }
  }

  const authHeader = c.req.header("authorization");
  const token = extractBearerToken(authHeader || "");
  const decodedToken = token ? decodeJwtPayload(token) : null;
  const userId = decodedToken?.sub || null;

  const id = c.req.param("id");

  const { data: file } = await supabase
    .from("FileAsset")
    .select("id, organizationId, r2ObjectKey, originalFilename")
    .eq("id", id)
    .single();

  if (!file) {
    return c.json({ error: "File not found" }, 404);
  }

  if (file.organizationId !== orgId && !adminMode) {
    return c.json({ error: "Access denied" }, 403);
  }

  const softDelete = c.req.query("soft") !== "false";

  if (!softDelete) {
    try {
      await deleteFileFromR2(
        {
          R2_ACCESS_KEY_ID: c.env.R2_ACCESS_KEY_ID,
          R2_SECRET_ACCESS_KEY: c.env.R2_SECRET_ACCESS_KEY,
          R2_ENDPOINT: c.env.R2_ENDPOINT,
          R2_BUCKET_NAME: c.env.R2_BUCKET_NAME,
        },
        file.r2ObjectKey
      );
    } catch (err) {
      console.error("Failed to delete file from R2:", err);
    }
  }

  await supabase
    .from("FileAsset")
    .update({
      status: "DELETED",
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id);

  await supabase.from("FileAuditLog").insert({
    organizationId: file.organizationId,
    userId: userId,
    fileAssetId: file.id,
    action: "DELETED",
    ipAddress: c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || null,
    userAgent: c.req.header("user-agent") || null,
    metadata: { softDelete, originalFilename: file.originalFilename },
  });

  await createActivityLog(supabase, {
    organizationId: file.organizationId,
    userId: userId || "",
    action: `File deleted: ${file.originalFilename}`,
    entityType: "File",
    entityId: file.id,
    metadata: { filename: file.originalFilename, softDelete },
  });

  return c.json({ success: true, softDeleted: softDelete });
});

filesRoutes.get("/api/files/audit-logs", async (c) => {
  const supabase = getSupabaseClient(c.env);
  const orgId = getOrgIdFromHeader(c);
  const adminMode = isAdminCrmRequest(c);

  if (!orgId) {
    return c.json({ error: "Organization ID required" }, 400);
  }

  if (!adminMode) {
    return c.json({ error: "Admin access required for audit logs" }, 403);
  }

  const fileAssetId = c.req.query("fileAssetId") || undefined;
  const action = c.req.query("action") || undefined;
  const userId = c.req.query("userId") || undefined;
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = parseInt(c.req.query("offset") || "0");

  let query = supabase
    .from("FileAuditLog")
    .select(`
      *,
      user:User(id, name, email),
      fileAsset:FileAsset(id, originalFilename)
    `, { count: "exact" })
    .eq("organizationId", orgId);

  if (fileAssetId) {
    query = query.eq("fileAssetId", fileAssetId);
  }

  if (action) {
    query = query.eq("action", action);
  }

  if (userId) {
    query = query.eq("userId", userId);
  }

  query = query.order("createdAt", { ascending: false });
  query = query.range(offset, offset + limit - 1);

  const { data: logs, count: total, error } = await query;

  if (error) {
    console.error("Error fetching audit logs:", error);
    return c.json({ error: "Failed to fetch audit logs" }, 500);
  }

  return c.json({
    data: logs || [],
    pagination: {
      total: total || 0,
      limit,
      offset,
      hasMore: offset + (logs?.length || 0) < (total || 0),
    },
  });
});