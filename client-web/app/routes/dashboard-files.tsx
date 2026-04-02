import type { Route } from "./+types/dashboard-files";
import { useLoaderData, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { Files, UploadCloud, Download, Loader2, Image, FileText, X, Eye, Trash2, Search, Filter, Grid, List, ChevronDown, Layers, Folder } from "lucide-react";
import DashboardLayout, { getStoredAuth, AUTH_STORAGE_KEY } from "../features/dashboard/components/DashboardLayout";
import { createSupabaseBrowserClient } from "../utils/supabase";

type LoaderData = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
};

type FileItem = {
  id: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  fileUrl: string;
  r2ObjectKey: string;
  uploadedBy?: { name?: string | null; email: string };
  uploadedByRole?: "ADMIN" | "CLIENT";
  isImage?: boolean;
  previewUrl?: string | null;
};

type FileConfig = {
  allowedExtensions: string[];
  maxFileSize: number;
  maxFileSizeMB: number;
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.includes("pdf") || mimeType.includes("document")) return FileText;
  return Files;
}

export function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env as any;
  return {
    supabaseUrl: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
    apiBaseUrl: env.API_BASE_URL || "http://localhost:8787",
  } satisfies LoaderData;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Files | futurexa.ai" },
    { name: "description", content: "Manage your files" },
  ];
}

export default function DashboardFiles(_: Route.ComponentProps) {
  const { supabaseUrl, supabaseAnonKey, apiBaseUrl } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string>("NEW_USER");
  // statusConfirmed=true means we've validated status from live /api/me (not just stale cache)
  const [statusConfirmed, setStatusConfirmed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "originalFilename" | "fileSize">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileConfig, setFileConfig] = useState<FileConfig | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadProjectId, setUploadProjectId] = useState<string>("");
  const [uploadFolder, setUploadFolder] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function initAuth() {
      const stored = getStoredAuth();
      // Optimistically use stored auth for fast render
      if (stored?.accessToken) {
        setAccessToken(stored.accessToken);
        if (stored.organizationId) setOrganizationId(stored.organizationId);
        if (stored.userStatus) setUserStatus(stored.userStatus);
      }

      // Always validate with server to get freshest organizationId + status
      try {
        const sbClient = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
        const { data: sessionData } = await sbClient.auth.getSession();

        if (!sessionData?.session) {
          if (!cancelled) { setIsLoading(false); navigate("/signin"); }
          return;
        }

        const liveToken = sessionData.session.access_token;
        if (!cancelled) setAccessToken(liveToken);

        // Fetch latest status + org from API
        const res = await fetch(`${apiBaseUrl}/api/me`, {
          headers: { Authorization: `Bearer ${liveToken}` },
        });

        if (res.ok) {
          const json = await res.json() as any;
          const newStatus: string = json?.status ?? "NEW_USER";
          const newOrgId: string | null = json?.organizationId ?? null;

          if (!cancelled) {
            setUserStatus(newStatus);
            setStatusConfirmed(true);
            if (newOrgId) setOrganizationId(newOrgId);
            // Persist refreshed auth
            const existing = JSON.parse(sessionStorage.getItem(AUTH_STORAGE_KEY) || "{}");
            sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
              ...existing,
              accessToken: liveToken,
              userStatus: newStatus,
              organizationId: newOrgId,
            }));
          }
        } else {
          // If /api/me fails, fall back to stored auth
          if (!stored?.accessToken) {
            if (!cancelled) { setIsLoading(false); navigate("/signin"); }
            return;
          }
        }
      } catch (e) {
        console.warn("Auth refresh failed, using stored auth", e);
        if (!stored?.accessToken) {
          if (!cancelled) { setIsLoading(false); navigate("/signin"); }
          return;
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    initAuth();
    return () => { cancelled = true; };
  }, [navigate, supabaseUrl, supabaseAnonKey, apiBaseUrl]);

  useEffect(() => {
    // Wait for live /api/me confirmation before redirecting — avoids false redirects from stale cache
    if (!statusConfirmed) return;
    if (!organizationId || !accessToken) return;
    // Only block genuinely non-client statuses from accessing files
    if (userStatus === "LEAD") {
      navigate("/dashboard");
    }
  }, [navigate, organizationId, accessToken, userStatus, statusConfirmed]);

  const fetchFileConfig = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/files/config`);
      if (res.ok) {
        const config = await res.json() as FileConfig;
        setFileConfig(config);
      }
    } catch (e) {
      console.error("Failed to fetch file config", e);
    }
  };

  const fetchFiles = async () => {
    if (!organizationId || !accessToken) {
      console.log("fetchFiles skipped: organizationId or accessToken missing", { organizationId, hasAccessToken: !!accessToken });
      return;
    }
    try {
      setIsLoading(true);
      const headers = { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId };
      console.log("Fetching files for organization:", organizationId);
      const res = await fetch(`${apiBaseUrl}/api/files?status=ACTIVE&limit=100`, { headers });
      console.log("Files response status:", res.status);
      if (res.ok) {
        const json = await res.json() as any;
        const data = json?.data ?? [];
        console.log("Files fetched:", data.length, "files");
        setFiles(data);
      } else {
        let errorMessage = `Error ${res.status}`;
        try {
          const errorJson = await res.json() as any;
          errorMessage = (errorJson as any)?.error || errorMessage;
        } catch {
          const errorText = await res.text().catch(() => "");
          if (errorText) errorMessage = errorText;
        }
        console.error("Failed to fetch files:", res.status, errorMessage);
        setFetchError(errorMessage);
      }
    } catch (e) {
      console.error("Failed to fetch files", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    if (!organizationId || !accessToken) return;
    try {
      const headers = { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId };
      const res = await fetch(`${apiBaseUrl}/api/projects`, { headers });
      if (res.ok) {
        const json = await res.json() as any;
        setProjects(json?.data ?? []);
      }
    } catch (e) {
      console.error("Failed to fetch projects", e);
    }
  };

  useEffect(() => {
    fetchFileConfig();
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchFiles();
  }, [organizationId, accessToken, apiBaseUrl]);

  useEffect(() => {
    fetchProjects();
  }, [organizationId, accessToken, apiBaseUrl]);

  useEffect(() => {
    let result = [...files];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f =>
        f.originalFilename.toLowerCase().includes(query) ||
        f.uploadedBy?.name?.toLowerCase().includes(query) ||
        f.uploadedBy?.email?.toLowerCase().includes(query)
      );
    }

    if (selectedProjectId !== "all") {
      result = result.filter(f => f.project?.id === selectedProjectId || f.projectId === selectedProjectId);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "originalFilename":
          comparison = a.originalFilename.localeCompare(b.originalFilename);
          break;
        case "fileSize":
          comparison = a.fileSize - b.fileSize;
          break;
        case "createdAt":
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredFiles(result);
  }, [files, searchQuery, sortBy, sortOrder, selectedProjectId]);

  const handleDownload = async (file: FileItem) => {
    if (!accessToken || !organizationId) return;

    try {
      const headers = { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId };
      const res = await fetch(`${apiBaseUrl}/api/files/${file.id}/download`, { headers });
      if (res.ok) {
        const data = await res.json() as { downloadUrl: string; filename: string };
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.download = data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.error("Download failed", e);
      window.open(file.fileUrl, "_blank");
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!accessToken || !organizationId) return;
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const headers = { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId };
      const res = await fetch(`${apiBaseUrl}/api/files/${fileId}?soft=true`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        if (previewFile?.id === fileId) setPreviewFile(null);
      }
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handlePreview = async (file: FileItem) => {
    if (!accessToken || !organizationId) return;

    if (file.isImage && file.previewUrl) {
      setPreviewFile(file);
      return;
    }

    if (file.isImage) {
      try {
        const headers = { Authorization: `Bearer ${accessToken}`, "x-organization-id": organizationId };
        const res = await fetch(`${apiBaseUrl}/api/files/${file.id}`, { headers });
        if (res.ok) {
          const data = await res.json() as any;
          setPreviewFile({ ...file, previewUrl: data.data.previewUrl, isImage: true });
        }
      } catch (e) {
        console.error("Preview fetch failed", e);
      }
    } else {
      handleDownload(file);
    }
  };

  const handleSortChange = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="files">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} apiBaseUrl={apiBaseUrl} activeKey="files">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Files</h1>
            <p className="mt-1 text-gray-500">Manage your project files securely</p>
            <p className="mt-1 text-xs text-gray-400">Organization ID: {organizationId}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              disabled={isUploading || projects.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-blue-400"
            >
              <UploadCloud className="h-4 w-4" />
              Upload Files
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {uploadError}
          </div>
        )}

        {fetchError && (
          <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
            {fetchError}
          </div>
        )}

        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Upload Files</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">Select project and folder, then choose files</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsUploadModalOpen(false);
                      setSelectedFiles([]);
                      setUploadProjectId("");
                      setUploadFolder("");
                    }}
                    className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Project</label>
                  <select
                    value={uploadProjectId}
                    onChange={(e) => setUploadProjectId(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Folder (Optional)</label>
                  <select
                    value={uploadFolder}
                    onChange={(e) => setUploadFolder(e.target.value)}
                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="">No Folder</option>
                    <option value="Contracts">Contracts</option>
                    <option value="Assets">Assets</option>
                    <option value="Invoices">Invoices</option>
                    <option value="Deliverables">Deliverables</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Files</label>
                  <input
                    type="file"
                    id="file-upload-input"
                    className="hidden"
                    multiple
                    accept={fileConfig?.allowedExtensions.join(",")}
                    onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                  />
                  <label
                    htmlFor="file-upload-input"
                    className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 hover:border-blue-300 transition-all"
                  >
                    <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-500">
                      {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : "Click to select files"}
                    </span>
                  </label>
                  {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedFiles.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 border border-blue-100">
                          {f.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {uploadError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {uploadError}
                  </div>
                )}
              </div>

              <div className="p-8 pt-0 flex gap-4">
                <button
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setSelectedFiles([]);
                    setUploadProjectId("");
                    setUploadFolder("");
                  }}
                  className="flex-1 h-14 rounded-2xl border border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (selectedFiles.length === 0) {
                      setUploadError("Please select at least one file");
                      return;
                    }
                    setUploadError(null);
                    setIsUploading(true);

                    const formData = new FormData();
                    for (let i = 0; i < selectedFiles.length; i++) {
                      formData.append("files", selectedFiles[i]);
                    }
                    if (uploadProjectId) formData.append("projectId", uploadProjectId);
                    if (uploadFolder) formData.append("folder", uploadFolder);

                    try {
                      const res = await fetch(`${apiBaseUrl}/api/files`, {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${accessToken}`,
                          "x-organization-id": organizationId,
                        },
                        body: formData,
                      });

                      if (res.ok) {
                        setIsUploadModalOpen(false);
                        setSelectedFiles([]);
                        setUploadProjectId("");
                        setUploadFolder("");
                        await fetchFiles();
                      } else {
                        let errorMsg = "Failed to upload file(s)";
                        try {
                          const errorData = await res.json() as any;
                          errorMsg = (errorData as any)?.error || errorMsg;
                        } catch {}
                        setUploadError(errorMsg);
                      }
                    } catch (error) {
                      console.error("Upload error", error);
                      setUploadError("Error occurred while uploading file(s)");
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                  disabled={isUploading || selectedFiles.length === 0}
                  className="flex-[2] h-14 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isUploading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {isUploading ? "Uploading..." : "Upload Files"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {projects.length > 0 && (
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[180px]"
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          )}

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-") as [typeof sortBy, typeof sortOrder];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 py-2.5 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="originalFilename-asc">Name A-Z</option>
                <option value="originalFilename-desc">Name Z-A</option>
                <option value="fileSize-desc">Largest First</option>
                <option value="fileSize-asc">Smallest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <Files className="h-8 w-8 text-blue-300" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              {searchQuery ? "No files match your search" : "No files uploaded yet"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? "Try adjusting your search terms" : "Upload documents, images, or project files here."}
            </p>
            {!searchQuery && projects.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <UploadCloud className="h-4 w-4" />
                  Select Files
                </button>
              </div>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => {
              const FileIcon = getFileIcon(file.mimeType);
              return (
                <div
                  key={file.id}
                  className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-blue-100"
                >
                  <div className="aspect-square mb-4 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                    {file.isImage && file.previewUrl ? (
                      <img
                        src={file.previewUrl}
                        alt={file.originalFilename}
                        className="h-full w-full object-cover cursor-pointer"
                        onClick={() => handlePreview(file)}
                      />
                    ) : (
                      <FileIcon className="h-12 w-12 text-gray-300" />
                    )}
                  </div>

                  <div className="min-h-0">
                    <p className="text-sm font-semibold text-gray-900 truncate" title={file.originalFilename}>
                      {file.originalFilename}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatFileSize(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                    {file.uploadedBy && (
                      <p className="mt-1 text-xs text-gray-400 truncate">
                        by {file.uploadedBy.name || file.uploadedBy.email}
                        {file.uploadedByRole && <span className="ml-1 text-blue-500">({file.uploadedByRole})</span>}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {file.isImage && (
                      <button
                        onClick={() => handlePreview(file)}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        Preview
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(file)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">File</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">By</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFiles.map((file) => {
                  const FileIcon = getFileIcon(file.mimeType);
                  return (
                    <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                            {file.isImage && file.previewUrl ? (
                              <img
                                src={file.previewUrl}
                                alt={file.originalFilename}
                                className="h-full w-full object-cover rounded-lg cursor-pointer"
                                onClick={() => handlePreview(file)}
                              />
                            ) : (
                              <FileIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate max-w-xs" title={file.originalFilename}>
                              {file.originalFilename}
                            </p>
                            <p className="text-xs text-gray-400 capitalize">{file.mimeType.split("/")[1]}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatFileSize(file.fileSize)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{new Date(file.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {file.uploadedBy ? (
                          <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                            {file.uploadedBy.name || file.uploadedBy.email}
                            {file.uploadedByRole && (
                              <span className="text-xs text-blue-500">({file.uploadedByRole})</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Unknown</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {file.isImage && (
                            <button
                              onClick={() => handlePreview(file)}
                              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                              title="Preview"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDownload(file)}
                            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {previewFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPreviewFile(null)}>
            <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setPreviewFile(null)}
                className="absolute -top-12 right-0 rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={previewFile.previewUrl || previewFile.fileUrl}
                alt={previewFile.originalFilename}
                className="max-h-[80vh] max-w-full rounded-lg object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-semibold">{previewFile.originalFilename}</p>
                <p className="text-white/70 text-sm">{formatFileSize(previewFile.fileSize)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}