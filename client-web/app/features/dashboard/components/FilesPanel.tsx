export default function FilesPanel({
  userStatus,
  accessToken,
  organizationId,
  liveProjects,
  liveFiles,
  fileProjectId,
  setFileProjectId,
  uploadFile,
  setUploadFile,
  uploadError,
  isUploading,
  handleUploadFile,
  handleDeleteFile,
}: {
  userStatus: string;
  accessToken: string | null;
  organizationId: string | null;
  liveProjects: Array<{ id: string | number; title: string }>;
  liveFiles: Array<{ id: string | number; title: string; status: string }>;
  fileProjectId: string | null;
  setFileProjectId: (next: string | null) => void;
  uploadFile: File | null;
  setUploadFile: (next: File | null) => void;
  uploadError: string | null;
  isUploading: boolean;
  handleUploadFile: () => Promise<void> | void;
  handleDeleteFile: (fileId: string | number) => Promise<void> | void;
}) {
  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">Upload File</p>
        <div className="mt-3 space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Project</span>
            <select
              value={fileProjectId ?? ""}
              onChange={(e) => setFileProjectId(e.target.value || null)}
              disabled={liveProjects.length === 0}
              className="mt-1 w-full rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            >
              {liveProjects.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">File</span>
            <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} className="mt-1 w-full" />
          </label>
          {uploadError && (
            <p className="text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
              {uploadError}
            </p>
          )}
          <button
            onClick={handleUploadFile}
            disabled={
              !uploadFile ||
              !accessToken ||
              !organizationId ||
              isUploading ||
              userStatus !== "ACTIVE_CLIENT"
            }
            className="group relative inline-flex items-center justify-center gap-3 h-12 px-8 rounded-2xl bg-gray-900 text-white font-bold transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {liveFiles.map((file) => (
          <div
            key={file.id}
            className="rounded-xl border border-gray-100 bg-white px-4 py-3 flex items-center justify-between gap-3"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">{file.title}</p>
              <p className="mt-1 text-xs text-gray-500">{file.status}</p>
            </div>
            <button
              onClick={() => handleDeleteFile(file.id)}
              disabled={userStatus !== "ACTIVE_CLIENT"}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50"
            >
              Delete
            </button>
          </div>
        ))}

        {liveFiles.length === 0 && <p className="text-sm text-gray-500">No records available.</p>}
      </div>
    </div>
  );
}

