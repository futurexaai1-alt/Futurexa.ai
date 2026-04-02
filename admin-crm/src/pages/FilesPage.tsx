import { Loader2, Files, Upload, Trash2, Folder, Eye, Building2, ChevronDown, Download, Search, Grid, List, X, Image as ImageIcon, Layers } from "lucide-react";
import { useFiles } from "../hooks/useFiles";
import { useOrganizations } from "../hooks/useOrganizations";
import { useProjects } from "../hooks/useProjects";
import { useMemo } from "react";
import { useState, useRef, useEffect, useCallback } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

type FileItem = {
  id: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  fileUrl: string;
  r2ObjectKey: string;
  folder?: string | null;
  status: string;
  uploadedBy?: { name?: string | null; email: string };
  uploadedByRole?: "ADMIN" | "CLIENT";
  project?: { id: string; name: string };
  organization?: { id: string; name: string };
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
  if (mimeType.startsWith("image/")) return ImageIcon;
  return Files;
}

async function fetchFileConfig(): Promise<FileConfig | null> {
  try {
    const res = await fetch(`${apiBaseUrl}/api/files/config`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error("Failed to fetch file config", e);
  }
  return null;
}

export default function FilesPage() {
  const { files, loading, deleteFile, refetch } = useFiles();
  const { organizations, refetch: refetchOrgs } = useOrganizations();
  const { projects } = useProjects();

  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [selectedFolder, setSelectedFolder] = useState<string>("All");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadFileType, setUploadFileType] = useState("FILE");
  const [uploadProjectId, setUploadProjectId] = useState("");
  const [uploadFolder, setUploadFolder] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileConfig, setFileConfig] = useState<FileConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = ["All", "Contracts", "Assets", "Invoices", "Deliverables"];

  useEffect(() => {
    fetchFileConfig().then(setFileConfig);
  }, []);

  const typedFiles = files as unknown as FileItem[];

  const filteredProjects = useMemo(() => {
    if (!selectedOrganizationId) return [];
    return (projects as any[]).filter((p) => p.organizationId === selectedOrganizationId);
  }, [projects, selectedOrganizationId]);

  const filteredFiles = typedFiles.filter((f: FileItem) => {
    if (selectedOrganizationId && f.organization?.id !== selectedOrganizationId && f.organizationId !== selectedOrganizationId) return false;
    if (selectedProjectId !== "all" && f.project?.id !== selectedProjectId && f.projectId !== selectedProjectId) return false;
    if (selectedFolder !== "All") {
      const folder = (f.folder || "").toUpperCase();
      if (selectedFolder === "Contracts" && !folder.includes("CONTRACT")) return false;
      if (selectedFolder === "Assets" && !folder.includes("ASSET")) return false;
      if (selectedFolder === "Invoices" && !folder.includes("INVOICE")) return false;
      if (selectedFolder === "Deliverables" && !folder.includes("DELIVERABLE")) return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!f.originalFilename.toLowerCase().includes(query) &&
          !(f.uploadedBy?.name?.toLowerCase().includes(query)) &&
          !(f.uploadedBy?.email?.toLowerCase().includes(query))) {
        return false;
      }
    }
    return true;
  });

  const selectedOrg = organizations.find((o: any) => o.id === selectedOrganizationId);

  const handleDelete = async (orgId: string, id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await deleteFile(orgId, id);
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleDownload = async (file: FileItem) => {
    try {
      const headers: Record<string, string> = {
        "x-admin-crm": "true",
        "x-organization-id": file.organizationId || selectedOrganizationId,
      };
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

  const handlePreview = async (file: FileItem) => {
    if (file.mimeType.startsWith("image/")) {
      try {
        const headers: Record<string, string> = {
          "x-admin-crm": "true",
          "x-organization-id": file.organizationId || selectedOrganizationId,
        };
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

  const handleUpload = async () => {
    if (!selectedOrganizationId || selectedFiles.length === 0) {
      setUploadError("Please select an organization and file(s)");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const form = new FormData();
      for (const file of selectedFiles) {
        form.append("files", file);
      }
      form.append("fileType", uploadFileType);
      form.append("folder", uploadFolder || "");
      if (uploadProjectId) form.append("projectId", uploadProjectId);

      const headers: Record<string, string> = {
        "x-admin-crm": "true",
        "x-organization-id": selectedOrganizationId,
      };

      console.log("Uploading files to organization:", selectedOrganizationId, "count:", selectedFiles.length);

      const res = await fetch(`${apiBaseUrl}/api/files`, {
        method: "POST",
        headers,
        body: form,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to upload files");
      }

      setSelectedFiles([]);
      setUploadFileType("FILE");
      setUploadProjectId("");
      setUploadFolder("");
      await refetch();
    } catch (err: any) {
      setUploadError(err?.message ?? "Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-12 relative animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-8 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Files & Assets</h3>
            <p className="text-sm text-gray-500 mt-1">Manage all uploaded documents across organizations.</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!selectedOrganizationId}
            className="h-10 px-5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={fileConfig?.allowedExtensions.join(",")}
            onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
            className="hidden"
          />
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedOrganizationId}
              onChange={(e) => {
                setSelectedOrganizationId(e.target.value);
                setSelectedProjectId("all");
              }}
              className="pl-11 pr-10 py-2.5 rounded-xl border border-gray-100 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-blue-50 cursor-pointer appearance-none min-w-[240px]"
            >
              <option value="">Select an organization...</option>
              {organizations.map((org: any) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org._count?.members ?? 0} members)
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {selectedOrganizationId && (
            <div className="relative">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="pl-11 pr-10 py-2.5 rounded-xl border border-gray-100 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-blue-50 cursor-pointer appearance-none min-w-[200px]"
              >
                <option value="all">All Projects</option>
                {filteredProjects.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          )}

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-50"
            />
          </div>

          <div className="flex rounded-xl border border-gray-100 bg-white overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {selectedOrganizationId && (
            <span className="text-sm text-gray-500">
              {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}
              {selectedOrg && ` in ${selectedOrg.name}`}
            </span>
          )}
        </div>
      </div>

      <div className="border-b border-gray-100 bg-white p-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedFolder === folder
                  ? "bg-gray-900 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Folder className="h-4 w-4" />
              {folder}
            </button>
          ))}
        </div>
      </div>

      {uploadError && (
        <div className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {uploadError}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mx-6 mt-4 p-4 rounded-xl border border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-900">{selectedFiles.length} file(s) selected</p>
            <button onClick={() => setSelectedFiles([])} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedFiles.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200">
                {f.name} ({formatFileSize(f.size)})
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <select
              value={uploadFileType}
              onChange={(e) => setUploadFileType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-50"
            >
              <option value="FILE">File</option>
              <option value="CONTRACT">Contract</option>
              <option value="ASSET">Asset</option>
              <option value="INVOICE">Invoice</option>
              <option value="DELIVERABLE">Deliverable</option>
            </select>
            <select
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-50"
            >
              <option value="">No Folder</option>
              <option value="Contracts">Contracts</option>
              <option value="Assets">Assets</option>
              <option value="Invoices">Invoices</option>
              <option value="Deliverables">Deliverables</option>
            </select>
            <select
              value={uploadProjectId}
              onChange={(e) => setUploadProjectId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-50"
            >
              <option value="">No Project</option>
              {filteredProjects.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedFiles([])}
              className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-[2] h-10 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      )}

      <div className="p-6 overflow-x-auto">
        {!selectedOrganizationId ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <div className="h-16 w-16 rounded-3xl bg-gray-50 flex items-center justify-center">
              <Building2 className="h-8 w-8" />
            </div>
            <p className="font-medium text-lg">Select an organization to view files</p>
          </div>
        ) : loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="font-medium">Loading files...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <div className="h-16 w-16 rounded-3xl bg-gray-50 flex items-center justify-center">
              <Files className="h-8 w-8" />
            </div>
            <p className="font-medium text-lg">No files found</p>
            <p className="text-sm">Upload a file to get started</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((f: FileItem) => {
              const FileIcon = getFileIcon(f.mimeType);
              return (
                <div key={f.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-blue-100">
                  <div className="aspect-square mb-4 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                    {f.mimeType.startsWith("image/") ? (
                      <img src={f.fileUrl} alt={f.originalFilename} className="h-full w-full object-cover" />
                    ) : (
                      <FileIcon className="h-12 w-12 text-gray-300" />
                    )}
                  </div>
                  <div className="min-h-0">
                    <p className="text-sm font-semibold text-gray-900 truncate" title={f.originalFilename}>
                      {f.originalFilename}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatFileSize(f.fileSize)} • {new Date(f.createdAt).toLocaleDateString()}
                    </p>
                    {f.uploadedBy && (
                      <p className="mt-1 text-xs text-gray-400 truncate">
                        by {f.uploadedBy.name || f.uploadedBy.email}
                        {f.uploadedByRole && <span className="ml-1 text-blue-500">({f.uploadedByRole})</span>}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    {f.mimeType.startsWith("image/") && (
                      <button
                        onClick={() => handlePreview(f)}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        Preview
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(f)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(f.organizationId || selectedOrganizationId, f.id)}
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">File Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type / Size</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Organization</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Uploaded By</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredFiles.map((f: FileItem) => {
                const FileIcon = getFileIcon(f.mimeType);
                return (
                  <tr key={f.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                          <FileIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 truncate max-w-xs" title={f.originalFilename}>{f.originalFilename}</p>
                          <p className="text-xs text-gray-500">{f.project?.name || f.folder || "No folder"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-gray-700">{f.mimeType.split("/")[1]?.toUpperCase() || "FILE"}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(f.fileSize)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-gray-700">{f.organization?.name || "—"}</span>
                    </td>
                    <td className="px-6 py-5">
                      {f.uploadedBy ? (
                        <span className="text-sm font-medium text-gray-700">
                          {f.uploadedBy.name || f.uploadedBy.email}
                          {f.uploadedByRole && <span className="ml-1 text-xs text-blue-500">({f.uploadedByRole})</span>}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Unknown</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-500">
                        {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : ""}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {f.mimeType.startsWith("image/") && (
                          <button
                            onClick={() => handlePreview(f)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDownload(f)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(f.organizationId || selectedOrganizationId, f.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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
        )}
      </div>

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
              src={(previewFile as any).previewUrl || previewFile.fileUrl}
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
    </section>
  );
}