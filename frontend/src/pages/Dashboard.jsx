// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Dashboard({ user, onLogout, logoutError }) {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [uploadError, setUploadError] = useState("");

  const fetchDocuments = async () => {
    try {
      const res = await api.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      setLoadError(err.response?.data?.error || "Could not load your documents. Please refresh the page.");
    }
  };

  useEffect(() => {
    let active = true;
    api.get("/documents")
      .then(({ data }) => { if (active) setDocuments(data); })
      .catch((err) => { if (active) setLoadError(err.response?.data?.error || "Could not load your documents. Please refresh the page."); });
    return () => { active = false; };
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";

    const formData = new FormData();
    formData.append("pdf", file);

    setUploading(true);
    setUploadError("");
    try {
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      await fetchDocuments();
    } catch (err) {
      setUploadError(err.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Your Documents</h1>
          <p className="text-sm text-gray-500">Signed in as {user.email}</p>
        </div>
        <div className="flex gap-3 items-center">
          <Link to="/chat" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Go to Chat →</Link>
          <button type="button" onClick={onLogout} className="border px-4 py-2 rounded">Log out</button>
        </div>
      </div>
      {logoutError && <p role="alert" className="text-red-600 mb-4">{logoutError}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-2 border-dashed border-gray-300">
        <h2 className="text-xl font-semibold mb-4">Upload a new PDF</h2>
        <input 
          type="file" accept=".pdf" onChange={handleFileUpload} disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploading && <p className="text-blue-600 mt-2 animate-pulse">Processing and embedding PDF...</p>}
        {uploadError && <p role="alert" className="text-red-600 mt-2">{uploadError}</p>}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Library</h2>
        {loadError && <p role="alert" className="text-red-600 mb-3">{loadError}</p>}
        {documents.length === 0 ? (
          <p className="text-gray-500">No documents uploaded yet.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map(doc => (
              <li key={doc._id} className="flex justify-between p-3 bg-gray-50 border rounded">
                <span className="font-medium text-gray-700">📄 {doc.filename}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${doc.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {doc.status.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
