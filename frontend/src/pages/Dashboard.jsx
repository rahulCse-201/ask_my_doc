import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import { api } from "../api";

function formatDate(value) {
  if (!value) return "Recently added";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function DocumentIcon() {
  return <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3.75h7.5L19 9.3v10.95H6V3.75Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M13 4v5.5h5.5M9 13h7M9 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}

function StatusBadge({ status }) {
  const style = status === "ready"
    ? "border-[#d9e8d6] bg-[#eff7ed] text-[#4a7754]"
    : status === "failed"
      ? "border-[#f0d8d2] bg-[#fff5f2] text-[#a25143]"
      : "border-[#eee3c8] bg-[#fff9e9] text-[#9a793a]";
  const label = status === "ready" ? "Ready" : status === "failed" ? "Needs attention" : "Processing";
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${style}`}><span className="size-1.5 rounded-full bg-current" />{label}</span>;
}

function StatCard({ label, value, note, icon, accent = "green" }) {
  const colors = accent === "gold" ? "bg-[#fbf4e5] text-[#9c7b3f]" : "bg-[#edf4eb] text-[#4e7b5d]";
  return (
    <div className="rounded-2xl border border-[#e7ebe4] bg-white p-5 shadow-[0_4px_16px_rgba(31,52,39,.035)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-[11px] font-semibold text-[#7f8a82]">{label}</p><p className="mt-2 font-serif text-[34px] leading-none tracking-[-1px] text-[#20362b]">{value}</p></div>
        <span className={`grid size-10 place-items-center rounded-xl ${colors}`}>{icon}</span>
      </div>
      <p className="mt-3 text-[10px] text-[#99a29b]">{note}</p>
    </div>
  );
}

export default function Dashboard({ user, onLogout, logoutError }) {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const { data } = await api.get("/documents");
      setDocuments(data);
      setLoadError("");
    } catch (error) {
      setLoadError(error.response?.data?.error || "We couldn't load your library. Try refreshing the page.");
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.get("/documents")
      .then(({ data }) => {
        if (!active) return;
        setDocuments(data);
        setLoadError("");
      })
      .catch((error) => {
        if (active) setLoadError(error.response?.data?.error || "We couldn't load your library. Try refreshing the page.");
      });
    return () => { active = false; };
  }, []);

  const uploadFile = async (file) => {
    if (!file) return;
    setUploadError("");
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Choose a PDF file to add it to your library.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("This PDF is larger than 20 MB. Choose a smaller file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    setUploading(true);
    try {
      await api.post("/documents/upload", formData);
      await fetchDocuments();
    } catch (error) {
      setUploadError(error.response?.data?.error || "Upload failed. Please try again.");
      await fetchDocuments();
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const readyCount = documents.filter((document) => document.status === "ready").length;
  const pageCount = documents.reduce((sum, document) => sum + (Number(document.pageCount) || 0), 0);

  return (
    <AppShell
      user={user}
      onLogout={onLogout}
      logoutError={logoutError}
      eyebrow="YOUR WORKSPACE"
      title="Your library, at a glance."
      description="Bring your reading together. Upload a PDF, then ask a question when it’s ready."
      actions={<Link to="/chat" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#245c49] px-4 text-[11px] font-bold text-white no-underline transition hover:bg-[#194b3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9ebba7]">Ask your docs <span aria-hidden="true">↗</span></Link>}
    >
      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4" aria-label="Library summary">
        <StatCard label="In your library" value={documents.length} note="PDFs you’ve added" icon={<DocumentIcon />} />
        <StatCard label="Ready to explore" value={readyCount} note="Indexed and available to chat" icon={<svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <StatCard label="Pages indexed" value={pageCount} note="Across your ready PDFs" accent="gold" icon={<svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 4h10M7 8h10M7 12h7m-9-9h14v18H5V3Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className={`mb-7 overflow-hidden rounded-2xl border bg-white shadow-[0_5px_20px_rgba(31,52,39,.035)] transition ${dragging ? "border-[#6f9a7b] ring-4 ring-[#dfeade]" : "border-[#e5ebe3]"}`} aria-labelledby="upload-title">
        <div
          className="flex cursor-pointer flex-col items-center px-5 py-8 text-center sm:px-8 sm:py-10"
          onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false); }}
          onDrop={(event) => { event.preventDefault(); setDragging(false); uploadFile(event.dataTransfer.files?.[0]); }}
          onClick={(event) => { if (event.target !== inputRef.current && !uploading) inputRef.current?.click(); }}
          onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && !uploading) { event.preventDefault(); inputRef.current?.click(); } }}
          role="button"
          tabIndex={0}
          aria-label="Choose a PDF or drop it here to upload"
        >
          <input ref={inputRef} className="sr-only" type="file" accept="application/pdf,.pdf" aria-label="Choose a PDF file" tabIndex={-1} disabled={uploading} onChange={(event) => uploadFile(event.target.files?.[0])} />
          <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-[#edf4eb] text-[#4d7a5c]">
            {uploading ? <span className="size-5 animate-spin rounded-full border-2 border-[#bdd0bc] border-t-[#32654b]" aria-hidden="true" /> : <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15.5v3A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          <h2 id="upload-title" className="font-serif text-[21px] tracking-[-.4px] text-[#263b30]">{uploading ? "Making your PDF searchable…" : "Add a document to your library"}</h2>
          <p className="mt-1.5 max-w-md text-[11px] leading-relaxed text-[#849087]">{uploading ? "We’re reading the pages and preparing them for questions." : "Drop a PDF here, or click to browse your files. Text-based PDFs up to 20 MB."}</p>
          {!uploading && <span className="mt-4 rounded-lg border border-[#dce6dc] bg-[#fbfcfa] px-3.5 py-2 text-[10px] font-semibold text-[#426b54]">Choose PDF</span>}
        </div>
        {uploadError && <p role="alert" className="border-t border-[#f1ded8] bg-[#fff8f6] px-5 py-3 text-xs text-[#a3473d] sm:px-8">{uploadError}</p>}
      </section>

      <section aria-labelledby="library-title">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div><p className="mb-1 text-[9px] font-bold tracking-[1.5px] text-[#87938a]">YOUR COLLECTION</p><h2 id="library-title" className="font-serif text-[23px] tracking-[-.5px] text-[#24382e]">Documents</h2></div>
          <span className="pb-1 text-[10px] text-[#929d95]">{documents.length} {documents.length === 1 ? "file" : "files"}</span>
        </div>

        {loadError && <p role="alert" className="mb-3 rounded-xl border border-[#f0d8d2] bg-[#fff8f6] px-4 py-3 text-xs text-[#a3473d]">{loadError}</p>}

        {documents.length === 0 && !loadError ? (
          <div className="rounded-2xl border border-dashed border-[#dfe7dd] bg-white px-5 py-10 text-center">
            <span className="mx-auto mb-3 grid size-10 place-items-center rounded-xl bg-[#f3f6f0] text-[#7d9783]"><DocumentIcon /></span>
            <p className="text-sm font-semibold text-[#506157]">Your library is ready for its first PDF.</p>
            <p className="mt-1 text-[11px] text-[#929d95]">Add a document above to start asking questions.</p>
          </div>
        ) : documents.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-[#e6ebe4] bg-white shadow-[0_4px_16px_rgba(31,52,39,.03)]">
            <div className="hidden grid-cols-[minmax(0,1fr)_100px_145px_125px] gap-3 border-b border-[#edf0eb] bg-[#fbfcfa] px-5 py-3 text-[9px] font-bold tracking-[1.1px] text-[#929d95] sm:grid sm:px-6">
              <span>DOCUMENT</span><span>PAGES</span><span>STATUS</span><span>ADDED</span>
            </div>
            <ul className="divide-y divide-[#edf0eb]">
              {documents.map((document) => (
                <li key={document._id} className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_100px_145px_125px] sm:items-center sm:gap-3 sm:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f5eee7] text-[#a46450]"><DocumentIcon /></span>
                    <div className="min-w-0"><p className="truncate text-[12px] font-semibold text-[#35463c]" title={document.filename}>{document.filename}</p><p className="mt-1 text-[10px] text-[#9aa39c]">PDF document</p></div>
                  </div>
                  <span className="pl-[52px] text-[10px] text-[#78867d] sm:pl-0">{document.pageCount ? `${document.pageCount} pages` : "—"}</span>
                  <span className="pl-[52px] sm:pl-0"><StatusBadge status={document.status} /></span>
                  <span className="pl-[52px] text-[10px] text-[#909b93] sm:pl-0">{formatDate(document.createdAt)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </AppShell>
  );
}
